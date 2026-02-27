import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isGoogleConfigured,
  getUserEmail,
  loadGoogleToken,
  saveGoogleToken,
  GOOGLE_TOKEN_COOKIE,
} from "@/lib/google-oauth";
import { getAuthUser } from "@/lib/get-auth-user";

export async function GET(request: NextRequest) {
  const configured = isGoogleConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      connected: false,
      email: null,
    });
  }

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(GOOGLE_TOKEN_COOKIE);
  let refreshToken = tokenCookie?.value ?? null;
  let tokenSource: "cookie" | "db" | null = refreshToken ? "cookie" : null;

  // If the cookie is missing, try to restore from the database
  if (!refreshToken) {
    const user = await getAuthUser(request);
    if (user) {
      const stored = await loadGoogleToken(user.id);
      if (stored) {
        refreshToken = stored.refreshToken;
        tokenSource = "db";
      }
    }
  }

  if (!refreshToken) {
    return NextResponse.json({
      configured: true,
      connected: false,
      email: null,
    });
  }

  // Verify the token is still valid by fetching the user's email
  const email = await getUserEmail(refreshToken);

  if (!email) {
    // Token is invalid or expired beyond refresh
    return NextResponse.json({
      configured: true,
      connected: false,
      email: null,
    });
  }

  // --- Sync: ensure BOTH cookie and DB are populated -----------------------
  // If the token came from the cookie but the DB row is missing (e.g. the
  // callback couldn't resolve the Supabase user), back-fill the DB now.
  const user = await getAuthUser(request);
  if (tokenSource === "cookie" && user) {
    const stored = await loadGoogleToken(user.id);
    if (!stored) {
      await saveGoogleToken(user.id, refreshToken, email);
    }
  }

  // Build response — restore the cookie if it was missing
  const body = { configured: true, connected: true, email };
  const response = NextResponse.json(body);

  if (!tokenCookie?.value) {
    response.cookies.set(GOOGLE_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}
