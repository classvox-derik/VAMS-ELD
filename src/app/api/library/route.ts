import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getDifferentiatedAssignmentsByTeacher } = await import(
      "@/lib/queries/differentiated-assignments"
    );
    const entries = await getDifferentiatedAssignmentsByTeacher(user.id);
    return NextResponse.json(entries);
  } catch (err) {
    console.error("Failed to fetch library:", err);
    return NextResponse.json(
      { error: "Failed to fetch library" },
      { status: 500 }
    );
  }
}
