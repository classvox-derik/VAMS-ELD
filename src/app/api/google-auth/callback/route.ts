import { NextResponse } from "next/server";
import {
  isGoogleConfigured,
  exchangeCodeForTokens,
  GOOGLE_TOKEN_COOKIE,
} from "@/lib/google-oauth";

export async function GET(request: Request) {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      { error: "Google OAuth not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    // User denied consent or some error
    const redirectUrl = new URL("/settings", request.url);
    redirectUrl.searchParams.set("google_error", error);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 }
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      const redirectUrl = new URL("/settings", request.url);
      redirectUrl.searchParams.set("google_error", "no_refresh_token");
      return NextResponse.redirect(redirectUrl);
    }

    const redirectUrl = new URL("/settings", request.url);
    redirectUrl.searchParams.set("connected", "true");

    const response = NextResponse.redirect(redirectUrl);

    // Store refresh token in httpOnly cookie
    response.cookies.set(GOOGLE_TOKEN_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    const redirectUrl = new URL("/settings", request.url);
    redirectUrl.searchParams.set("google_error", "token_exchange_failed");
    return NextResponse.redirect(redirectUrl);
  }
}
