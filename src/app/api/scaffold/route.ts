import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateScaffoldedAssignment } from "@/lib/gemini";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import { scaffoldRequestSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

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

export async function POST(request: NextRequest) {
  try {
    // Auth check — only authenticated teachers can generate
    const user = await getAuthUser(request);
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit — protect Gemini free tier (10 requests/min per user)
    if (!checkRateLimit(user.id, 10)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before generating again." },
        { status: 429 }
      );
    }
    const body = await request.json();

    // Zod validation
    const parsed = scaffoldRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { content, title, subject, gradeLevel, elLevel, scaffoldNames: requestedNames } = parsed.data;

    // Look up scaffolds by name instead of fragile indices
    const selectedScaffolds = defaultScaffolds.filter((s) =>
      requestedNames.includes(s.name)
    );

    if (selectedScaffolds.length === 0) {
      return NextResponse.json(
        { error: "No valid scaffolds selected" },
        { status: 400 }
      );
    }

    const scaffoldPrompts = selectedScaffolds.map(
      (s) => s.ai_prompt_template
    );
    const scaffoldNames = selectedScaffolds.map((s) => s.name);

    // Generate scaffolded assignment (returns structured JSON from Gemini)
    const result = await generateScaffoldedAssignment({
      originalContent: content,
      elLevel,
      scaffoldPrompts,
      scaffoldNames,
      title,
      subject: subject || undefined,
      gradeLevel: gradeLevel || undefined,
    });

    // Attempt to store in database (graceful failure)
    let storedId: string | null = null;
    try {
      const { createDifferentiatedAssignment } = await import(
        "@/lib/queries/differentiated-assignments"
      );
      const stored = await createDifferentiatedAssignment({
        assignment_id: body.assignmentId || "draft",
        student_id: body.studentId || undefined,
        el_level: elLevel,
        scaffolds_applied: scaffoldNames,
        output_html: result.html,
        parent_note: result.parentNote || undefined,
      });
      storedId = stored.id;
    } catch {
      // Database not configured — continue without storing
    }

    // Log usage analytic with real teacher ID (graceful failure)
    try {
      const { logUsageAnalytic } = await import(
        "@/lib/queries/differentiated-assignments"
      );
      await logUsageAnalytic(user.id, "scaffold_generated", {
        title,
        elLevel,
        scaffoldCount: selectedScaffolds.length,
        contentLength: content.length,
        isDemo: result.isDemo,
      });
    } catch {
      // Database not configured — continue
    }

    return NextResponse.json({
      success: true,
      outputHtml: result.html,
      parentNote: result.parentNote,
      wordBank: result.wordBank,
      scaffoldsUsed: result.scaffoldsUsed,
      teacherInstructions: result.teacherInstructions,
      isDemo: result.isDemo,
      scaffoldsApplied: scaffoldNames,
      storedId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    console.error("Scaffold generation error:", message, error);

    // Surface Gemini quota/rate-limit errors clearly
    if (message.includes("429") || message.includes("quota")) {
      return NextResponse.json(
        { error: "Gemini API quota exceeded. Please wait a few minutes or check your Google AI billing plan." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate scaffolded assignment. Please try again.",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 }
    );
  }
}
