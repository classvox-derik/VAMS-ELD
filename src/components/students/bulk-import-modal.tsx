"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ELBadge } from "./el-badge";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ELLevel } from "@/types";

interface ParsedStudent {
  name: string;
  grade: number;
  el_level: string;
  primary_language: string;
  notes?: string;
}

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (
    students: ParsedStudent[]
  ) => Promise<{ imported: number; errors: Array<{ row: number; issues: string[] }> }>;
}

const VALID_EL_LEVELS = ["Emerging", "Expanding", "Bridging"];

function parseCSV(text: string): { students: ParsedStudent[]; errors: string[] } {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { students: [], errors: ["No data to import."] };
  }

  // Check if first line is a header row
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes("name") ||
    firstLine.includes("grade") ||
    firstLine.includes("level") ||
    firstLine.includes("language");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const students: ParsedStudent[] = [];
  const errors: string[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const lineNum = hasHeader ? i + 2 : i + 1;
    const parts = dataLines[i].split(",").map((p) => p.trim());

    if (parts.length < 4) {
      errors.push(
        `Row ${lineNum}: Expected at least 4 columns (Name, Grade, EL Level, Language). Got ${parts.length}.`
      );
      continue;
    }

    const [name, gradeStr, elLevel, language, ...rest] = parts;
    const notes = rest.join(", ").trim() || undefined;

    if (!name || name.length < 2) {
      errors.push(`Row ${lineNum}: Name must be at least 2 characters.`);
      continue;
    }

    const grade = parseInt(gradeStr, 10);
    if (isNaN(grade) || grade < 5 || grade > 8) {
      errors.push(`Row ${lineNum}: Grade must be 5, 6, 7, or 8. Got "${gradeStr}".`);
      continue;
    }

    // Normalize EL level (case-insensitive match)
    const normalizedLevel = VALID_EL_LEVELS.find(
      (l) => l.toLowerCase() === elLevel.toLowerCase()
    );
    if (!normalizedLevel) {
      errors.push(
        `Row ${lineNum}: EL Level must be Emerging, Expanding, or Bridging. Got "${elLevel}".`
      );
      continue;
    }

    if (!language || language.length < 2) {
      errors.push(`Row ${lineNum}: Language must be at least 2 characters.`);
      continue;
    }

    students.push({
      name,
      grade,
      el_level: normalizedLevel,
      primary_language: language,
      notes,
    });
  }

  return { students, errors };
}

export function BulkImportModal({
  open,
  onOpenChange,
  onImport,
}: BulkImportModalProps) {
  const [csvText, setCsvText] = useState("");
  const [parsed, setParsed] = useState<ParsedStudent[] | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    errors: Array<{ row: number; issues: string[] }>;
  } | null>(null);

  function handleParse() {
    const { students, errors } = parseCSV(csvText);
    setParsed(students);
    setParseErrors(errors);
    setResult(null);
  }

  async function handleImport() {
    if (!parsed || parsed.length === 0) return;
    setIsImporting(true);
    try {
      const res = await onImport(parsed);
      setResult(res);
      if (res.imported > 0) {
        setParsed(null);
        setCsvText("");
      }
    } catch {
      setResult({ imported: 0, errors: [{ row: 0, issues: ["Import failed. Check your connection."] }] });
    } finally {
      setIsImporting(false);
    }
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setCsvText("");
      setParsed(null);
      setParseErrors([]);
      setResult(null);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Students</DialogTitle>
          <DialogDescription>
            Paste CSV data with columns: Name, Grade, EL Level, Primary Language, Notes (optional)
          </DialogDescription>
        </DialogHeader>

        {/* Success result */}
        {result && result.imported > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Successfully imported {result.imported} student{result.imported !== 1 ? "s" : ""}.
            {result.errors.length > 0 && ` ${result.errors.length} row(s) had errors.`}
          </div>
        )}

        {/* Error result */}
        {result && result.imported === 0 && result.errors.length > 0 && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Import failed
            </div>
            {result.errors.map((e, i) => (
              <p key={i}>Row {e.row}: {e.issues.join(", ")}</p>
            ))}
          </div>
        )}

        {/* CSV Input */}
        {!parsed && !result?.imported && (
          <div className="space-y-3">
            <Textarea
              placeholder={`Name, Grade, EL Level, Language, Notes (optional)\nMaria Garcia, 6, Emerging, Spanish\nLi Wei, 7, Expanding, Mandarin, Transfer student\nAhmed Hassan, 5, Bridging, Arabic`}
              rows={10}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="font-mono text-sm"
            />

            {parseErrors.length > 0 && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {parseErrors.length} error{parseErrors.length !== 1 ? "s" : ""} found
                </div>
                {parseErrors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button onClick={handleParse} disabled={!csvText.trim()}>
                Preview
              </Button>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {parsed && parsed.length > 0 && !result?.imported && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {parsed.length} student{parsed.length !== 1 ? "s" : ""} ready to import
              {parseErrors.length > 0 && ` (${parseErrors.length} row(s) skipped due to errors)`}
            </p>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-eld-almond-silk/40 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-eld-seashell/50 dark:bg-gray-800/50">
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Grade</th>
                    <th className="px-3 py-2 text-left font-medium">EL Level</th>
                    <th className="px-3 py-2 text-left font-medium">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((s, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2">{s.name}</td>
                      <td className="px-3 py-2">{s.grade}</td>
                      <td className="px-3 py-2">
                        <ELBadge level={s.el_level as ELLevel} />
                      </td>
                      <td className="px-3 py-2">{s.primary_language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {parseErrors.length > 0 && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <p className="font-medium">Skipped rows:</p>
                {parseErrors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setParsed(null);
                  setParseErrors([]);
                }}
              >
                Back
              </Button>
              <Button onClick={handleImport} disabled={isImporting} className="gap-2">
                <Upload className="h-4 w-4" />
                {isImporting ? "Importing..." : `Import ${parsed.length} Student${parsed.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        )}

        {/* All done — close */}
        {result && result.imported > 0 && (
          <div className="flex justify-end">
            <Button onClick={() => handleClose(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
