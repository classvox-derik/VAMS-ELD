"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Trash2,
  PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ELBadge } from "@/components/students/el-badge";
import { getLibrary, deleteFromLibrary, type LibraryEntry } from "@/lib/local-library";
import { formatRelativeDate } from "@/lib/utils";
import type { ELLevel } from "@/types";
import { EL_LEVELS } from "@/types";

export default function LibraryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<ELLevel | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<LibraryEntry | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getLibrary());
  }, []);

  const filtered = useMemo(() => {
    let result = entries;
    if (filterLevel !== "all") {
      result = result.filter((e) => e.elLevel === filterLevel);
    }
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.assignmentTitle.toLowerCase().includes(lower) ||
          e.studentName.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [entries, search, filterLevel]);

  function handleDelete(entry: LibraryEntry) {
    deleteFromLibrary(entry.id);
    setEntries(getLibrary());
    setDeleteTarget(null);
    toast.success("Assignment removed from library.");
  }

  async function handleDownloadPdf(entry: LibraryEntry) {
    setIsExporting(entry.id);
    try {
      // Create a temporary hidden element with the HTML content
      const container = document.createElement("div");
      container.id = "pdf-export-temp";
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.padding = "24px";
      container.style.background = "white";
      container.innerHTML = entry.outputHtml;
      document.body.appendChild(container);

      const { downloadPdf } = await import("@/lib/export-pdf");
      const filename = `${entry.assignmentTitle}-${entry.elLevel}-scaffolded.pdf`;
      await downloadPdf("pdf-export-temp", filename);
      toast.success("PDF downloaded!");

      document.body.removeChild(container);
    } catch {
      toast.error("Failed to generate PDF.");
      const el = document.getElementById("pdf-export-temp");
      if (el) document.body.removeChild(el);
    } finally {
      setIsExporting(null);
    }
  }

  function handleView(entry: LibraryEntry) {
    router.push(`/library/${entry.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="scaffold-heading">Library</h1>
          <p className="scaffold-description mt-1">
            Your saved scaffolded assignments.
          </p>
        </div>
        <Button
          onClick={() => router.push("/create")}
          className="gap-2 shrink-0"
        >
          <PenSquare className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {/* EL Level Filter */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterLevel("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filterLevel === "all"
                  ? "bg-eld-space-indigo text-white"
                  : "bg-eld-almond-silk/20 text-eld-dusty-grape hover:bg-eld-almond-silk/40 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {EL_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterLevel === level
                    ? "bg-eld-space-indigo text-white"
                    : "bg-eld-almond-silk/20 text-eld-dusty-grape hover:bg-eld-almond-silk/40 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-eld-almond-silk/40 dark:border-gray-700 py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No saved assignments yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Scaffolded assignments will be saved here after generation.
          </p>
          <Button
            onClick={() => router.push("/create")}
            className="mt-4 gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Create Your First Assignment
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-eld-almond-silk/40 dark:border-gray-700 py-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No matching assignments
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((entry) => (
            <Card
              key={entry.id}
              className="group relative hover:shadow-theme-md transition-shadow"
            >
              <CardContent className="pt-5">
                <div className="space-y-3">
                  {/* Title & Demo badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {entry.assignmentTitle}
                    </h3>
                    {entry.isDemo && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        Demo
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2">
                    <ELBadge level={entry.elLevel} />
                    <span className="text-xs text-muted-foreground">
                      {entry.studentName}
                    </span>
                  </div>

                  {/* Scaffold tags */}
                  <div className="flex flex-wrap gap-1">
                    {entry.scaffoldsApplied.slice(0, 3).map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-eld-almond-silk/20 px-2 py-0.5 text-[10px] text-eld-dusty-grape dark:bg-gray-800 dark:text-gray-400"
                      >
                        {name.split(":")[0]}
                      </span>
                    ))}
                    {entry.scaffoldsApplied.length > 3 && (
                      <span className="rounded-full bg-eld-almond-silk/20 px-2 py-0.5 text-[10px] text-eld-dusty-grape dark:bg-gray-800 dark:text-gray-400">
                        +{entry.scaffoldsApplied.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(entry.createdAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(entry)}
                      className="gap-1.5 flex-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPdf(entry)}
                      disabled={isExporting === entry.id}
                      className="gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(entry)}
                      className="gap-1.5 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogDescription>
              This will permanently remove &quot;{deleteTarget?.assignmentTitle}
              &quot; from your library. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
