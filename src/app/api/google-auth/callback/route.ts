import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  isGoogleConfigured,
  exchangeCodeForTokens,
  getUserEmail,
  saveGoogleToken,
  GOOGLE_TOKEN_COOKIE,
} from "@/lib/google-oauth";

/**
 * Read the Supabase user directly from the request cookies.
 *
 * We intentionally avoid the shared `getAuthUser` helper here because this
 * route is hit via a cross-origin redirect from Google.  The helper creates a
 * throw-away NextResponse for the Supabase cookie writer — if the session
 * needs a token refresh during the redirect the refreshed cookies are lost and
 * `getUser()` can return null.
 *
 * Instead we create a Supabase client whose `setAll` writes refreshed tokens
 * directly onto the redirect `response` we already have, so they travel back
 * to the browser together with the Google token cookie.
 */
async function getCallbackUser(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write refreshed Supabase tokens onto the redirect response so the
          // browser receives them in the same round-trip.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
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

    // Persist to database so the connection survives cookie clears / logouts.
    // Use getCallbackUser which writes refreshed Supabase session cookies onto
    // the same redirect response, avoiding the stale-token problem.
    const user = await getCallbackUser(request, response);
    if (user) {
      const email = await getUserEmail(tokens.refresh_token);
      await saveGoogleToken(user.id, tokens.refresh_token, email);
    } else {
      // Log so we can diagnose — the token is still in the cookie and the
      // status route will back-fill the DB row on the next check.
      console.warn(
        "Google OAuth callback: could not resolve Supabase user — " +
          "token saved to cookie only; DB will be synced on next status check."
      );
    }

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    const redirectUrl = new URL("/settings", request.url);
    redirectUrl.searchParams.set("google_error", "token_exchange_failed");
    return NextResponse.redirect(redirectUrl);
  }
}
