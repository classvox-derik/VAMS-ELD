import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateScaffoldedAssignment } from "@/lib/gemini";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import { scaffoldRequestSchema } from "@/lib/validations";
import { checkRateLimit, checkGlobalRateLimit } from "@/lib/rate-limit";

import type { ColorCodingOptions } from "@/types";

// Allow up to 3 minutes for AI generation (serverless environments like Vercel)
export const maxDuration = 180;

function buildColorCodingPrompt(options: ColorCodingOptions): string {
  if (options.mode === "easier_to_read") {
    return 'Color code text throughout the ENTIRE document, in EVERY paragraph from start to finish. Wrap topic sentences/main ideas with <span style="background-color: #FFF176;">text</span> (yellow), evidence/supporting details with <span style="background-color: #AED581;">text</span> (green), and transition words/phrases with <span style="background-color: #90CAF9;">text</span> (blue). Every paragraph must have at least one highlighted element. Do NOT skip any paragraph. Include a color key at the end: Yellow = Main Ideas, Green = Evidence/Details, Blue = Transitions.';
  }

  // Parts of speech mode — build based on selected word types
  const types: string[] = [];
  if (options.wordTypes.nouns) {
    types.push('nouns with <span style="background-color: #90CAF9;">word</span> (blue)');
  }
  if (options.wordTypes.verbs) {
    types.push('verbs with <span style="background-color: #AED581;">word</span> (green)');
  }
  if (options.wordTypes.adjectives) {
    types.push('adjectives with <span style="background-color: #FFCC80;">word</span> (orange)');
  }
  if (options.wordTypes.vocabulary) {
    types.push('vocabulary bank words with <span style="background-color: #FFF176;">word</span> (yellow)');
  }

  const wrapInstructions = types.join(", ");

  const keyParts: string[] = [];
  if (options.wordTypes.nouns) keyParts.push("Blue = Nouns");
  if (options.wordTypes.verbs) keyParts.push("Green = Verbs");
  if (options.wordTypes.adjectives) keyParts.push("Orange = Adjectives");
  if (options.wordTypes.vocabulary) keyParts.push("Yellow = Vocabulary Words");

  let priorityNote = "";
  if (options.wordTypes.vocabulary && (options.wordTypes.nouns || options.wordTypes.verbs || options.wordTypes.adjectives)) {
    priorityNote = " If a word is both a vocabulary bank word and another part of speech, use yellow (vocabulary bank takes priority).";
  }

  return `Color code specific word types throughout the ENTIRE document, in EVERY paragraph from start to finish. Wrap ${wrapInstructions}.${priorityNote} Every paragraph must have at least one highlighted element. Do NOT skip any paragraph. Include a color key at the end: ${keyParts.join(", ")}.`;
}

const DAILY_GLOBAL_LIMIT = parseInt(process.env.DAILY_GLOBAL_LIMIT ?? "250", 10);
const DAILY_PER_USER_LIMIT = parseInt(process.env.DAILY_PER_USER_LIMIT ?? "10", 10);
const UNLIMITED_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());

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

    const isUnlimited = UNLIMITED_EMAILS.includes(user.email.toLowerCase());

    // 1. Global RPM rate limit (protects OpenRouter rate limits)
    if (!isUnlimited && !checkGlobalRateLimit(10)) {
      return NextResponse.json(
        { error: "Platform rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // 2. Per-user RPM (secondary protection)
    if (!isUnlimited && !checkRateLimit(user.id, 5)) {
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

      if (!isUnlimited && globalUsed >= DAILY_GLOBAL_LIMIT) {
        return NextResponse.json(
          { error: "Platform daily limit reached. Scaffold generation will reset at midnight Pacific time." },
          { status: 429 }
        );
      }

      if (!isUnlimited && userUsed >= DAILY_PER_USER_LIMIT) {
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
      const flattened = parsed.error.flatten();
      console.error("[Scaffold API] Validation failed:", JSON.stringify(flattened, null, 2));
      return NextResponse.json(
        { error: "Validation failed", details: flattened },
        { status: 400 }
      );
    }

    const { content, title, subject, gradeLevel, elLevel, scaffoldNames: requestedNames, studentName, sourceDocId, sourceHtml, skipUsageLog, colorCodingOptions } = parsed.data;

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

    const scaffoldPrompts = selectedScaffolds.map((s) => {
      // Override color coding prompt based on user options
      if (s.category === "color_coding" && colorCodingOptions) {
        return buildColorCodingPrompt(colorCodingOptions);
      }
      return s.ai_prompt_template;
    });
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
      sourceDocId: sourceDocId || undefined,
      sourceHtml: sourceHtml || undefined,
    });

    // Store in database with all library fields (graceful failure)
    let storedId: string | null = null;
    let libraryAtLimit = false;
    let libraryPruned = 0;
    try {
      const { createDifferentiatedAssignment, enforceLibraryLimit } = await import(
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
        source_doc_id: sourceDocId || undefined,
        scaffold_actions: result.scaffoldActions || undefined,
      });
      storedId = stored.id;

      // Enforce 50-entry library limit per teacher
      const { totalAfter, pruned } = await enforceLibraryLimit(user.id, 50);
      libraryPruned = pruned;
      libraryAtLimit = pruned === 0 && totalAfter === 50;
    } catch (err) {
      const saveError = err instanceof Error ? err.message : String(err);
      console.error("Failed to store differentiated assignment:", saveError, err);
      // Include in response so client can surface the actual reason
      return NextResponse.json({
        success: true,
        libraryAtLimit: false,
        libraryPruned: 0,
        outputHtml: result.html,
        wordBank: result.wordBank,
        scaffoldsUsed: result.scaffoldsUsed,
        teacherInstructions: result.teacherInstructions,
        isDemo: result.isDemo,
        scaffoldsApplied: scaffoldNames,
        scaffoldActions: result.scaffoldActions || null,
        storedId: null,
        saveError,
        updatedUsage: undefined,
      });
    }

    // Log usage analytic with real teacher ID (skip for batch sub-calls)
    if (!skipUsageLog) {
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

    console.log("[Scaffold API] Response:", {
      sourceDocId: sourceDocId || "(none)",
      scaffoldActionsCount: result.scaffoldActions ? result.scaffoldActions.length : 0,
      storedId,
    });

    return NextResponse.json({
      success: true,
      libraryAtLimit,
      libraryPruned,
      outputHtml: result.html,
      wordBank: result.wordBank,
      scaffoldsUsed: result.scaffoldsUsed,
      teacherInstructions: result.teacherInstructions,
      isDemo: result.isDemo,
      scaffoldsApplied: scaffoldNames,
      scaffoldActions: result.scaffoldActions || null,
      storedId,
      updatedUsage,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    console.error("Scaffold generation error:", message, error);

    // Surface quota/rate-limit errors clearly
    if (message.includes("429") || message.includes("quota")) {
      return NextResponse.json(
        { error: "AI API quota exceeded. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate scaffolded assignment. Please try again.",
        detail: message,
      },
      { status: 500 }
    );
  }
}
