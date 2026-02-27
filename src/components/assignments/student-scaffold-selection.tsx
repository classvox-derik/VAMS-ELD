"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StudentSelector, type StudentSelection } from "./student-selector";
import { ScaffoldPicker } from "./scaffold-picker";
import { getAllStudents } from "@/lib/queries/students";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import { saveToLibrary } from "@/lib/local-library";
import type { Student, ELLevel } from "@/types";

interface StudentScaffoldSelectionProps {
  assignmentTitle: string;
  content: string;
  subject?: string;
  sourceType?: string;
  gradeLevel?: number;
  contentLength: number;
  onBack: () => void;
}

export function StudentScaffoldSelection({
  assignmentTitle,
  content,
  subject,
  gradeLevel,
  contentLength,
  onBack,
}: StudentScaffoldSelectionProps) {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [selection, setSelection] = useState<StudentSelection | null>(null);
  const [selectedScaffoldNames, setSelectedScaffoldNames] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch students
  useEffect(() => {
    async function load() {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch {
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Get all unique EL levels from selection
  const selectedElLevels: ELLevel[] = useMemo(() => {
    if (!selection) return [];
    const levels = new Set<ELLevel>();
    selection.students.forEach((s) => levels.add(s.el_level));
    return Array.from(levels);
  }, [selection]);

  // Stable key for tracking level changes
  const elLevelsKey = selectedElLevels.join(",");

  // Auto-select recommended scaffolds when EL levels change
  useEffect(() => {
    if (selectedElLevels.length === 0) {
      setSelectedScaffoldNames(new Set());
      return;
    }
    const recommended = new Set<string>();
    defaultScaffolds.forEach((s) => {
      if (selectedElLevels.some((level) => s.el_level_target.includes(level))) {
        recommended.add(s.name);
      }
    });
    setSelectedScaffoldNames(recommended);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elLevelsKey]);

  const handleToggleScaffold = useCallback((name: string) => {
    setSelectedScaffoldNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const handleSelectAllScaffolds = useCallback(() => {
    if (selectedElLevels.length === 0) return;
    const all = new Set<string>();
    defaultScaffolds.forEach((s) => {
      if (selectedElLevels.some((level) => s.el_level_target.includes(level))) {
        all.add(s.name);
      }
    });
    setSelectedScaffoldNames(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elLevelsKey]);

  const handleClearAllScaffolds = useCallback(() => {
    setSelectedScaffoldNames(new Set());
  }, []);

  const canGenerate =
    selection !== null &&
    selection.students.length > 0 &&
    selectedScaffoldNames.size > 0;

  // Batch-by-level: group students by EL level so we make at most 3 Gemini calls
  const batchLevels = useMemo(() => {
    if (!selection) return null;
    const levelMap = new Map<ELLevel, Student[]>();
    selection.students.forEach((s) => {
      const arr = levelMap.get(s.el_level) ?? [];
      arr.push(s);
      levelMap.set(s.el_level, arr);
    });
    return levelMap;
  }, [selection]);

  const generationCount = batchLevels ? batchLevels.size : 0;

  async function handleGenerate() {
    if (!canGenerate || !batchLevels) return;
    setIsGenerating(true);
    setShowConfirm(false);

    try {
      const scaffoldNames = Array.from(selectedScaffoldNames);
      const levels = Array.from(batchLevels.entries());

      if (levels.length === 1) {
        const [level, levelStudents] = levels[0];
        const isSingle = levelStudents.length === 1;

        // Single level — one Gemini call
        const result = await callScaffoldAPI({
          content,
          title: assignmentTitle,
          subject,
          gradeLevel,
          elLevel: level,
          scaffoldNames,
          studentId: isSingle ? levelStudents[0].id : undefined,
          studentIds: !isSingle ? levelStudents.map((s) => s.id) : undefined,
        });

        const resultId = crypto.randomUUID();
        const studentName = isSingle
          ? levelStudents[0].name
          : `${levelStudents.length} ${level} students`;

        storeAndNavigate(resultId, result, studentName, level);
      } else {
        // Batch mode: generate per-level (max 3 calls)
        const results = await Promise.all(
          levels.map(([level, levelStudents]) =>
            callScaffoldAPI({
              content,
              title: assignmentTitle,
              subject,
              gradeLevel,
              elLevel: level,
              scaffoldNames,
              studentIds: levelStudents.map((s) => s.id),
            })
          )
        );

        // Store a combined result with all levels
        const resultId = crypto.randomUUID();
        const generatedAt = new Date().toISOString();
        const totalStudents = selection.students.length;

        const batchResult = {
          isBatch: true,
          levels: levels.map(([level, levelStudents], i) => ({
            level,
            studentCount: levelStudents.length,
            studentNames: levelStudents.map((s) => s.name),
            outputHtml: results[i].outputHtml,
            wordBank: results[i].wordBank,
            scaffoldsUsed: results[i].scaffoldsUsed,
            teacherInstructions: results[i].teacherInstructions,
            scaffoldsApplied: results[i].scaffoldsApplied,
            isDemo: results[i].isDemo,
          })),
          assignmentTitle,
          originalContent: content,
          generatedAt,
        };

        sessionStorage.setItem(
          `scaffold-result-${resultId}`,
          JSON.stringify(batchResult)
        );

        // Save primary level to library
        const primaryLevel = levels[0];
        const primaryResult = results[0];
        saveToLibrary({
          id: resultId,
          assignmentTitle,
          elLevel: primaryLevel[0],
          studentName: `Batch: ${totalStudents} students (${levels.map(([l]) => l).join(", ")})`,
          scaffoldsApplied: primaryResult.scaffoldsApplied,
          outputHtml: primaryResult.outputHtml,
          originalContent: content,
          isDemo: primaryResult.isDemo,
          teacherNotes: "",
          createdAt: generatedAt,
        });

        toast.success(
          `Generated scaffolded versions for ${levels.length} level(s) (${totalStudents} students)`
        );

        router.push(`/create/result?id=${resultId}`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function callScaffoldAPI(params: {
    content: string;
    title: string;
    subject?: string;
    gradeLevel?: number;
    elLevel: ELLevel;
    scaffoldNames: string[];
    studentId?: string;
    studentIds?: string[];
  }) {
    const response = await fetch("/api/scaffold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.detail
        ? `${data.error}: ${data.detail}`
        : data.error || "Generation failed";
      throw new Error(msg);
    }

    return data;
  }

  function storeAndNavigate(
    resultId: string,
    data: Record<string, unknown>,
    studentName: string,
    elLevel: ELLevel
  ) {
    const generatedAt = new Date().toISOString();

    sessionStorage.setItem(
      `scaffold-result-${resultId}`,
      JSON.stringify({
        outputHtml: data.outputHtml,
        wordBank: data.wordBank,
        scaffoldsUsed: data.scaffoldsUsed,
        teacherInstructions: data.teacherInstructions,
        isDemo: data.isDemo,
        scaffoldsApplied: data.scaffoldsApplied,
        assignmentTitle,
        elLevel,
        studentName,
        originalContent: content,
        generatedAt,
      })
    );

    saveToLibrary({
      id: resultId,
      assignmentTitle,
      elLevel,
      studentName,
      scaffoldsApplied: data.scaffoldsApplied as string[],
      outputHtml: data.outputHtml as string,
      originalContent: content,
      isDemo: data.isDemo as boolean,
      teacherNotes: "",
      createdAt: generatedAt,
    });

    toast.success(
      data.isDemo
        ? "Demo preview generated! Connect Gemini API key for real results."
        : "Scaffolded assignment generated successfully!"
    );

    router.push(`/create/result?id=${resultId}`);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Selector */}
      <StudentSelector
        students={students}
        selection={selection}
        onSelect={setSelection}
        gradeLevel={gradeLevel}
      />

      {/* Scaffold Picker */}
      {selectedElLevels.length > 0 && (
        <ScaffoldPicker
          elLevels={selectedElLevels}
          selectedNames={selectedScaffoldNames}
          onToggle={handleToggleScaffold}
          onSelectAll={handleSelectAllScaffolds}
          onClearAll={handleClearAllScaffolds}
        />
      )}

      {/* Selection Summary */}
      {selection && selection.students.length > 0 && (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-medium mb-2">Summary</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Assignment:</strong> {assignmentTitle} (
              {contentLength.toLocaleString()} chars)
            </p>
            <p>
              <strong>For:</strong>{" "}
              {selection.students.length === 1
                ? `${selection.students[0].name} (${selection.students[0].el_level})`
                : `${selection.students.length} students`}
            </p>
            <p>
              <strong>Scaffolds:</strong> {selectedScaffoldNames.size} selected
            </p>
            {batchLevels && batchLevels.size > 1 && (
              <p>
                <strong>AI Calls:</strong> {batchLevels.size} (grouped by level:{" "}
                {Array.from(batchLevels.entries())
                  .map(([level, levelStudents]) => `${level}: ${levelStudents.length}`)
                  .join(", ")}
                )
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
          disabled={isGenerating}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </Button>
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={!canGenerate || isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Scaffolded Assignment
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Scaffolded Assignment?</DialogTitle>
            <DialogDescription>
              {generationCount === 1
                ? `This will generate a scaffolded version of "${assignmentTitle}" with ${selectedScaffoldNames.size} scaffold(s) applied.`
                : `This will generate ${generationCount} scaffolded version(s) of "${assignmentTitle}" grouped by EL level.`}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 text-sm text-muted-foreground">
            <p>
              This will use{" "}
              <strong>
                {generationCount} of your daily AI generations
              </strong>
              .
            </p>
            {batchLevels && batchLevels.size > 1 && (
              <p className="mt-1">
                Students grouped by level — same level students share one scaffold output.
              </p>
            )}
            <p className="mt-1">Estimated time: ~{generationCount * 10}-{generationCount * 15} seconds</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Confirm & Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
