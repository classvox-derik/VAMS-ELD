import { createClient } from "@/lib/supabase";
import type { Student } from "@/types";

export async function getAllStudents(): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as Student[]) ?? [];
}

export async function getStudentById(id: string): Promise<Student | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Student | null;
}

export async function createStudent(
  studentData: Omit<Student, "id" | "created_at" | "updated_at" | "custom_scaffolds">
): Promise<Student> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .insert({
      ...studentData,
      custom_scaffolds: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function updateStudent(
  id: string,
  studentData: Partial<Pick<Student, "name" | "grade" | "el_level" | "primary_language" | "notes">>
): Promise<Student> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .update({
      ...studentData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function deleteStudent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) throw error;
}

export async function getStudentsByElLevel(level: string): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("el_level", level)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as Student[]) ?? [];
}
