"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { StudentsTable } from "@/components/students/students-table";
import { StudentFormModal } from "@/components/students/student-form-modal";
import { DeleteStudentDialog } from "@/components/students/delete-student-dialog";
import { BulkImportModal } from "@/components/students/bulk-import-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAdmin } from "@/lib/hooks/use-admin";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkImportStudents,
} from "@/lib/queries/students";
import type { Student } from "@/types";
import type { StudentFormValues } from "@/lib/validations";

export default function StudentsPage() {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch {
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
        ssid: data.ssid ?? "",
        name: data.name,
        grade: data.grade,
        homeroom: data.homeroom ?? "",
        el_level: data.el_level,
        overall_level: data.overall_level ?? 0,
        oral_language_level: data.oral_language_level ?? 0,
        written_language_level: data.written_language_level ?? 0,
        primary_language: data.primary_language,
        notes: data.notes,
        created_by: "",
      });
      setStudents((prev) => [...prev, newStudent].sort((a, b) => a.name.localeCompare(b.name)));
      setAddModalOpen(false);
      toast.success(`${data.name} added successfully`);
    } catch {
      toast.error("Failed to add student.");
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

  async function handleBulkImport(
    studentData: Array<{
      name: string;
      grade: number;
      el_level: string;
      primary_language: string;
      notes?: string;
    }>
  ) {
    const result = await bulkImportStudents(studentData);
    if (result.imported > 0) {
      await fetchStudents();
      toast.success(`${result.imported} student${result.imported !== 1 ? "s" : ""} imported`);
    }
    return result;
  }

  if (isLoading || isAdminLoading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="scaffold-heading">Students</h1>
          <p className="scaffold-description mt-1">
            {isAdmin
              ? "Manage the school-wide student roster and EL proficiency levels."
              : "View the school-wide student roster and EL proficiency levels."}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            onClick={() => setBulkImportOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
        )}
      </div>

      <StudentsTable
        students={students}
        isAdmin={isAdmin}
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

      {isAdmin && (
        <>
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

          <BulkImportModal
            open={bulkImportOpen}
            onOpenChange={setBulkImportOpen}
            onImport={handleBulkImport}
          />
        </>
      )}
    </div>
  );
}
