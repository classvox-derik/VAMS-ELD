"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  PenSquare,
  FileText,
  ExternalLink,
  Printer,
  Download,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Copy,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ELBadge } from "@/components/students/el-badge";
import { updateTeacherNotes } from "@/lib/local-library";
import { useGoogleDocsExport } from "@/lib/hooks/use-google-docs-export";
import type { ELLevel } from "@/types";

interface ScaffoldResult {
  outputHtml: string;
  isDemo: boolean;
  scaffoldsApplied: string[];
  assignmentTitle: string;
  elLevel: ELLevel;
  studentName: string;
  originalContent?: string;
  teacherNotes?: string;
  generatedAt: string;
  // Structured output fields
  parentNote?: string;
  wordBank?: { term: string; definition: string }[];
  scaffoldsUsed?: string[];
  teacherInstructions?: string;
  // Batch mode
  isBatch?: boolean;
  levels?: BatchLevel[];
}

interface BatchLevel {
  level: ELLevel;
  studentCount: number;
  studentNames: string[];
  outputHtml: string;
  parentNote?: string;
  wordBank?: { term: string; definition: string }[];
  scaffoldsUsed?: string[];
  teacherInstructions?: string;
  scaffoldsApplied: string[];
  isDemo: boolean;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success(`${label} copied to clipboard!`),
    () => toast.error("Failed to copy to clipboard")
  );
}

function ParentNoteCard({ note }: { note: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-eld-lilac-ash" />
          <CardTitle className="text-sm">Parent Communication</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(note, "Parent note")}
          className="gap-1.5"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-eld-almond-silk/40 bg-eld-seashell/30 p-4 text-sm leading-relaxed dark:border-gray-700 dark:bg-gray-800/30">
          {note}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Personalize with the student&apos;s name before sending. Written at a 5th grade reading level.
        </p>
      </CardContent>
    </Card>
  );
}

function WordBankCard({
  wordBank,
}: {
  wordBank: { term: string; definition: string }[];
}) {
  const text = wordBank
    .map((w) => `${w.term}: ${w.definition}`)
    .join("\n");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-eld-lilac-ash" />
          <CardTitle className="text-sm">Word Bank</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(text, "Word bank")}
          className="gap-1.5"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {wordBank.map((entry) => (
            <div
              key={entry.term}
              className="flex gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/30"
            >
              <span className="font-semibold text-sm text-eld-space-indigo dark:text-eld-lilac-ash">
                {entry.term}:
              </span>
              <span className="text-sm text-muted-foreground">
                {entry.definition}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherInstructionsCard({ instructions }: { instructions: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-eld-lilac-ash" />
          <CardTitle className="text-sm">Teacher Instructions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {instructions}
        </p>
      </CardContent>
    </Card>
  );
}

function ScaffoldResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ScaffoldResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const resultIdRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    isGoogleConnected,
    isExporting: isGDocsExporting,
    exportToGoogleDocs,
  } = useGoogleDocsExport();

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      setNotFound(true);
      return;
    }
    resultIdRef.current = id;

    const stored = sessionStorage.getItem(`scaffold-result-${id}`);
    if (!stored) {
      setNotFound(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as ScaffoldResult;
      setResult(parsed);
      setNotes(parsed.teacherNotes ?? "");
      // Set initial tab for batch mode
      if (parsed.isBatch && parsed.levels?.length) {
        setActiveTab(parsed.levels[0].level);
      }
    } catch {
      setNotFound(true);
    }
  }, [searchParams]);

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (resultIdRef.current) {
        updateTeacherNotes(resultIdRef.current, value);
      }
    }, 500);
  }, []);

  async function handleDownloadPdf() {
    if (!result) return;
    setIsExporting(true);

    // Create an off-screen container at a fixed 800px width so html2canvas
    // renders at a consistent size that matches the PDF content area.
    // This prevents text overlap caused by capturing the live on-page element
    // at an unpredictable viewport-dependent width.
    const tempId = "pdf-export-result-temp";
    const container = document.createElement("div");
    container.id = tempId;
    container.style.cssText =
      "position:absolute;left:-9999px;top:0;width:800px;padding:24px;background:white;font-family:system-ui,sans-serif;color:#111;";
    container.innerHTML = result.outputHtml;
    document.body.appendChild(container);

    try {
      const { downloadPdf } = await import("@/lib/export-pdf");
      const filename = `${result.assignmentTitle}-${result.elLevel ?? "batch"}-scaffolded.pdf`;
      await downloadPdf(tempId, filename);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      const el = document.getElementById(tempId);
      if (el) document.body.removeChild(el);
      setIsExporting(false);
    }
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Result Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          This result may have expired or the session was cleared.
        </p>
        <Button onClick={() => router.push("/create")}>
          <PenSquare className="h-4 w-4 mr-2" />
          Create New Assignment
        </Button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-eld-space-indigo border-t-transparent dark:border-eld-dusty-grape dark:border-t-transparent" />
      </div>
    );
  }

  // Batch mode — tabbed by EL level
  if (result.isBatch && result.levels) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="scaffold-heading">Scaffolded Assignment (Batch)</h1>
            <p className="scaffold-description mt-1">
              Generated {result.levels.length} version(s) for{" "}
              {result.levels.reduce((sum, l) => sum + l.studentCount, 0)}{" "}
              students across {result.levels.length} EL level(s).
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/create")}
            className="gap-2 shrink-0"
          >
            <PenSquare className="h-4 w-4" />
            Create Another
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {result.levels.map((lvl) => (
              <TabsTrigger key={lvl.level} value={lvl.level} className="gap-1.5">
                <ELBadge level={lvl.level} />
                <span className="text-xs text-muted-foreground">
                  ({lvl.studentCount})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {result.levels.map((lvl) => (
            <TabsContent key={lvl.level} value={lvl.level} className="space-y-4 mt-4">
              {/* Students in this level */}
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Students ({lvl.studentCount})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.studentNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Scaffolded preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {lvl.level} Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="scaffold-preview rounded-lg border bg-white p-6 dark:bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: lvl.outputHtml }}
                  />
                </CardContent>
              </Card>

              {/* Teacher instructions */}
              {lvl.teacherInstructions && (
                <TeacherInstructionsCard
                  instructions={lvl.teacherInstructions}
                />
              )}

              {/* Word bank */}
              {lvl.wordBank && lvl.wordBank.length > 0 && (
                <WordBankCard wordBank={lvl.wordBank} />
              )}

              {/* Parent note */}
              {lvl.parentNote && <ParentNoteCard note={lvl.parentNote} />}
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => router.push("/create")} className="gap-2">
            <PenSquare className="h-4 w-4" />
            Create Another Assignment
          </Button>
        </div>
      </div>
    );
  }

  // Single-result mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="scaffold-heading">Scaffolded Assignment</h1>
          <p className="scaffold-description mt-1">
            Review the generated scaffolded assignment below.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/create")}
          className="gap-2 shrink-0"
        >
          <PenSquare className="h-4 w-4" />
          Create Another
        </Button>
      </div>

      {/* Metadata Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Assignment
              </p>
              <p className="text-sm font-medium mt-0.5">
                {result.assignmentTitle}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Student
              </p>
              <p className="text-sm font-medium mt-0.5">
                {result.studentName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                EL Level
              </p>
              <div className="mt-1">
                <ELBadge level={result.elLevel} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Status
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  Saved to Library
                </span>
              </div>
            </div>
          </div>

          {/* Scaffold tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.scaffoldsApplied.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-full bg-eld-almond-silk/20 px-2.5 py-0.5 text-xs font-medium text-eld-space-indigo"
              >
                {name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Instructions (from structured Gemini output) */}
      {result.teacherInstructions && (
        <TeacherInstructionsCard instructions={result.teacherInstructions} />
      )}

      {/* Original Content Toggle */}
      {result.originalContent && (
        <Card>
          <CardHeader className="pb-0">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-2 text-left"
            >
              <CardTitle className="text-sm">Original Assignment</CardTitle>
              {showOriginal ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CardHeader>
          {showOriginal && (
            <CardContent className="pt-3">
              <div className="rounded-xl border border-eld-almond-silk/40 bg-eld-seashell/50 p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin dark:border-gray-700 dark:bg-gray-800/30">
                {result.originalContent}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Generated HTML Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Preview</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Exporting..." : "Download PDF"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!isGoogleConnected || isGDocsExporting}
              onClick={() =>
                result &&
                exportToGoogleDocs({
                  title: result.assignmentTitle,
                  outputHtml: result.outputHtml,
                  elLevel: result.elLevel,
                  scaffoldsApplied: result.scaffoldsApplied,
                })
              }
              className="gap-1.5"
              title={
                isGoogleConnected
                  ? "Export to Google Docs"
                  : "Connect Google account in Settings"
              }
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isGDocsExporting ? "Exporting..." : "Google Docs"}
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            id="scaffold-preview-content"
            className="scaffold-preview rounded-lg border bg-white p-6 dark:bg-gray-50"
            dangerouslySetInnerHTML={{ __html: result.outputHtml }}
          />
        </CardContent>
      </Card>

      {/* Word Bank (structured, separate from HTML preview) */}
      {result.wordBank && result.wordBank.length > 0 && (
        <WordBankCard wordBank={result.wordBank} />
      )}

      {/* Parent Communication */}
      {result.parentNote && <ParentNoteCard note={result.parentNote} />}

      {/* Teacher Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Teacher Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about this scaffolded assignment..."
            className="w-full rounded-lg border border-eld-almond-silk/60 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 focus:border-eld-space-indigo focus:outline-none focus:ring-3 focus:ring-eld-space-indigo/10 min-h-[80px] resize-y dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Notes are auto-saved to your local library.
          </p>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => router.push("/create")} className="gap-2">
          <PenSquare className="h-4 w-4" />
          Create Another Assignment
        </Button>
      </div>
    </div>
  );
}

export default function ScaffoldResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-eld-space-indigo border-t-transparent dark:border-eld-dusty-grape dark:border-t-transparent" />
        </div>
      }
    >
      <ScaffoldResultContent />
    </Suspense>
  );
}
