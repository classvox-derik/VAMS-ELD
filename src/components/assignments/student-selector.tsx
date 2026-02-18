"use client";

import { useState, useMemo } from "react";
import { Search, Users, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ELBadge } from "@/components/students/el-badge";
import { cn } from "@/lib/utils";
import type { Student, ELLevel } from "@/types";
import { EL_LEVELS } from "@/types";

export type StudentSelection =
  | { type: "individual"; student: Student }
  | { type: "bulk"; level: ELLevel; students: Student[] };

interface StudentSelectorProps {
  students: Student[];
  selection: StudentSelection | null;
  onSelect: (selection: StudentSelection | null) => void;
}

export function StudentSelector({
  students,
  selection,
  onSelect,
}: StudentSelectorProps) {
  const [isOpen, setIsOpen] = useState(!selection);
  const [search, setSearch] = useState("");

  const studentsByLevel = useMemo(() => {
    const map: Record<ELLevel, Student[]> = {
      Emerging: [],
      Expanding: [],
      Bridging: [],
    };
    students.forEach((s) => map[s.el_level].push(s));
    return map;
  }, [students]);

  const filtered = useMemo(() => {
    if (!search) return students;
    const lower = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.primary_language.toLowerCase().includes(lower)
    );
  }, [students, search]);

  function handleSelectStudent(student: Student) {
    onSelect({ type: "individual", student });
    setIsOpen(false);
    setSearch("");
  }

  function handleSelectBulk(level: ELLevel) {
    const levelStudents = studentsByLevel[level];
    if (levelStudents.length === 0) return;
    onSelect({ type: "bulk", level, students: levelStudents });
    setIsOpen(false);
    setSearch("");
  }

  // Show selected state
  if (selection && !isOpen) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Selected Student(s)</label>
        <div className="flex items-center justify-between rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2">
            {selection.type === "individual" ? (
              <>
                <span className="font-medium">{selection.student.name}</span>
                <ELBadge level={selection.student.el_level} />
                <span className="text-sm text-muted-foreground">
                  Grade {selection.student.grade}
                </span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  All {selection.level} Students
                </span>
                <span className="text-sm text-muted-foreground">
                  ({selection.students.length} student
                  {selection.students.length !== 1 ? "s" : ""})
                </span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Change
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Who is this assignment for?</label>

      {/* Bulk options */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {EL_LEVELS.map((level) => {
          const count = studentsByLevel[level].length;
          return (
            <button
              key={level}
              onClick={() => handleSelectBulk(level)}
              disabled={count === 0}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 text-left transition-colors",
                count > 0
                  ? "hover:border-primary hover:bg-primary/5 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <ELBadge level={level} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {count} student{count !== 1 ? "s" : ""}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t" />
        <span className="px-3 text-xs text-muted-foreground">or select individual</span>
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

      {/* Student list */}
      <div className="max-h-48 overflow-y-auto rounded-md border scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {students.length === 0
              ? "No students in your roster yet."
              : "No students match your search."}
          </div>
        ) : (
          filtered.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student)}
              className="flex w-full items-center justify-between border-b px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{student.name}</span>
                <span className="text-xs text-muted-foreground">
                  Grade {student.grade}
                </span>
              </div>
              <ELBadge level={student.el_level} />
            </button>
          ))
        )}
      </div>

      {selection && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onSelect(null);
            setIsOpen(false);
          }}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
