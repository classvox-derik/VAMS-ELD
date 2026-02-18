import { NextResponse } from "next/server";
import { generateScaffoldedAssignment } from "@/lib/gemini";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import type { ELLevel } from "@/types";

const VALID_EL_LEVELS: ELLevel[] = ["Emerging", "Expanding", "Bridging"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      content,
      title,
      subject,
      gradeLevel,
      elLevel,
      scaffoldIndices,
    } = body;

    // Validate required fields
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Assignment content is required" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Assignment title is required" },
        { status: 400 }
      );
    }

    if (!elLevel || !VALID_EL_LEVELS.includes(elLevel)) {
      return NextResponse.json(
        { error: "Valid EL level is required (Emerging, Expanding, or Bridging)" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(scaffoldIndices) ||
      scaffoldIndices.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one scaffold must be selected" },
        { status: 400 }
      );
    }

    // Look up scaffold templates
    const selectedScaffolds = scaffoldIndices
      .filter(
        (i: number) =>
          typeof i === "number" && i >= 0 && i < defaultScaffolds.length
      )
      .map((i: number) => defaultScaffolds[i]);

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

    // Generate scaffolded assignment
    const { html, isDemo } = await generateScaffoldedAssignment({
      originalContent: content,
      elLevel: elLevel as ELLevel,
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
        el_level: elLevel as ELLevel,
        scaffolds_applied: scaffoldNames,
        output_html: html,
      });
      storedId = stored.id;
    } catch {
      // Database not configured — continue without storing
    }

    // Attempt to log usage analytic (graceful failure)
    try {
      const { logUsageAnalytic } = await import(
        "@/lib/queries/differentiated-assignments"
      );
      await logUsageAnalytic("anonymous", "scaffold_generated", {
        title,
        elLevel,
        scaffoldCount: selectedScaffolds.length,
        contentLength: content.length,
        isDemo,
      });
    } catch {
      // Database not configured — continue
    }

    return NextResponse.json({
      success: true,
      outputHtml: html,
      isDemo,
      scaffoldsApplied: scaffoldNames,
      storedId,
    });
  } catch (error) {
    console.error("Scaffold generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate scaffolded assignment. Please try again." },
      { status: 500 }
    );
  }
}
