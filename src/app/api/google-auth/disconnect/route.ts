import { NextResponse } from "next/server";
import { GOOGLE_TOKEN_COOKIE } from "@/lib/google-oauth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(GOOGLE_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Delete the cookie
  });

  return response;
}
