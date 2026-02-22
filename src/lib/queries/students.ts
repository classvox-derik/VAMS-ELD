import type { Student } from "@/types";

export async function getStudentById(id: string): Promise<Student | null> {
  const res = await fetch(`/api/students/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getAllStudents(): Promise<Student[]> {
  const res = await fetch("/api/students");
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export async function createStudent(
  studentData: Omit<Student, "id" | "created_at" | "updated_at" | "custom_scaffolds">
): Promise<Student> {
  const res = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create student");
  }
  return res.json();
}

export async function updateStudent(
  id: string,
  studentData: Partial<Pick<Student, "ssid" | "name" | "grade" | "homeroom" | "el_level" | "overall_level" | "oral_language_level" | "written_language_level" | "primary_language" | "notes">>
): Promise<Student> {
  const res = await fetch(`/api/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update student");
  }
  return res.json();
}

export async function deleteStudent(id: string): Promise<void> {
  const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to delete student");
  }
}

export async function bulkImportStudents(
  students: Array<{
    ssid?: string;
    name: string;
    grade: number;
    homeroom?: string;
    el_level: string;
    overall_level?: number;
    oral_language_level?: number;
    written_language_level?: number;
    primary_language: string;
    notes?: string;
  }>
): Promise<{ imported: number; errors: Array<{ row: number; issues: string[] }> }> {
  const res = await fetch("/api/students/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ students }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to import students");
  }
  return res.json();
}
