import { createClient } from "@/lib/supabase-server";
import type { DifferentiatedAssignment, ELLevel, ScaffoldAction } from "@/types";

/**
 * Columns guaranteed to exist in differentiated_assignments.
 * source_doc_id and scaffold_actions require migration 007 —
 * once applied, add them here and to the insert below.
 */
const BASE_COLUMNS = [
  "id", "assignment_id", "teacher_id", "student_id", "student_name",
  "assignment_title", "el_level", "scaffolds_applied", "output_html",
  "original_content", "word_bank", "teacher_instructions", "is_demo",
  "teacher_notes", "source_doc_id", "scaffold_actions", "created_at", "updated_at",
].join(", ");

export async function createDifferentiatedAssignment(data: {
  assignment_id: string;
  teacher_id: string;
  student_id?: string;
  student_name?: string;
  assignment_title?: string;
  el_level?: ELLevel;
  scaffolds_applied: string[];
  output_html: string;
  original_content?: string;
  word_bank?: { term: string; definition: string }[] | null;
  teacher_instructions?: string | null;
  is_demo?: boolean;
  teacher_notes?: string;
  source_doc_id?: string;
  scaffold_actions?: ScaffoldAction[] | null;
}): Promise<DifferentiatedAssignment> {
  const supabase = createClient();

  const row: Record<string, unknown> = {
    assignment_id: data.assignment_id,
    teacher_id: data.teacher_id,
    scaffolds_applied: data.scaffolds_applied,
    output_html: data.output_html,
    word_bank: data.word_bank ?? null,
  };
  if (data.student_id !== undefined) row.student_id = data.student_id;
  if (data.student_name !== undefined) row.student_name = data.student_name;
  if (data.assignment_title !== undefined) row.assignment_title = data.assignment_title;
  if (data.el_level !== undefined) row.el_level = data.el_level;
  if (data.original_content !== undefined) row.original_content = data.original_content;
  if (data.teacher_instructions != null) row.teacher_instructions = data.teacher_instructions;
  if (data.is_demo !== undefined) row.is_demo = data.is_demo;
  if (data.teacher_notes !== undefined) row.teacher_notes = data.teacher_notes;
  if (data.source_doc_id !== undefined) row.source_doc_id = data.source_doc_id;
  if (data.scaffold_actions != null) row.scaffold_actions = data.scaffold_actions;

  const { data: result, error } = await supabase
    .from("differentiated_assignments")
    .insert(row)
    .select(BASE_COLUMNS)
    .single();

  if (error) throw error;
  return result as unknown as DifferentiatedAssignment;
}

export async function getDifferentiatedAssignmentById(
  id: string
): Promise<DifferentiatedAssignment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("differentiated_assignments")
    .select(BASE_COLUMNS)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as DifferentiatedAssignment | null;
}

export async function getDifferentiatedAssignmentsByAssignment(
  assignmentId: string
): Promise<DifferentiatedAssignment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("differentiated_assignments")
    .select(BASE_COLUMNS)
    .eq("assignment_id", assignmentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as DifferentiatedAssignment[]) ?? [];
}

export async function getDifferentiatedAssignmentsByTeacher(
  teacherId: string
): Promise<DifferentiatedAssignment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("differentiated_assignments")
    .select(BASE_COLUMNS)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as DifferentiatedAssignment[]) ?? [];
}

/**
 * Enforce a per-teacher library limit. If the teacher has more than `limit`
 * assignments, the oldest ones are deleted until the count is at or below `limit`.
 * Returns how many were pruned and the new total.
 */
export async function enforceLibraryLimit(
  teacherId: string,
  limit: number = 50
): Promise<{ totalAfter: number; pruned: number }> {
  const supabase = createClient();

  const { count } = await supabase
    .from("differentiated_assignments")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", teacherId);

  const total = count ?? 0;

  if (total <= limit) {
    return { totalAfter: total, pruned: 0 };
  }

  const deleteCount = total - limit;
  const { data: toDelete } = await supabase
    .from("differentiated_assignments")
    .select("id")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: true })
    .limit(deleteCount);

  if (!toDelete || toDelete.length === 0) return { totalAfter: total, pruned: 0 };

  const ids = toDelete.map((r) => r.id);
  await supabase
    .from("differentiated_assignments")
    .delete()
    .in("id", ids);

  return { totalAfter: limit, pruned: ids.length };
}

export async function deleteDifferentiatedAssignment(
  id: string,
  teacherId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("differentiated_assignments")
    .delete()
    .eq("id", id)
    .eq("teacher_id", teacherId);
  if (error) throw error;
}

export async function updateDifferentiatedAssignmentNotes(
  id: string,
  teacherId: string,
  notes: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("differentiated_assignments")
    .update({ teacher_notes: notes })
    .eq("id", id)
    .eq("teacher_id", teacherId);
  if (error) throw error;
}

export async function logUsageAnalytic(
  teacherId: string,
  actionType: "scaffold_generated" | "student_viewed" | "assignment_created" | "google_doc_created",
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("usage_analytics").insert({
    teacher_id: teacherId,
    action_type: actionType,
    metadata,
  });
  if (error) throw error;
}

/**
 * Get today's global scaffold generation count (all users).
 * Gemini RPD resets at midnight Pacific time.
 */
export async function getTodayGlobalUsage(): Promise<number> {
  const supabase = createClient();
  const todayStartPT = getTodayStartPacific();

  const { count, error } = await supabase
    .from("usage_analytics")
    .select("id", { count: "exact", head: true })
    .eq("action_type", "scaffold_generated")
    .gte("created_at", todayStartPT);

  if (error) throw error;
  return count ?? 0;
}

/**
 * Get today's scaffold generation count for a specific user.
 */
export async function getTodayUserUsage(teacherId: string): Promise<number> {
  const supabase = createClient();
  const todayStartPT = getTodayStartPacific();

  const { count, error } = await supabase
    .from("usage_analytics")
    .select("id", { count: "exact", head: true })
    .eq("action_type", "scaffold_generated")
    .eq("teacher_id", teacherId)
    .gte("created_at", todayStartPT);

  if (error) throw error;
  return count ?? 0;
}

/** Midnight Pacific time today as ISO string (for Gemini RPD reset boundary). */
function getTodayStartPacific(): string {
  const now = new Date();
  // Today's date in Pacific time (YYYY-MM-DD, handles DST)
  const ptDate = now.toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });
  // Detect PST vs PDT from timezone abbreviation
  const tzAbbr = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  })
    .formatToParts(now)
    .find((p) => p.type === "timeZoneName")?.value;
  const offset = tzAbbr === "PDT" ? "-07:00" : "-08:00";
  return `${ptDate}T00:00:00${offset}`;
}
