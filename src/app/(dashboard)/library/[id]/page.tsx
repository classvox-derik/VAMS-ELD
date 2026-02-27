"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Printer,
  ExternalLink,
  FileText,
  PenSquare,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ELBadge } from "@/components/students/el-badge";
import { formatDate } from "@/lib/utils";
import { useGoogleDocsExport } from "@/lib/hooks/use-google-docs-export";
import type { DifferentiatedAssignment, ELLevel } from "@/types";

export default function LibraryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [entry, setEntry] = useState<DifferentiatedAssignment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    isGoogleConnected,
    isExporting: isGDocsExporting,
    exportToGoogleDocs,
  } = useGoogleDocsExport();

  const id = params.id as string;

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }
    async function load() {
      try {
        const res = await fetch(`/api/library/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setEntry(data);
        setNotes(data.teacher_notes ?? "");
      } catch {
        setNotFound(true);
      }
    }
    load();
  }, [id]);

  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (id) {
          try {
            await fetch(`/api/library/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ teacher_notes: value }),
            });
          } catch {
            // Silent fail on note save
          }
        }
      }, 500);
    },
    [id]
  );

  async function handleDownloadPdf() {
    if (!entry) return;
    setIsExporting(true);
    try {
      const { downloadScaffoldPdf } = await import("@/lib/export-pdf");
      await downloadScaffoldPdf({
        html: entry.output_html,
        title: entry.assignment_title,
        elLevel: entry.el_level as ELLevel,
        filename: `${entry.assignment_title}-${entry.el_level}-scaffolded.pdf`,
      });
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/library/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Assignment removed from library.");
      router.push("/library");
    } catch {
      toast.error("Failed to delete assignment.");
    }
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Assignment Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          This assignment may have been deleted.
        </p>
        <Button onClick={() => router.push("/library")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
      </div>
    );
  }

  if (!entry) {
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
          <h1 className="scaffold-heading">{entry.assignment_title}</h1>
          <p className="scaffold-description mt-1">
            Generated {formatDate(entry.created_at)}
            {entry.is_demo && " (Demo)"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowDelete(true)}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/create")}
            className="gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Metadata Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-theme-xs font-medium text-muted-foreground">
                Student
              </p>
              <p className="text-sm font-medium mt-0.5">{entry.student_name}</p>
            </div>
            <div>
              <p className="text-theme-xs font-medium text-muted-foreground">
                EL Level
              </p>
              <div className="mt-1">
                <ELBadge level={entry.el_level as ELLevel} />
              </div>
            </div>
            <div>
              <p className="text-theme-xs font-medium text-muted-foreground">
                Scaffolds Applied
              </p>
              <p className="text-sm font-medium mt-0.5">
                {entry.scaffolds_applied.length} scaffold
                {entry.scaffolds_applied.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.scaffolds_applied.map((name) => (
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
      {entry.original_content && (
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
                {entry.original_content}
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
                entry &&
                exportToGoogleDocs({
                  title: entry.assignment_title,
                  outputHtml: entry.output_html,
                  elLevel: entry.el_level as ELLevel,
                  scaffoldsApplied: entry.scaffolds_applied,
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
            className="scaffold-preview rounded-xl border bg-white p-6 dark:bg-gray-50"
            dangerouslySetInnerHTML={{ __html: entry.output_html }}
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
            className="w-full rounded-lg border border-eld-almond-silk/60 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-eld-space-indigo focus:outline-none focus:ring-3 focus:ring-eld-space-indigo/10 min-h-[80px] resize-y dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Notes are auto-saved.
          </p>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/library")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogDescription>
              This will permanently remove &quot;{entry.assignment_title}&quot;
              from your library. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
