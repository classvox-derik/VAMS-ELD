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

// POST /api/students/bulk — admin only
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  if (!Array.isArray(body.students)) {
    return NextResponse.json(
      { error: "Expected { students: [...] }" },
      { status: 400 }
    );
  }

  const valid: Array<{
    ssid?: string;
    name: string;
    grade: number;
    homeroom?: string;
    el_level: string;
    overall_level?: number;
    oral_language_level?: number;
    written_language_level?: number;
    primary_language: string;
    notes?: string;
    custom_scaffolds: string[];
    created_by: string;
  }> = [];
  const errors: Array<{ row: number; issues: string[] }> = [];

  for (let i = 0; i < body.students.length; i++) {
    const parsed = studentSchema.safeParse(body.students[i]);
    if (parsed.success) {
      valid.push({
        ssid: parsed.data.ssid ?? undefined,
        name: parsed.data.name,
        grade: parsed.data.grade,
        homeroom: parsed.data.homeroom ?? undefined,
        el_level: parsed.data.el_level,
        overall_level: parsed.data.overall_level ?? undefined,
        oral_language_level: parsed.data.oral_language_level ?? undefined,
        written_language_level: parsed.data.written_language_level ?? undefined,
        primary_language: parsed.data.primary_language,
        notes: parsed.data.notes ?? undefined,
        custom_scaffolds: [],
        created_by: user.email,
      });
    } else {
      errors.push({
        row: i + 1,
        issues: parsed.error.issues.map((iss) => iss.message),
      });
    }
  }

  if (valid.length === 0) {
    return NextResponse.json(
      { error: "No valid students to import", errors },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("students")
    .insert(valid)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    imported: data?.length ?? 0,
    errors,
  });
}
