import { NextRequest, NextResponse } from "next/server";
import {
  isGoogleConfigured,
  getAuthUrl,
  buildCallbackUrl,
} from "@/lib/google-oauth";

export async function GET(request: NextRequest) {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      {
        error: "Google OAuth not configured",
        message:
          "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file.",
      },
      { status: 503 }
    );
  }

  const callbackUrl = buildCallbackUrl(request.url);
  const url = getAuthUrl(callbackUrl);
  return NextResponse.redirect(url);
}
