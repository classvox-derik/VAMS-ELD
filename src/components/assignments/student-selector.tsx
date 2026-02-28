"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Users, Check, X, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ELBadge } from "@/components/students/el-badge";
import { cn } from "@/lib/utils";
import type { Student, ELLevel } from "@/types";
import { EL_LEVELS, GRADES } from "@/types";

export type StudentSelection = { type: "multi"; students: Student[] };

interface StudentSelectorProps {
  students: Student[];
  selection: StudentSelection | null;
  onSelect: (selection: StudentSelection | null) => void;
  /** Grade level from Step 2 — when set, EL level / grade buttons filter to this grade */
  gradeLevel?: number;
}

export function StudentSelector({
  students,
  selection,
  onSelect,
  gradeLevel,
}: StudentSelectorProps) {
  const [search, setSearch] = useState("");

  const selectedIds = useMemo(() => {
    if (!selection) return new Set<string>();
    return new Set(selection.students.map((s) => s.id));
  }, [selection]);

  // Students scoped to the assignment grade level (if specified)
  const gradeScopedStudents = useMemo(() => {
    if (!gradeLevel) return students;
    return students.filter((s) => s.grade === gradeLevel);
  }, [students, gradeLevel]);

  const studentsByLevel = useMemo(() => {
    const map: Record<ELLevel, Student[]> = {
      Emerging: [],
      Expanding: [],
      Bridging: [],
    };
    gradeScopedStudents.forEach((s) => map[s.el_level].push(s));
    return map;
  }, [gradeScopedStudents]);

  const studentsByHomeroom = useMemo(() => {
    const map: Record<string, Student[]> = {};
    gradeScopedStudents.forEach((s) => {
      const hr = s.homeroom || "Unassigned";
      if (!map[hr]) map[hr] = [];
      map[hr].push(s);
    });
    return Object.fromEntries(
      Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
    );
  }, [gradeScopedStudents]);

  const studentsByGrade = useMemo(() => {
    const map: Partial<Record<number, Student[]>> = {};
    GRADES.forEach((g) => (map[g] = []));
    students.forEach((s) => {
      if (map[s.grade]) map[s.grade]!.push(s);
    });
    return map;
  }, [students]);

  const filtered = useMemo(() => {
    const pool = gradeScopedStudents;
    if (!search) return pool;
    const lower = search.toLowerCase();
    return pool.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.primary_language.toLowerCase().includes(lower)
    );
  }, [gradeScopedStudents, search]);

  const toggleStudent = useCallback(
    (student: Student) => {
      const current = selection?.students ?? [];
      const exists = current.some((s) => s.id === student.id);
      const next = exists
        ? current.filter((s) => s.id !== student.id)
        : [...current, student];
      onSelect(next.length > 0 ? { type: "multi", students: next } : null);
    },
    [selection, onSelect]
  );

  const toggleGroup = useCallback(
    (groupStudents: Student[]) => {
      const current = selection?.students ?? [];
      const currentIds = new Set(current.map((s) => s.id));
      const allSelected = groupStudents.every((s) => currentIds.has(s.id));

      let next: Student[];
      if (allSelected) {
        const groupIds = new Set(groupStudents.map((s) => s.id));
        next = current.filter((s) => !groupIds.has(s.id));
      } else {
        const toAdd = groupStudents.filter((s) => !currentIds.has(s.id));
        next = [...current, ...toAdd];
      }
      onSelect(next.length > 0 ? { type: "multi", students: next } : null);
    },
    [selection, onSelect]
  );

  const selectAll = useCallback(() => {
    onSelect(
      gradeScopedStudents.length > 0
        ? { type: "multi", students: [...gradeScopedStudents] }
        : null
    );
  }, [gradeScopedStudents, onSelect]);

  const clearAll = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  const isGroupFullySelected = useCallback(
    (groupStudents: Student[]) => {
      if (groupStudents.length === 0) return false;
      return groupStudents.every((s) => selectedIds.has(s.id));
    },
    [selectedIds]
  );

  const isGroupPartiallySelected = useCallback(
    (groupStudents: Student[]) => {
      if (groupStudents.length === 0) return false;
      const some = groupStudents.some((s) => selectedIds.has(s.id));
      const all = groupStudents.every((s) => selectedIds.has(s.id));
      return some && !all;
    },
    [selectedIds]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Who is this assignment for?
        </label>
        {selectedIds.size > 0 && (
          <span className="text-xs font-medium text-eld-space-indigo dark:text-eld-seashell">
            {selectedIds.size} student{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      {gradeLevel && (
        <p className="text-xs text-muted-foreground">
          Showing students in <strong>Grade {gradeLevel}</strong> (set in Step 2).
        </p>
      )}

      {/* Quick-select by Grade Level — only show when no grade is locked from Step 2 */}
      {!gradeLevel && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Select by Grade Level</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GRADES.map((grade) => {
              const gradeStudents = studentsByGrade[grade] ?? [];
              const count = gradeStudents.length;
              const fullySelected = isGroupFullySelected(gradeStudents);
              const partiallySelected = isGroupPartiallySelected(gradeStudents);
              return (
                <button
                  key={grade}
                  onClick={() => toggleGroup(gradeStudents)}
                  disabled={count === 0}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-2.5 text-left text-sm transition-colors",
                    fullySelected
                      ? "border-eld-space-indigo bg-eld-space-indigo/10 dark:border-eld-dusty-grape dark:bg-eld-dusty-grape/20"
                      : partiallySelected
                      ? "border-eld-space-indigo/50 bg-eld-space-indigo/5 dark:border-eld-dusty-grape/50 dark:bg-eld-dusty-grape/10"
                      : "border-gray-200 dark:border-gray-800",
                    count > 0
                      ? "hover:border-eld-space-indigo hover:bg-eld-space-indigo/5 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div>
                    <span className="font-medium">Grade {grade}</span>
                    <p className="text-[10px] text-muted-foreground">
                      {count} student{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {fullySelected && (
                    <Check className="h-4 w-4 text-black dark:text-eld-seashell" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick-select by EL Level */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Select by EL Level</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {EL_LEVELS.map((level) => {
            const levelStudents = studentsByLevel[level];
            const count = levelStudents.length;
            const fullySelected = isGroupFullySelected(levelStudents);
            const partiallySelected = isGroupPartiallySelected(levelStudents);
            return (
              <button
                key={level}
                onClick={() => toggleGroup(levelStudents)}
                disabled={count === 0}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-2.5 text-left transition-colors",
                  fullySelected
                    ? "border-eld-space-indigo bg-eld-space-indigo/10 dark:border-eld-dusty-grape dark:bg-eld-dusty-grape/20"
                    : partiallySelected
                    ? "border-eld-space-indigo/50 bg-eld-space-indigo/5 dark:border-eld-dusty-grape/50 dark:bg-eld-dusty-grape/10"
                    : "border-gray-200 dark:border-gray-800",
                  count > 0
                    ? "hover:border-eld-space-indigo hover:bg-eld-space-indigo/5 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ELBadge level={level} />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {count} student{count !== 1 ? "s" : ""}
                  </p>
                </div>
                {fullySelected && (
                  <Check className="h-4 w-4 text-black dark:text-eld-seashell" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick-select by Homeroom */}
      {Object.keys(studentsByHomeroom).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Select by Homeroom{gradeLevel ? ` (Grade ${gradeLevel})` : ""}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(studentsByHomeroom).map(([homeroom, hrStudents]) => {
              const count = hrStudents.length;
              const fullySelected = isGroupFullySelected(hrStudents);
              const partiallySelected = isGroupPartiallySelected(hrStudents);
              return (
                <button
                  key={homeroom}
                  onClick={() => toggleGroup(hrStudents)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-2.5 text-left text-sm transition-colors",
                    fullySelected
                      ? "border-eld-space-indigo bg-eld-space-indigo/10 dark:border-eld-dusty-grape dark:bg-eld-dusty-grape/20"
                      : partiallySelected
                      ? "border-eld-space-indigo/50 bg-eld-space-indigo/5 dark:border-eld-dusty-grape/50 dark:bg-eld-dusty-grape/10"
                      : "border-gray-200 dark:border-gray-800",
                    "hover:border-eld-space-indigo hover:bg-eld-space-indigo/5 cursor-pointer"
                  )}
                >
                  <div>
                    <span className="font-medium">{homeroom}</span>
                    <p className="text-[10px] text-muted-foreground">
                      {count} student{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {fullySelected && (
                    <Check className="h-4 w-4 text-black dark:text-eld-seashell" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Select All / Clear All */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={selectAll} className="text-xs">
          Select All{gradeLevel ? ` Grade ${gradeLevel}` : ""}
        </Button>
        {selectedIds.size > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs gap-1">
            <X className="h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t" />
        <span className="px-3 text-xs text-muted-foreground">or select individual students</span>
        <div className="flex-grow border-t" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Student list with checkboxes */}
      <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {gradeScopedStudents.length === 0
              ? gradeLevel
                ? `No students in Grade ${gradeLevel}.`
                : "No students in your roster yet."
              : "No students match your search."}
          </div>
        ) : (
          filtered.map((student) => {
            const isSelected = selectedIds.has(student.id);
            return (
              <button
                key={student.id}
                onClick={() => toggleStudent(student)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left transition-colors last:border-b-0 dark:border-gray-800",
                  isSelected
                    ? "bg-eld-space-indigo/5 dark:bg-eld-dusty-grape/10"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-gray-900 bg-gray-900 dark:border-eld-dusty-grape dark:bg-eld-dusty-grape"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{student.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Grade {student.grade}
                    </span>
                  </div>
                  <ELBadge level={student.el_level} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Selected students review section */}
      {selection && selection.students.length > 0 && (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-black dark:text-eld-seashell" />
              <span className="text-sm font-medium">
                Selected Students ({selection.students.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs gap-1 h-7"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
            {selection.students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm hover:bg-white dark:hover:bg-gray-800/50 group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Grade {student.grade}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ELBadge level={student.el_level} />
                  <button
                    onClick={() => toggleStudent(student)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${student.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* EL level breakdown */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-700 pt-2">
            {EL_LEVELS.map((level) => {
              const count = selection.students.filter((s) => s.el_level === level).length;
              if (count === 0) return null;
              return (
                <span key={level} className="flex items-center gap-1">
                  <ELBadge level={level} />
                  <span>{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
