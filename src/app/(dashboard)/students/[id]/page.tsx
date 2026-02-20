"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PenSquare,
  Palette,
  Layers,
  Type,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ELBadge } from "@/components/students/el-badge";
import { getStudentById } from "@/lib/queries/students";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import type { Student } from "@/types";
import { formatDate } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  color_coding: Palette,
  chunking: Layers,
  sentence_frames: Type,
  word_banks: BookOpen,
  visual_organizers: LayoutGrid,
};

const categoryLabels: Record<string, string> = {
  color_coding: "Color Coding",
  chunking: "Chunking",
  sentence_frames: "Sentence Frames",
  word_banks: "Word Banks",
  visual_organizers: "Visual Organizers",
};

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const data = await getStudentById(studentId);
        setStudent(data);
      } catch {
        setError("Failed to load student. Check your Supabase connection.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [studentId]);

  // Get recommended scaffolds for this student's EL level
  const recommendedScaffolds = student
    ? defaultScaffolds.filter((s) =>
        s.el_level_target.includes(student.el_level)
      )
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <Link
          href="/students"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-foreground">Student not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error || "This student may have been deleted."}
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/students">View All Students</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Link>

      {/* Student header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="scaffold-heading">{student.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <ELBadge level={student.el_level} />
            <span>Grade {student.grade}</span>
            <span>&middot;</span>
            <span>{student.primary_language}</span>
          </div>
          {student.notes && (
            <p className="mt-3 text-sm text-muted-foreground max-w-xl">
              {student.notes}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Added {formatDate(student.created_at)}
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <Link href={`/create?student=${student.id}`}>
            <PenSquare className="h-4 w-4" />
            Create Assignment for {student.name.split(" ")[0]}
          </Link>
        </Button>
      </div>

      {/* Recommended Scaffolds */}
      <div>
        <h2 className="scaffold-subheading mb-4">
          Recommended Scaffolds for {student.el_level}
        </h2>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {recommendedScaffolds.map((scaffold, idx) => {
            const Icon = categoryIcons[scaffold.category] || BookOpen;
            return (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-eld-almond-silk/30">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {scaffold.name}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {categoryLabels[scaffold.category]}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {scaffold.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {scaffold.el_level_target.map((level) => (
                      <span
                        key={level}
                        className="rounded-full bg-eld-almond-silk/20 px-2 py-0.5 text-xs text-eld-dusty-grape dark:bg-gray-800 dark:text-gray-400"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Past Differentiated Assignments */}
      <div>
        <h2 className="scaffold-subheading mb-4">Past Differentiated Assignments</h2>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">No assignments yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a scaffolded assignment for {student.name.split(" ")[0]} to see it here.
          </p>
        </div>
      </div>
    </div>
  );
}
