import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateScaffoldedAssignment } from "@/lib/gemini";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import { scaffoldRequestSchema } from "@/lib/validations";
import { checkRateLimit, checkGlobalRateLimit } from "@/lib/rate-limit";

const DAILY_GLOBAL_LIMIT = parseInt(process.env.DAILY_GLOBAL_LIMIT ?? "250", 10);
const DAILY_PER_USER_LIMIT = parseInt(process.env.DAILY_PER_USER_LIMIT ?? "10", 10);

async function getAuthUser(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
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

    // 1. Global RPM rate limit (protects Gemini free tier 10 RPM)
    if (!checkGlobalRateLimit(10)) {
      return NextResponse.json(
        { error: "Platform rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // 2. Per-user RPM (secondary protection)
    if (!checkRateLimit(user.id, 5)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before generating again." },
        { status: 429 }
      );
    }

    // 3. Daily usage limits (database-backed)
    try {
      const { getTodayGlobalUsage, getTodayUserUsage } = await import(
        "@/lib/queries/differentiated-assignments"
      );
      const [globalUsed, userUsed] = await Promise.all([
        getTodayGlobalUsage(),
        getTodayUserUsage(user.id),
      ]);

      if (globalUsed >= DAILY_GLOBAL_LIMIT) {
        return NextResponse.json(
          { error: "Platform daily limit reached. Scaffold generation will reset at midnight Pacific time." },
          { status: 429 }
        );
      }

      if (userUsed >= DAILY_PER_USER_LIMIT) {
        return NextResponse.json(
          { error: `You've reached your daily limit of ${DAILY_PER_USER_LIMIT} scaffold generations. Resets at midnight Pacific time.` },
          { status: 429 }
        );
      }
    } catch {
      // Database not configured — skip daily limit enforcement
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

    const { content, title, subject, gradeLevel, elLevel, scaffoldNames: requestedNames, studentName } = parsed.data;

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

    // Store in database with all library fields (graceful failure)
    let storedId: string | null = null;
    try {
      const { createDifferentiatedAssignment } = await import(
        "@/lib/queries/differentiated-assignments"
      );
      const stored = await createDifferentiatedAssignment({
        assignment_id: body.assignmentId || "draft",
        teacher_id: user.id,
        student_id: body.studentId || undefined,
        student_name: studentName || undefined,
        assignment_title: title,
        el_level: elLevel,
        scaffolds_applied: scaffoldNames,
        output_html: result.html,
        original_content: content,
        word_bank: result.wordBank,
        teacher_instructions: result.teacherInstructions,
        is_demo: result.isDemo,
      });
      storedId = stored.id;
    } catch (err) {
      console.error("Failed to store differentiated assignment:", err);
    }

    // Log usage analytic with real teacher ID
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
    } catch (err) {
      console.error("Failed to log usage analytic:", err);
    }

    // Fetch updated usage count for immediate client-side counter update
    let updatedUsage: number | undefined;
    try {
      const { getTodayUserUsage } = await import(
        "@/lib/queries/differentiated-assignments"
      );
      updatedUsage = await getTodayUserUsage(user.id);
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      outputHtml: result.html,
      wordBank: result.wordBank,
      scaffoldsUsed: result.scaffoldsUsed,
      teacherInstructions: result.teacherInstructions,
      isDemo: result.isDemo,
      scaffoldsApplied: scaffoldNames,
      storedId,
      updatedUsage,
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
