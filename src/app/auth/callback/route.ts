import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// This route handles Supabase email confirmation links.
// When a user clicks "Confirm your email" in their inbox, Supabase
// redirects them here with a ?code= parameter. We exchange that code
// for a session, then redirect them to the dashboard.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  if (code) {
    const response = NextResponse.redirect(new URL(redirect, origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // If no code or exchange failed, redirect to sign-in with error
  return NextResponse.redirect(
    new URL("/sign-in?error=confirmation_failed", request.url)
  );
}
