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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

function ScaffoldResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ScaffoldResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isExporting, setIsExporting] = useState(false);
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
    } catch {
      setNotFound(true);
    }
  }, [searchParams]);

  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (resultIdRef.current) {
          updateTeacherNotes(resultIdRef.current, value);
        }
      }, 500);
    },
    []
  );

  async function handleDownloadPdf() {
    if (!result) return;
    setIsExporting(true);
    try {
      const { downloadPdf } = await import("@/lib/export-pdf");
      const filename = `${result.assignmentTitle}-${result.elLevel}-scaffolded.pdf`;
      await downloadPdf("scaffold-preview-content", filename);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
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
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin dark:border-gray-700 dark:bg-gray-800/30">
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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 focus:border-eld-space-indigo focus:outline-none focus:ring-3 focus:ring-eld-space-indigo/10 min-h-[80px] resize-y dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
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
