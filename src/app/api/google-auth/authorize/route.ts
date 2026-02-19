import { NextResponse } from "next/server";
import { isGoogleConfigured, getAuthUrl } from "@/lib/google-oauth";

export async function GET() {
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

  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
