"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Users,
  ClipboardCheck,
  GraduationCap,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { elpacStudents } from "@/data/elpac-tracker";
import type { ElpacStudent } from "@/data/elpac-tracker";

type SortField = "name" | "grade" | "ist";
type SortDirection = "asc" | "desc";

export default function ElpacProgressPage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [istFilter, setIstFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Compute stats
  const stats = useMemo(() => {
    const total = elpacStudents.length;
    const assigned = elpacStudents.filter((s) => s.ist).length;
    const unassigned = total - assigned;
    const byGrade: Record<number, { total: number; assigned: number }> = {};
    const istProctors = new Set<string>();

    for (const s of elpacStudents) {
      if (!byGrade[s.grade]) byGrade[s.grade] = { total: 0, assigned: 0 };
      byGrade[s.grade].total++;
      if (s.ist) {
        byGrade[s.grade].assigned++;
        istProctors.add(s.ist);
      }
    }

    return { total, assigned, unassigned, byGrade, istProctors: Array.from(istProctors).sort() };
  }, []);

  // Filter & sort
  const filteredAndSorted = useMemo(() => {
    let result = [...elpacStudents];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.ssid.includes(q) ||
          s.localId.includes(q)
      );
    }

    if (gradeFilter !== "all") {
      result = result.filter((s) => s.grade === parseInt(gradeFilter));
    }

    if (istFilter === "unassigned") {
      result = result.filter((s) => !s.ist);
    } else if (istFilter !== "all") {
      result = result.filter((s) => s.ist === istFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
          break;
        case "grade":
          comparison = a.grade - b.grade;
          break;
        case "ist":
          comparison = (a.ist || "zzz").localeCompare(b.ist || "zzz");
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [search, gradeFilter, istFilter, sortField, sortDirection]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function SortButton({ field, children }: { field: SortField; children: React.ReactNode }) {
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

  const pct = stats.total > 0 ? Math.round((stats.assigned / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="scaffold-heading">ELPAC Testing Progress</h1>
        <p className="scaffold-description mt-1">
          2025&ndash;26 Summative ELPAC &mdash; Student Assignment Tracker
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {/* Total Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <Users className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground mt-1">ELL students taking ELPAC</p>
          </CardContent>
        </Card>

        {/* Scheduling Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduling Progress</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <ClipboardCheck className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pct}%</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-2.5 rounded-full bg-eld-almond-silk/30 dark:bg-gray-700">
                <div
                  className="h-2.5 rounded-full bg-green-500 dark:bg-green-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{stats.assigned} assigned</span>
              <span>{stats.unassigned} unassigned</span>
            </div>
          </CardContent>
        </Card>

        {/* By Grade */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students by Grade</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <GraduationCap className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 6, 7, 8].map((grade) => {
                const g = stats.byGrade[grade] || { total: 0, assigned: 0 };
                return (
                  <div key={grade} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Grade {grade}</span>
                    <span className="font-medium">
                      {g.total}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({g.assigned} assigned)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SSID..."
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
          {[5, 6, 7, 8].map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </Select>
        <Select
          value={istFilter}
          onChange={(e) => setIstFilter(e.target.value)}
          className="w-44 flex-none"
        >
          <option value="all">All IST Status</option>
          <option value="unassigned">Unassigned</option>
          {stats.istProctors.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredAndSorted.length} student{filteredAndSorted.length !== 1 ? "s" : ""}
        {(search || gradeFilter !== "all" || istFilter !== "all") && " (filtered)"}
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
                SSID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="grade">Grade</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-eld-dusty-grape dark:text-gray-400">
                <SortButton field="ist">IST Assignment</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No students match your filters.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((student) => (
                <tr
                  key={student.ssid}
                  className="border-b hover:bg-eld-almond-silk/20 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {student.lastName}, {student.firstName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {student.ssid}
                  </td>
                  <td className="px-4 py-3 text-sm">{student.grade}</td>
                  <td className="px-4 py-3">
                    <IstBadge ist={student.ist} />
                  </td>
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
            No students match your filters.
          </div>
        ) : (
          filteredAndSorted.map((student) => (
            <div
              key={student.ssid}
              className="rounded-2xl border border-eld-almond-silk/40 bg-white p-4 space-y-2 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between">
                <span className="font-medium text-foreground">
                  {student.lastName}, {student.firstName}
                </span>
                <IstBadge ist={student.ist} />
              </div>
              <div className="text-sm text-muted-foreground">
                Grade {student.grade} &middot; SSID: {student.ssid}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function IstBadge({ ist }: { ist: string | null }) {
  if (ist) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        {ist}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      Unassigned
    </span>
  );
}
