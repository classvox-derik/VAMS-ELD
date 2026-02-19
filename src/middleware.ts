import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/google-auth(.*)",
]);

// Server-side email domain restriction
const ALLOWED_DOMAIN =
  process.env.ALLOWED_EMAIL_DOMAIN ?? "@brightstarschools.org";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured =
  clerkKey && clerkKey.startsWith("pk_") && !clerkKey.includes("placeholder");

export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        // Require authentication on protected routes
        const session = await auth.protect();

        // If a user bypassed client-side check and signed up with a
        // non-Bright Star email, redirect them out of the app.
        const email = session.sessionClaims?.email as string | undefined;
        if (email && !email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
          const signInUrl = new URL("/sign-in", req.url);
          signInUrl.searchParams.set("error", "unauthorized_domain");
          return NextResponse.redirect(signInUrl);
        }
      }
    })
  : function () {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
