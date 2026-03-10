import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import {
  isGoogleConfigured,
  getAuthenticatedClient,
  loadGoogleToken,
  GOOGLE_TOKEN_COOKIE,
} from "@/lib/google-oauth";
import { getAuthUser } from "@/lib/get-auth-user";

// Extract document ID from various Google Docs URL formats
function extractDocId(url: string): string | null {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

// Extract plain text from Google Docs structural elements (for validation & Gemini scaffold_actions)
function extractText(elements: Array<Record<string, unknown>>): string {
  let text = "";
  for (const element of elements) {
    if (element.paragraph) {
      const paragraph = element.paragraph as {
        elements?: Array<{ textRun?: { content?: string } }>;
      };
      for (const el of paragraph.elements ?? []) {
        if (el.textRun?.content) text += el.textRun.content;
      }
    } else if (element.table) {
      const table = element.table as {
        tableRows?: Array<{
          tableCells?: Array<{ content?: Array<Record<string, unknown>> }>;
        }>;
      };
      for (const row of table.tableRows ?? []) {
        const cells: string[] = [];
        for (const cell of row.tableCells ?? []) {
          cells.push(extractText(cell.content ?? []).trim());
        }
        text += cells.join("\t") + "\n";
      }
    }
  }
  return text;
}

/**
 * Extract the <body> inner HTML and essential <style> from Google's HTML export.
 * Google wraps everything in <html><head><style>...</style></head><body>...</body></html>.
 * We keep the styles so formatting is preserved, and wrap them with the body content.
 */
function extractHtmlBody(rawHtml: string): string {
  // Extract <style> blocks from <head>
  const styleMatches = rawHtml.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
  const styles = styleMatches ? styleMatches.join("\n") : "";

  // Extract <body> inner content
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

  // Combine styles + body in a scoped wrapper div
  return `<div class="google-doc-import">${styles}${bodyContent}</div>`;
}

export async function POST(request: NextRequest) {
  try {
    if (!isGoogleConfigured()) {
      return NextResponse.json(
        {
          error: "Google OAuth not configured",
          message: "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local",
        },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(GOOGLE_TOKEN_COOKIE);
    let refreshToken = tokenCookie?.value ?? null;

    // Fall back to database if cookie is missing
    if (!refreshToken) {
      const user = await getAuthUser(request);
      if (user) {
        const stored = await loadGoogleToken(user.id);
        if (stored) refreshToken = stored.refreshToken;
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: "Not connected",
          message: "Connect your Google account in Settings first.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A Google Docs URL is required." },
        { status: 400 }
      );
    }

    const docId = extractDocId(url);
    if (!docId) {
      return NextResponse.json(
        {
          error: "Invalid Google Docs URL",
          message:
            "Please paste a valid link like https://docs.google.com/document/d/...",
        },
        { status: 400 }
      );
    }

    const auth = await getAuthenticatedClient(refreshToken);

    // Run both API calls in parallel:
    // 1. Google Docs API — get document title + plain text (for validation & scaffold_actions)
    // 2. Google Drive API — export as HTML (for 1:1 visual replica)
    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });

    // Always fetch the document structure (title + plain text)
    const docResult = await docs.documents.get({ documentId: docId });

    const title = docResult.data.title ?? "Untitled";
    const docBody = docResult.data.body;

    if (!docBody?.content) {
      return NextResponse.json(
        { error: "Document is empty or could not be read." },
        { status: 400 }
      );
    }

    // Plain text for validation and AI scaffolding
    const content = extractText(docBody.content as Array<Record<string, unknown>>).trim();

    if (!content) {
      return NextResponse.json(
        { error: "No text content found in this document." },
        { status: 400 }
      );
    }

    // Try to get full HTML from Drive export — may fail for very large docs
    let sourceHtml: string | null = null;
    try {
      const htmlResult = await drive.files.export(
        { fileId: docId, mimeType: "text/html" },
        { responseType: "text" }
      );
      const rawHtml = htmlResult.data as string;
      sourceHtml = extractHtmlBody(rawHtml);
      console.log(`[Import] Imported "${title}" — plaintext: ${content.length} chars, HTML: ${sourceHtml.length} chars`);
    } catch (htmlErr) {
      const errMsg = htmlErr instanceof Error ? htmlErr.message : String(htmlErr);
      console.warn(`[Import] HTML export failed for "${title}" (will use plain text only):`, errMsg);
    }

    return NextResponse.json({
      success: true,
      title,
      content,
      docId,
      sourceHtml,
    });
  } catch (error) {
    console.error("Google Docs import error:", error);

    const message =
      error instanceof Error ? error.message : "Import failed";

    if (message.includes("invalid_grant") || message.includes("Token")) {
      return NextResponse.json(
        {
          error: "Authentication expired",
          message:
            "Your Google connection has expired. Please reconnect in Settings.",
        },
        { status: 401 }
      );
    }

    if (message.includes("not found") || message.includes("404")) {
      return NextResponse.json(
        {
          error: "Document not found",
          message:
            "Could not access this document. Make sure it exists and your Google account has permission to view it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Import failed", message },
      { status: 500 }
    );
  }
}
