"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { StudentsTable } from "@/components/students/students-table";
import { StudentFormModal } from "@/components/students/student-form-modal";
import { DeleteStudentDialog } from "@/components/students/delete-student-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/queries/students";
import type { Student } from "@/types";
import type { StudentFormValues } from "@/lib/validations";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch {
      // Supabase not configured - show empty state
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  async function handleAddStudent(data: StudentFormValues) {
    setIsSubmitting(true);
    try {
      const newStudent = await createStudent({
        name: data.name,
        grade: data.grade,
        el_level: data.el_level,
        primary_language: data.primary_language,
        notes: data.notes,
        created_by: "",
      });
      setStudents((prev) => [...prev, newStudent].sort((a, b) => a.name.localeCompare(b.name)));
      setAddModalOpen(false);
      toast.success(`${data.name} added successfully`);
    } catch {
      toast.error("Failed to add student. Check your Supabase connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditStudent(data: StudentFormValues) {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const updated = await updateStudent(selectedStudent.id, data);
      setStudents((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      setEditModalOpen(false);
      setSelectedStudent(null);
      toast.success(`${data.name} updated successfully`);
    } catch {
      toast.error("Failed to update student.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteStudent() {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await deleteStudent(selectedStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
      setDeleteDialogOpen(false);
      toast.success(`${selectedStudent.name} deleted`);
      setSelectedStudent(null);
    } catch {
      toast.error("Failed to delete student.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-2xl border border-eld-almond-silk/40 dark:border-gray-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b px-4 py-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Students</h1>
        <p className="scaffold-description mt-1">
          Manage your student roster and view EL proficiency levels.
        </p>
      </div>

      <StudentsTable
        students={students}
        onAdd={() => setAddModalOpen(true)}
        onEdit={(student) => {
          setSelectedStudent(student);
          setEditModalOpen(true);
        }}
        onDelete={(student) => {
          setSelectedStudent(student);
          setDeleteDialogOpen(true);
        }}
      />

      <StudentFormModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddStudent}
        isLoading={isSubmitting}
      />

      <StudentFormModal
        key={selectedStudent?.id ?? "new"}
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        onSubmit={handleEditStudent}
        student={selectedStudent}
        isLoading={isSubmitting}
      />

      <DeleteStudentDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        student={selectedStudent}
        onConfirm={handleDeleteStudent}
        isLoading={isSubmitting}
      />
    </div>
  );
}
