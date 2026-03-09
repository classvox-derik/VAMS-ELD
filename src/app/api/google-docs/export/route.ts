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
import { buildDocumentRequests } from "@/lib/html-to-google-docs";
import type { ScaffoldAction } from "@/types";

export async function POST(request: NextRequest) {
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
    const {
      title,
      outputHtml,
      elLevel,
      scaffoldsApplied,
      wordBank,
      teacherInstructions,
      sourceDocId,
      scaffoldActions,
    } = body;

    console.log("[Export] Received request:", {
      title,
      hasOutputHtml: !!outputHtml,
      elLevel,
      sourceDocId: sourceDocId || "(none)",
      scaffoldActionsCount: Array.isArray(scaffoldActions) ? scaffoldActions.length : 0,
      scaffoldActionsType: typeof scaffoldActions,
    });

    if (!title || !outputHtml) {
      return NextResponse.json(
        { error: "Title and outputHtml are required" },
        { status: 400 }
      );
    }

    const auth = await getAuthenticatedClient(refreshToken);

    // -----------------------------------------------------------------------
    // Clone + Apply path: when source is a Google Doc with scaffold actions
    // -----------------------------------------------------------------------
    if (sourceDocId && scaffoldActions?.length > 0) {
      try {
        const drive = google.drive({ version: "v3", auth });

        // 1. Clone the original document
        const copyResponse = await drive.files.copy({
          fileId: sourceDocId,
          requestBody: {
            name: `${title} - ${elLevel} Scaffolded`,
          },
        });

        const clonedDocId = copyResponse.data.id;
        if (!clonedDocId) {
          throw new Error("Failed to clone Google Doc");
        }

        // 2. Apply scaffold modifications to the clone
        const { applyScaffoldsToClonedDoc } = await import(
          "@/lib/google-docs-scaffolder"
        );
        const stats = await applyScaffoldsToClonedDoc(
          auth,
          clonedDocId,
          scaffoldActions as ScaffoldAction[],
          elLevel
        );

        const docUrl = `https://docs.google.com/document/d/${clonedDocId}/edit`;

        return NextResponse.json({
          success: true,
          docId: clonedDocId,
          docUrl,
          exportMethod: "clone_and_apply",
          scaffoldStats: stats,
        });
      } catch (cloneError) {
        // If clone fails, fall through to HTML-based export
        console.error(
          "Clone+apply export failed, falling back to HTML export:",
          cloneError
        );
      }
    }

    // -----------------------------------------------------------------------
    // HTML-based path: create new doc from scaffolded HTML (original flow)
    // -----------------------------------------------------------------------
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

    // 2. Build formatted document content via HTML-to-Docs converter
    const requests = buildDocumentRequests({
      title,
      elLevel,
      scaffoldsApplied: scaffoldsApplied as string[],
      outputHtml,
      wordBank: wordBank ?? null,
      teacherInstructions: teacherInstructions ?? null,
    });

    // 3. Apply batch update
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
      exportMethod: "html_to_doc",
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
