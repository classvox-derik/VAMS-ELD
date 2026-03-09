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
    console.log("[Export] Clone path check:", {
      hasSourceDocId: !!sourceDocId,
      hasScaffoldActions: Array.isArray(scaffoldActions) && scaffoldActions.length > 0,
      willUseClonePath: !!(sourceDocId && scaffoldActions?.length > 0),
    });

    let cloneFallbackReason: string | null = null;

    if (sourceDocId && scaffoldActions?.length > 0) {
      try {
        const drive = google.drive({ version: "v3", auth });

        // 1. Clone the original document
        console.log("[Export] Cloning Google Doc:", sourceDocId);
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

        console.log("[Export] Clone+apply succeeded:", {
          clonedDocId,
          stats,
        });

        const docUrl = `https://docs.google.com/document/d/${clonedDocId}/edit`;

        return NextResponse.json({
          success: true,
          docId: clonedDocId,
          docUrl,
          exportMethod: "clone_and_apply",
          scaffoldStats: stats,
        });
      } catch (cloneError) {
        const errMsg =
          cloneError instanceof Error ? cloneError.message : String(cloneError);
        console.error(
          "[Export] Clone+apply failed, falling back to HTML export:",
          errMsg,
          cloneError
        );
        cloneFallbackReason = errMsg;

        // If it's a scope/auth issue, surface it clearly
        if (
          errMsg.includes("insufficient") ||
          errMsg.includes("scope") ||
          errMsg.includes("forbidden") ||
          errMsg.includes("403")
        ) {
          cloneFallbackReason =
            "Google Drive permissions insufficient. Please disconnect and reconnect your Google account in Settings to grant updated permissions.";
        }
      }
    } else if (sourceDocId && (!scaffoldActions || scaffoldActions.length === 0)) {
      cloneFallbackReason =
        "No scaffold actions were generated for format preservation. The AI may not have produced targeted modifications for this document.";
      console.warn("[Export] sourceDocId present but no scaffoldActions — falling back to HTML");
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
      cloneFallbackReason,
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
