import { createClient } from "@/lib/supabase";
import type { DifferentiatedAssignment, ELLevel } from "@/types";

export async function createDifferentiatedAssignment(data: {
  assignment_id: string;
  teacher_id?: string;
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

export async function getDifferentiatedAssignmentsByTeacher(
  teacherId: string
): Promise<DifferentiatedAssignment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("differentiated_assignments")
    .select("*")
    .eq("teacher_id", teacherId)
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

/**
 * Get today's global scaffold generation count (all users).
 * Gemini RPD resets at midnight Pacific time.
 */
export async function getTodayGlobalUsage(): Promise<number> {
  const supabase = createClient();
  const todayStartPT = getTodayStartPacific();

  const { count, error } = await supabase
    .from("usage_analytics")
    .select("*", { count: "exact", head: true })
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
    .select("*", { count: "exact", head: true })
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
