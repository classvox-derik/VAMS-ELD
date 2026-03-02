import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, PenSquare, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import type { ELLevel } from "@/types";
import { DashboardGreeting } from "@/components/dashboard/greeting";
import { AIUsageCard } from "@/components/dashboard/ai-usage-card";
import { UpdatesCard } from "@/components/dashboard/updates-card";

const levelStyles: Record<ELLevel, string> = {
  Emerging: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Expanding: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Bridging: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const levelBarColors: Record<ELLevel, string> = {
  Emerging: "bg-red-400 dark:bg-red-500",
  Expanding: "bg-orange-400 dark:bg-orange-500",
  Bridging: "bg-green-400 dark:bg-green-500",
};

async function getStudentStats() {
  const supabase = createClient();
  const { data: students } = await supabase
    .from("students")
    .select("grade, el_level, homeroom");

  if (!students || students.length === 0) {
    return {
      total: 0,
      byLevel: { Emerging: 0, Expanding: 0, Bridging: 0 } as Record<ELLevel, number>,
      byGrade: {} as Record<number, number>,
      byHomeroom: {} as Record<string, number>,
    };
  }

  const byLevel: Record<ELLevel, number> = { Emerging: 0, Expanding: 0, Bridging: 0 };
  const byGrade: Record<number, number> = {};
  const byHomeroom: Record<string, number> = {};

  for (const s of students) {
    if (s.el_level in byLevel) {
      byLevel[s.el_level as ELLevel]++;
    }
    byGrade[s.grade] = (byGrade[s.grade] || 0) + 1;
    if (s.homeroom) {
      byHomeroom[s.homeroom] = (byHomeroom[s.homeroom] || 0) + 1;
    }
  }

  return {
    total: students.length,
    byLevel,
    byGrade,
    byHomeroom,
  };
}

export default async function DashboardPage() {
  const stats = await getStudentStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="scaffold-heading"><DashboardGreeting /></h1>
        <p className="scaffold-description mt-1">
          Here&apos;s an overview of your ELD scaffolding workspace.
        </p>
      </div>

      {/* Total students banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-eld-almond-silk/40 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
          <Users className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total ELD Students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {/* Students by EL Level */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students by EL Level
            </CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <Users className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(["Emerging", "Expanding", "Bridging"] as ELLevel[]).map((level) => {
                const count = stats.byLevel[level];
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={level} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelStyles[level]}`}
                      >
                        {level}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-eld-almond-silk/30 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full transition-all ${levelBarColors[level]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Students by Grade */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students by Grade
            </CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <GraduationCap className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 6, 7, 8].map((grade) => {
                const count = stats.byGrade[grade] || 0;
                return (
                  <div
                    key={grade}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">Grade {grade}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Students by Homeroom */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students by Homeroom
            </CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <FileText className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byHomeroom)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([homeroom, count]) => (
                  <div
                    key={homeroom}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{homeroom}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Usage + Quick Action */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <AIUsageCard />

        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <PenSquare className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Ready to scaffold?</p>
          <p className="text-xs text-muted-foreground mb-4">
            Create differentiated assignments for your {stats.total} students
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/create">
              <PenSquare className="h-4 w-4" />
              Create Assignment
            </Link>
          </Button>
        </Card>
      </div>

      {/* What's New */}
      <UpdatesCard />
    </div>
  );
}
