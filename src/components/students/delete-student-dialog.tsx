"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { Student } from "@/types";

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteStudentDialog({
  open,
  onOpenChange,
  student,
  onConfirm,
  isLoading = false,
}: DeleteStudentDialogProps) {
  if (!student) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {student.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{student.name}</strong> from your student roster.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
