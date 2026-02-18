import { createClient } from "@/lib/supabase";
import type { DifferentiatedAssignment, ELLevel } from "@/types";

export async function createDifferentiatedAssignment(data: {
  assignment_id: string;
  student_id?: string;
  el_level?: ELLevel;
  scaffolds_applied: string[];
  output_html: string;
  teacher_notes?: string;
}): Promise<DifferentiatedAssignment> {
  const supabase = createClient();
  const { data: result, error } = await supabase
    .from("differentiated_assignments")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result as DifferentiatedAssignment;
}

export async function getDifferentiatedAssignmentById(
  id: string
): Promise<DifferentiatedAssignment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("differentiated_assignments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DifferentiatedAssignment | null;
}

export async function getDifferentiatedAssignmentsByAssignment(
  assignmentId: string
): Promise<DifferentiatedAssignment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("differentiated_assignments")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as DifferentiatedAssignment[]) ?? [];
}

export async function logUsageAnalytic(
  teacherId: string,
  actionType: "scaffold_generated" | "student_viewed" | "assignment_created" | "google_doc_created",
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = createClient();
  await supabase.from("usage_analytics").insert({
    teacher_id: teacherId,
    action_type: actionType,
    metadata,
  });
}
