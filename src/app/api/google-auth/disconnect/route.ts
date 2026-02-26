import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_TOKEN_COOKIE, deleteGoogleToken } from "@/lib/google-oauth";
import { getAuthUser } from "@/lib/get-auth-user";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear the cookie
  response.cookies.set(GOOGLE_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Delete the cookie
  });

  // Also remove from database
  const user = await getAuthUser(request);
  if (user) {
    await deleteGoogleToken(user.id);
  }

  return response;
}
