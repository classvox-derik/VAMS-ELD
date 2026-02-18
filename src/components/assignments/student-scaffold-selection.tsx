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
  const [selectedScaffoldIds, setSelectedScaffoldIds] = useState<Set<number>>(
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

  // Get current EL level from selection
  const currentElLevel: ELLevel | null = useMemo(() => {
    if (!selection) return null;
    if (selection.type === "individual") return selection.student.el_level;
    return selection.level;
  }, [selection]);

  // Auto-select recommended scaffolds when EL level changes
  useEffect(() => {
    if (!currentElLevel) {
      setSelectedScaffoldIds(new Set());
      return;
    }
    const recommended = new Set<number>();
    defaultScaffolds.forEach((s, i) => {
      if (s.el_level_target.includes(currentElLevel)) {
        recommended.add(i);
      }
    });
    setSelectedScaffoldIds(recommended);
  }, [currentElLevel]);

  const handleToggleScaffold = useCallback((index: number) => {
    setSelectedScaffoldIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!currentElLevel) return;
    const all = new Set<number>();
    defaultScaffolds.forEach((s, i) => {
      if (s.el_level_target.includes(currentElLevel)) {
        all.add(i);
      }
    });
    setSelectedScaffoldIds(all);
  }, [currentElLevel]);

  const handleClearAll = useCallback(() => {
    setSelectedScaffoldIds(new Set());
  }, []);

  const canGenerate = selection !== null && selectedScaffoldIds.size > 0;
  const generationCount =
    selection?.type === "bulk" ? selection.students.length : 1;

  async function handleGenerate() {
    if (!canGenerate || !currentElLevel) return;
    setIsGenerating(true);
    setShowConfirm(false);

    try {
      const scaffoldIndices = Array.from(selectedScaffoldIds);

      const response = await fetch("/api/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          title: assignmentTitle,
          subject: subject || undefined,
          gradeLevel: gradeLevel || undefined,
          elLevel: currentElLevel,
          scaffoldIndices,
          studentId:
            selection.type === "individual"
              ? selection.student.id
              : undefined,
          studentIds:
            selection.type === "bulk"
              ? selection.students.map((s) => s.id)
              : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      // Store result in sessionStorage for the result page
      const resultId = crypto.randomUUID();
      const studentName =
        selection.type === "individual"
          ? selection.student.name
          : `All ${currentElLevel} students`;
      const generatedAt = new Date().toISOString();

      sessionStorage.setItem(
        `scaffold-result-${resultId}`,
        JSON.stringify({
          outputHtml: data.outputHtml,
          isDemo: data.isDemo,
          scaffoldsApplied: data.scaffoldsApplied,
          assignmentTitle,
          elLevel: currentElLevel,
          studentName,
          originalContent: content,
          generatedAt,
        })
      );

      // Persist to local library
      saveToLibrary({
        id: resultId,
        assignmentTitle,
        elLevel: currentElLevel,
        studentName,
        scaffoldsApplied: data.scaffoldsApplied,
        outputHtml: data.outputHtml,
        originalContent: content,
        isDemo: data.isDemo,
        teacherNotes: "",
        createdAt: generatedAt,
      });

      toast.success(
        data.isDemo
          ? "Demo preview generated! Connect Gemini API key for real results."
          : "Scaffolded assignment generated successfully!"
      );

      router.push(`/create/result?id=${resultId}`);
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
      />

      {/* Scaffold Picker */}
      {currentElLevel && (
        <ScaffoldPicker
          elLevel={currentElLevel}
          selectedIds={selectedScaffoldIds}
          onToggle={handleToggleScaffold}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />
      )}

      {/* Selection Summary */}
      {selection && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <h4 className="text-sm font-medium mb-2">Summary</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Assignment:</strong> {assignmentTitle} (
              {contentLength.toLocaleString()} chars)
            </p>
            <p>
              <strong>For:</strong>{" "}
              {selection.type === "individual"
                ? `${selection.student.name} (${selection.student.el_level})`
                : `All ${selection.level} students (${selection.students.length})`}
            </p>
            <p>
              <strong>Scaffolds:</strong> {selectedScaffoldIds.size} selected
            </p>
            {generationCount > 1 && (
              <p>
                <strong>Generations:</strong> {generationCount} (one per student)
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
                ? `This will generate a scaffolded version of "${assignmentTitle}" with ${selectedScaffoldIds.size} scaffold(s) applied.`
                : `This will generate ${generationCount} scaffolded versions of "${assignmentTitle}" (one per ${currentElLevel} student).`}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            <p>
              This will use{" "}
              <strong>
                {generationCount} of your 1,000 daily AI generations
              </strong>
              .
            </p>
            <p className="mt-1">Estimated time: ~10-15 seconds</p>
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
