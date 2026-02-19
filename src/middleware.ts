import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-middleware";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/api/webhooks", "/api/google-auth"];

// Only @brightstarschools.org emails can access the app
const ALLOWED_DOMAIN =
  process.env.ALLOWED_EMAIL_DOMAIN ?? "@brightstarschools.org";

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { pathname } = request.nextUrl;

  // Refresh session (keeps cookies alive)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow public routes through
  if (isPublicRoute(pathname)) {
    // If user is already logged in and visits sign-in/sign-up, redirect to dashboard
    if (user && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return response;
  }

  // Protected route — require authentication
  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Server-side email domain enforcement:
  // If a user somehow signed up with a non-Bright Star email, block access.
  const email = user.email?.toLowerCase() ?? "";
  if (email && !email.endsWith(ALLOWED_DOMAIN)) {
    // Sign them out and redirect
    await supabase.auth.signOut();
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("error", "unauthorized_domain");
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
