import { NextResponse } from "next/server";
import { seedScaffoldTemplates } from "@/lib/seed-scaffolds";

export async function POST() {
  try {
    const result = await seedScaffoldTemplates();
    return NextResponse.json({
      message: "Seed completed",
      ...result,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed scaffold templates" },
      { status: 500 }
    );
  }
}
