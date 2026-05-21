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
import elpacScoresData from "@/data/elpac-scores.json";

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

  const studentElpac = student?.ssid ? (elpacScoresData as any)[student.ssid] : null;

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

      {/* ELPAC Score Section */}
      {studentElpac && (
        <Card className="overflow-hidden border-eld-space-indigo/20 bg-gradient-to-br from-eld-space-indigo/5 to-transparent dark:from-eld-space-indigo/10 dark:border-eld-space-indigo/30">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <CardTitle className="text-lg font-semibold text-eld-space-indigo dark:text-eld-almond-silk">
                2025/2026 ELPAC Performance
              </CardTitle>
              {studentElpac.test_date && (
                <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                  Tested {studentElpac.test_date}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Score + Level row */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Scale Score</span>
                  <span className="text-4xl font-bold text-foreground mt-1">{studentElpac.elpac_score}</span>
                </div>
                <div className="hidden sm:block h-12 w-px bg-border" />
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Overall Level</span>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-eld-space-indigo text-white font-bold text-lg dark:bg-eld-almond-silk dark:text-eld-space-indigo shadow-sm">
                      {studentElpac.elpac_level}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {studentElpac.elpac_level === 4 ? "Well Developed" :
                        studentElpac.elpac_level === 3 ? "Moderately Developed" :
                          studentElpac.elpac_level === 2 ? "Somewhat Developed" : "Beginning to Develop"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Domain scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                {/* Oral Language */}
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-eld-dusty-grape/5 dark:bg-eld-dusty-grape/10 border border-eld-dusty-grape/10">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-eld-space-indigo dark:text-eld-almond-silk">Oral Language</span>
                    {studentElpac.oral_score && (
                      <span className="text-xl font-bold">{studentElpac.oral_score}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">Listening</span>
                      <span className="text-sm font-medium mt-1">{studentElpac.listening || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">Speaking</span>
                      <span className="text-sm font-medium mt-1">{studentElpac.speaking || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Written Language */}
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-eld-almond-silk/30 dark:bg-eld-almond-silk/5 border border-eld-almond-silk/40 dark:border-eld-almond-silk/10">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-eld-space-indigo dark:text-eld-almond-silk">Written Language</span>
                    {studentElpac.written_score && (
                      <span className="text-xl font-bold">{studentElpac.written_score}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">Reading</span>
                      <span className="text-sm font-medium mt-1">{studentElpac.reading || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase">Writing</span>
                      <span className="text-sm font-medium mt-1">{studentElpac.writing || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prior year history — sorted by grade level */}
              {(studentElpac.prior_yr1_grade || studentElpac.prior_yr2_grade || studentElpac.prior_yr3_grade) && (
                <div className="pt-4 border-t border-border/50">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Year-over-Year Progress
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {/* Collect and sort prior years by grade level (ascending) */}
                    {[
                      studentElpac.prior_yr1_grade && studentElpac.prior_yr1_score
                        ? { grade: studentElpac.prior_yr1_grade, score: studentElpac.prior_yr1_score, level: studentElpac.prior_yr1_level }
                        : null,
                      studentElpac.prior_yr2_grade && studentElpac.prior_yr2_score
                        ? { grade: studentElpac.prior_yr2_grade, score: studentElpac.prior_yr2_score, level: studentElpac.prior_yr2_level }
                        : null,
                      studentElpac.prior_yr3_grade && studentElpac.prior_yr3_score
                        ? { grade: studentElpac.prior_yr3_grade, score: studentElpac.prior_yr3_score, level: studentElpac.prior_yr3_level }
                        : null,
                    ]
                      .filter(Boolean)
                      .sort((a: any, b: any) => {
                        const gradeA = parseInt(a.grade.replace(/\D/g, ''), 10);
                        const gradeB = parseInt(b.grade.replace(/\D/g, ''), 10);
                        return gradeA - gradeB;
                      })
                      .map((prior: any, idx: number) => (
                        <>
                          {idx > 0 && <div className="self-center text-muted-foreground/40">→</div>}
                          <div className="flex-1 min-w-[120px] flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/40 border border-border/50">
                            <span className="text-xs font-medium text-muted-foreground">{prior.grade}</span>
                            <span className="text-xl font-bold text-foreground">{prior.score}</span>
                            {prior.level && (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted-foreground/20 font-bold text-sm text-foreground">
                                {prior.level}
                              </div>
                            )}
                          </div>
                        </>
                      ))}

                    {/* Arrow to current year */}
                    {[
                      studentElpac.prior_yr1_grade, studentElpac.prior_yr2_grade, studentElpac.prior_yr3_grade
                    ].filter(Boolean).length > 0 && (
                        <div className="self-center text-muted-foreground/40">→</div>
                      )}

                    {/* Current year — always shown last */}
                    <div className="flex-1 min-w-[120px] flex flex-col items-center gap-1 p-3 rounded-lg bg-eld-space-indigo/10 dark:bg-eld-space-indigo/20 border border-eld-space-indigo/20 ring-1 ring-eld-space-indigo/30">
                      <span className="text-xs font-medium text-muted-foreground">This Year</span>
                      <span className="text-xl font-bold text-foreground">{studentElpac.elpac_score}</span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-eld-space-indigo text-white font-bold text-sm dark:bg-eld-almond-silk dark:text-eld-space-indigo shadow-sm">
                        {studentElpac.elpac_level}
                      </div>
                      <span className="text-xs text-muted-foreground">Grade {studentElpac.grade}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
