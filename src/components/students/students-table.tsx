"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ELBadge } from "./el-badge";
import type { Student, ELLevel } from "@/types";
import { EL_LEVELS, GRADES } from "@/types";

type SortField = "name" | "grade" | "el_level" | "homeroom" | "overall_level";
type SortDirection = "asc" | "desc";

interface StudentsTableProps {
  students: Student[];
  isAdmin?: boolean;
  onAdd?: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export function StudentsTable({
  students,
  isAdmin = false,
  onAdd,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [elFilter, setElFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAndSorted = useMemo(() => {
    let result = [...students];

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerSearch) ||
          s.ssid?.toLowerCase().includes(lowerSearch) ||
          s.homeroom?.toLowerCase().includes(lowerSearch) ||
          s.primary_language.toLowerCase().includes(lowerSearch)
      );
    }

    // Grade filter
    if (gradeFilter !== "all") {
      result = result.filter((s) => s.grade === parseInt(gradeFilter));
    }

    // EL level filter
    if (elFilter !== "all") {
      result = result.filter((s) => s.el_level === elFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison =
        typeof aVal === "string"
          ? aVal.localeCompare(bVal as string)
          : (aVal as number) - (bVal as number);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [students, search, gradeFilter, elFilter, sortField, sortDirection]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function SortButton({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
      >
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-36 flex-none"
          >
            <option value="all">All Grades</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </Select>
          <Select
            value={elFilter}
            onChange={(e) => setElFilter(e.target.value)}
            className="w-36 flex-none"
          >
            <option value="all">All Levels</option>
            {EL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </div>
        {isAdmin && onAdd && (
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredAndSorted.length} student{filteredAndSorted.length !== 1 ? "s" : ""}
        {(search || gradeFilter !== "all" || elFilter !== "all") && " (filtered)"}
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border border-eld-almond-silk/40 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-eld-seashell/50 dark:bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="name">Name</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="grade">Grade</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="homeroom">Homeroom</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="el_level">EL Level</SortButton>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="overall_level">Overall</SortButton>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                Oral
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                Written
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {students.length === 0
                    ? isAdmin
                      ? "No students yet. Click \"Add Student\" to begin."
                      : "No students have been added yet. Contact an admin to add students."
                    : "No students match your filters."}
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((student) => (
                <tr
                  key={student.id}
                  className="border-b hover:bg-eld-almond-silk/20 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/students/${student.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {student.name}
                    </Link>
                    {student.ssid && (
                      <span className="block text-xs text-muted-foreground">{student.ssid}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{student.grade}</td>
                  <td className="px-4 py-3 text-sm">{student.homeroom}</td>
                  <td className="px-4 py-3">
                    <ELBadge level={student.el_level} />
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{student.overall_level || "-"}</td>
                  <td className="px-4 py-3 text-center text-sm">{student.oral_language_level || "-"}</td>
                  <td className="px-4 py-3 text-center text-sm">{student.written_language_level || "-"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(student)}
                          aria-label={`Edit ${student.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete?.(student)}
                          aria-label={`Delete ${student.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {filteredAndSorted.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            {students.length === 0
              ? isAdmin
                ? "No students yet. Click \"Add Student\" to begin."
                : "No students have been added yet. Contact an admin to add students."
              : "No students match your filters."}
          </div>
        ) : (
          filteredAndSorted.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border border-eld-almond-silk/40 bg-white p-4 space-y-2 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between">
                <Link
                  href={`/students/${student.id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {student.name}
                </Link>
                <ELBadge level={student.el_level} />
              </div>
              <div className="text-sm text-muted-foreground">
                Grade {student.grade} &middot; {student.homeroom}
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>Overall: {student.overall_level || "-"}</span>
                <span>Oral: {student.oral_language_level || "-"}</span>
                <span>Written: {student.written_language_level || "-"}</span>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-1 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(student)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(student)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
