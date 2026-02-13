import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implement Clerk webhook handler to sync user data to Supabase
  return NextResponse.json({ message: "Webhook endpoint ready" }, { status: 200 });
}
