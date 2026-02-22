import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { studentSchema } from "@/lib/validations";

async function getAuthUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// GET /api/students — all authenticated users can read
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/students — admin only
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("students")
    .insert({
      ssid: parsed.data.ssid ?? null,
      name: parsed.data.name,
      grade: parsed.data.grade,
      homeroom: parsed.data.homeroom ?? null,
      el_level: parsed.data.el_level,
      overall_level: parsed.data.overall_level ?? null,
      oral_language_level: parsed.data.oral_language_level ?? null,
      written_language_level: parsed.data.written_language_level ?? null,
      primary_language: parsed.data.primary_language,
      notes: parsed.data.notes ?? null,
      custom_scaffolds: [],
      created_by: user.email,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
