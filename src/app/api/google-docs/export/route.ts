import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import {
  isGoogleConfigured,
  getAuthenticatedClient,
  GOOGLE_TOKEN_COOKIE,
} from "@/lib/google-oauth";

// Simple HTML tag stripper that preserves text and basic structure
function htmlToPlainSections(html: string): { text: string; bold: boolean }[] {
  const sections: { text: string; bold: boolean }[] = [];

  // Remove script/style tags entirely
  let cleaned = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Replace <br> and block-level closing tags with newlines
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");
  cleaned = cleaned.replace(/<\/(div|p|h[1-6]|li|tr)>/gi, "\n");
  cleaned = cleaned.replace(/<\/(td|th)>/gi, "\t");

  // Extract bold/strong content specially
  const boldPattern = /<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match;

  while ((match = boldPattern.exec(cleaned)) !== null) {
    // Text before this bold section
    const before = cleaned.slice(lastIndex, match.index);
    const beforeText = stripTags(before);
    if (beforeText) {
      sections.push({ text: beforeText, bold: false });
    }
    // Bold text
    const boldText = stripTags(match[2]);
    if (boldText) {
      sections.push({ text: boldText, bold: true });
    }
    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  const remaining = cleaned.slice(lastIndex);
  const remainingText = stripTags(remaining);
  if (remainingText) {
    sections.push({ text: remainingText, bold: false });
  }

  return sections;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  try {
    if (!isGoogleConfigured()) {
      return NextResponse.json(
        {
          error: "Google OAuth not configured",
          message:
            "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local",
        },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(GOOGLE_TOKEN_COOKIE);

    if (!tokenCookie?.value) {
      return NextResponse.json(
        {
          error: "Not connected",
          message: "Connect your Google account in Settings first.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, outputHtml, elLevel, scaffoldsApplied } = body;

    if (!title || !outputHtml) {
      return NextResponse.json(
        { error: "Title and outputHtml are required" },
        { status: 400 }
      );
    }

    const auth = await getAuthenticatedClient(tokenCookie.value);
    const docs = google.docs({ version: "v1", auth });

    // 1. Create a new Google Doc
    const createResponse = await docs.documents.create({
      requestBody: {
        title: `${title} - ${elLevel} Scaffolded`,
      },
    });

    const docId = createResponse.data.documentId;
    if (!docId) {
      throw new Error("Failed to create Google Doc");
    }

    // 2. Build document content requests
    const requests: Array<Record<string, unknown>> = [];

    // Add header
    const headerText = `${title}\n${elLevel} Level - Scaffolded Assignment\nScaffolds: ${(scaffoldsApplied as string[]).join(", ")}\n\n`;

    requests.push({
      insertText: {
        location: { index: 1 },
        text: headerText,
      },
    });

    // Style the title (first line)
    const titleEnd = title.length + 1;
    requests.push({
      updateParagraphStyle: {
        range: { startIndex: 1, endIndex: titleEnd },
        paragraphStyle: {
          namedStyleType: "HEADING_1",
        },
        fields: "namedStyleType",
      },
    });

    // Style subtitle
    const subtitleStart = titleEnd;
    const subtitleEnd = headerText.indexOf("\n", subtitleStart) + 1;
    requests.push({
      updateTextStyle: {
        range: { startIndex: subtitleStart, endIndex: subtitleEnd },
        textStyle: {
          fontSize: { magnitude: 11, unit: "PT" },
          foregroundColor: {
            color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } },
          },
        },
        fields: "fontSize,foregroundColor",
      },
    });

    // Add horizontal rule after header
    requests.push({
      insertText: {
        location: { index: 1 + headerText.length },
        text: "────────────────────────────────\n\n",
      },
    });

    const contentOffset = 1 + headerText.length + 34; // 34 = divider + newlines

    // 3. Convert HTML to text sections and insert
    const sections = htmlToPlainSections(outputHtml);
    let fullText = "";
    for (const section of sections) {
      fullText += section.text;
    }

    if (fullText) {
      requests.push({
        insertText: {
          location: { index: contentOffset },
          text: fullText,
        },
      });

      // Apply bold formatting where needed
      let currentIndex = contentOffset;
      for (const section of sections) {
        if (section.bold && section.text.length > 0) {
          requests.push({
            updateTextStyle: {
              range: {
                startIndex: currentIndex,
                endIndex: currentIndex + section.text.length,
              },
              textStyle: { bold: true },
              fields: "bold",
            },
          });
        }
        currentIndex += section.text.length;
      }
    }

    // 4. Apply batch update
    if (requests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: { requests },
      });
    }

    const docUrl = `https://docs.google.com/document/d/${docId}/edit`;

    return NextResponse.json({
      success: true,
      docId,
      docUrl,
    });
  } catch (error) {
    console.error("Google Docs export error:", error);

    const message =
      error instanceof Error ? error.message : "Export failed";

    // Check if it's an auth error
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

    return NextResponse.json(
      { error: "Export failed", message },
      { status: 500 }
    );
  }
}
