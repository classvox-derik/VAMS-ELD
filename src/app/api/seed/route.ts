import { NextRequest, NextResponse } from "next/server";
import { seedScaffoldTemplates } from "@/lib/seed-scaffolds";
import { seedStudents } from "@/lib/seed-students";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");

  try {
    if (target === "students") {
      const result = await seedStudents();
      return NextResponse.json(result);
    }

    if (target === "scaffolds") {
      const result = await seedScaffoldTemplates();
      return NextResponse.json(result);
    }

    // Seed everything
    const scaffoldResult = await seedScaffoldTemplates();
    const studentResult = await seedStudents();

    return NextResponse.json({
      message: "Full seed completed",
      scaffolds: scaffoldResult,
      students: studentResult,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed" },
      { status: 500 }
    );
  }
}
