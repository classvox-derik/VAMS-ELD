import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isGoogleConfigured,
  getUserEmail,
  GOOGLE_TOKEN_COOKIE,
} from "@/lib/google-oauth";

export async function GET() {
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

  if (!tokenCookie?.value) {
    return NextResponse.json({
      configured: true,
      connected: false,
      email: null,
    });
  }

  // Try to get the user's email to verify the token is still valid
  const email = await getUserEmail(tokenCookie.value);

  if (!email) {
    // Token is invalid or expired beyond refresh
    return NextResponse.json({
      configured: true,
      connected: false,
      email: null,
    });
  }

  return NextResponse.json({
    configured: true,
    connected: true,
    email,
  });
}
