import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { createClient } from "@/lib/supabase-server";

/**
 * GET /api/profile — returns the authenticated user's saved profile.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[profile GET]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({
    firstName: data?.first_name ?? "",
    lastName: data?.last_name ?? "",
  });
}

/**
 * PUT /api/profile — upserts the authenticated user's profile.
 * Body: { firstName: string, lastName: string }
 */
export async function PUT(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";

  const supabase = createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[profile PUT]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ firstName, lastName });
}
