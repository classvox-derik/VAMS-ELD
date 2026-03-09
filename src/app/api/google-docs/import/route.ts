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
import type { DocImage } from "@/types";

// Max total image payload (8 MB) and per-image limit (2 MB)
const MAX_TOTAL_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_SINGLE_IMAGE_BYTES = 2 * 1024 * 1024;

// Extract document ID from various Google Docs URL formats
function extractDocId(url: string): string | null {
  // Format: https://docs.google.com/document/d/DOCUMENT_ID/...
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

// Download an image from a Google Docs contentUri using the OAuth access token
async function downloadImage(
  contentUri: string,
  accessToken: string,
): Promise<{ base64: string; mimeType: string; byteLength: number } | null> {
  try {
    const response = await fetch(contentUri, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_SINGLE_IMAGE_BYTES) return null;

    const mimeType = response.headers.get("content-type") || "image/png";
    return {
      base64: `data:${mimeType};base64,${buffer.toString("base64")}`,
      mimeType,
      byteLength: buffer.byteLength,
    };
  } catch (err) {
    console.warn("[Import] Failed to download image:", err);
    return null;
  }
}

// Google Docs inline object shape (from documents.get response)
interface InlineObjectMap {
  [objectId: string]: {
    inlineObjectProperties?: {
      embeddedObject?: {
        imageProperties?: {
          contentUri?: string;
        };
        size?: {
          width?: { magnitude?: number };
          height?: { magnitude?: number };
        };
        title?: string;
        description?: string;
      };
    };
  };
}

interface ParagraphElement {
  textRun?: { content?: string };
  inlineObjectElement?: { inlineObjectId?: string };
}

interface ExtractResult {
  text: string;
  imageObjectIds: string[]; // ordered list of encountered objectIds
}

// Convert Google Docs structural elements to plain text, inserting image placeholders
function extractTextWithImages(
  elements: Array<Record<string, unknown>>,
  imageObjectIds: string[] = [],
): ExtractResult {
  let text = "";

  for (const element of elements) {
    if (element.paragraph) {
      const paragraph = element.paragraph as {
        elements?: ParagraphElement[];
      };
      for (const el of paragraph.elements ?? []) {
        if (el.textRun?.content) {
          text += el.textRun.content;
        } else if (el.inlineObjectElement?.inlineObjectId) {
          const objId = el.inlineObjectElement.inlineObjectId;
          const imgIdx = imageObjectIds.length;
          imageObjectIds.push(objId);
          text += `[IMG:img_${imgIdx}]`;
        }
      }
    } else if (element.table) {
      const table = element.table as {
        tableRows?: Array<{
          tableCells?: Array<{
            content?: Array<Record<string, unknown>>;
          }>;
        }>;
      };
      for (const row of table.tableRows ?? []) {
        const cells: string[] = [];
        for (const cell of row.tableCells ?? []) {
          const result = extractTextWithImages(cell.content ?? [], imageObjectIds);
          cells.push(result.text.trim());
        }
        text += cells.join("\t") + "\n";
      }
    }
  }

  return { text, imageObjectIds };
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
    const docs = google.docs({ version: "v1", auth });

    // Fetch the document
    const doc = await docs.documents.get({ documentId: docId });

    const title = doc.data.title ?? "Untitled";
    const body2 = doc.data.body;

    if (!body2?.content) {
      return NextResponse.json(
        { error: "Document is empty or could not be read." },
        { status: 400 }
      );
    }

    // Extract text with image placeholders
    const { text: content, imageObjectIds } = extractTextWithImages(
      body2.content as Array<Record<string, unknown>>
    );

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return NextResponse.json(
        { error: "No text content found in this document." },
        { status: 400 }
      );
    }

    // Extract images from inlineObjects
    const images: DocImage[] = [];
    const inlineObjects = (doc.data.inlineObjects ?? {}) as InlineObjectMap;
    const accessToken = (await auth.getAccessToken()).token;

    if (accessToken && imageObjectIds.length > 0) {
      let totalBytes = 0;

      for (let i = 0; i < imageObjectIds.length; i++) {
        const objId = imageObjectIds[i];
        const obj = inlineObjects[objId];
        const embedded = obj?.inlineObjectProperties?.embeddedObject;
        const contentUri = embedded?.imageProperties?.contentUri;

        // Skip non-image objects (drawings, etc.)
        if (!contentUri) continue;

        // Stop if total payload would exceed limit
        if (totalBytes >= MAX_TOTAL_IMAGE_BYTES) {
          console.warn(`[Import] Skipping remaining images — total exceeds ${MAX_TOTAL_IMAGE_BYTES} bytes`);
          break;
        }

        const downloaded = await downloadImage(contentUri, accessToken);
        if (!downloaded) continue;

        totalBytes += downloaded.byteLength;

        images.push({
          id: `img_${i}`,
          base64: downloaded.base64,
          mimeType: downloaded.mimeType,
          width: embedded?.size?.width?.magnitude,
          height: embedded?.size?.height?.magnitude,
        });
      }

      console.log(`[Import] Extracted ${images.length} image(s), total ~${Math.round(totalBytes / 1024)} KB`);
    }

    return NextResponse.json({
      success: true,
      title,
      content: trimmedContent,
      docId,
      images: images.length > 0 ? images : undefined,
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
