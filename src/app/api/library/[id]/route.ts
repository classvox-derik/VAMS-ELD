import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { getDifferentiatedAssignmentById } = await import(
      "@/lib/queries/differentiated-assignments"
    );
    const entry = await getDifferentiatedAssignmentById(id);
    if (!entry || entry.teacher_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { teacher_notes } = body;

    const { updateDifferentiatedAssignmentNotes } = await import(
      "@/lib/queries/differentiated-assignments"
    );
    await updateDifferentiatedAssignmentNotes(id, user.id, teacher_notes);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { deleteDifferentiatedAssignment } = await import(
      "@/lib/queries/differentiated-assignments"
    );
    await deleteDifferentiatedAssignment(id, user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
