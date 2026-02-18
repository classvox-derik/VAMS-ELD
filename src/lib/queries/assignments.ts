import { createClient } from "@/lib/supabase";
import type { Assignment } from "@/types";

export async function createAssignment(data: {
  teacher_id: string;
  title: string;
  subject?: string;
  grade_level?: number;
  original_content: string;
  source_type: "text" | "upload" | "google_doc" | "google_slides";
  source_url?: string;
  file_url?: string;
}): Promise<Assignment> {
  const supabase = createClient();
  const { data: assignment, error } = await supabase
    .from("assignments")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return assignment as Assignment;
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Assignment | null;
}

export async function getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Assignment[]) ?? [];
}
