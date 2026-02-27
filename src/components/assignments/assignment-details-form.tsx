"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  assignmentDetailsSchema,
  type AssignmentDetailsFormValues,
} from "@/lib/validations";
import { SUBJECTS, GRADES } from "@/types";

interface AssignmentDetailsFormProps {
  defaultValues: {
    title: string;
    subject: string;
    gradeLevel: number | undefined;
  };
  onSubmit: (data: AssignmentDetailsFormValues) => void;
  onBack: () => void;
}

export function AssignmentDetailsForm({
  defaultValues,
  onSubmit,
  onBack,
}: AssignmentDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentDetailsFormValues>({
    resolver: zodResolver(assignmentDetailsSchema),
    defaultValues: {
      title: defaultValues.title,
      subject: defaultValues.subject || undefined,
      grade_level: defaultValues.gradeLevel,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Assignment Title *</Label>
        <Input
          id="title"
          placeholder='e.g., "Chapter 5 Reading Comprehension Questions"'
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject (optional)</Label>
          <Select id="subject" {...register("subject")}>
            <option value="">Select subject...</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade_level">Grade Level (optional)</Label>
          <Select
            id="grade_level"
            {...register("grade_level", {
              setValueAs: (v: string) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select grade...</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Input
        </Button>
        <Button type="submit" className="gap-2">
          Continue to Selection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
