"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { studentSchema, type StudentFormValues } from "@/lib/validations";
import { EL_LEVELS, GRADES } from "@/types";
import type { Student } from "@/types";

interface StudentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentFormValues) => Promise<void>;
  student?: Student | null;
  isLoading?: boolean;
}

export function StudentFormModal({
  open,
  onOpenChange,
  onSubmit,
  student,
  isLoading = false,
}: StudentFormModalProps) {
  const isEditing = !!student;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
      ? {
          name: student.name,
          grade: student.grade,
          el_level: student.el_level,
          primary_language: student.primary_language,
          notes: student.notes ?? "",
        }
      : {
          name: "",
          grade: 5,
          el_level: "Emerging",
          primary_language: "",
          notes: "",
        },
  });

  async function handleFormSubmit(data: StudentFormValues) {
    await onSubmit(data);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Student" : "Add Student"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the student's information."
              : "Add a new student to your roster."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Student's full name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                id="grade"
                {...register("grade", { valueAsNumber: true })}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </Select>
              {errors.grade && (
                <p className="text-sm text-destructive">{errors.grade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="el_level">EL Level</Label>
              <Select id="el_level" {...register("el_level")}>
                {EL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
              {errors.el_level && (
                <p className="text-sm text-destructive">
                  {errors.el_level.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_language">Primary Language</Label>
            <Input
              id="primary_language"
              placeholder="e.g., Spanish, Mandarin, Arabic"
              {...register("primary_language")}
            />
            {errors.primary_language && (
              <p className="text-sm text-destructive">
                {errors.primary_language.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this student..."
              rows={3}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                ? "Save Changes"
                : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
