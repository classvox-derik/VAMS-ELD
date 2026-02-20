import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Zap, FileText, PenSquare } from "lucide-react";
import { EL_LEVELS } from "@/types";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scaffold-heading">Welcome back!</h1>
        <p className="scaffold-description mt-1">
          Here&apos;s an overview of your ELD scaffolding workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
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
            <div className="space-y-2">
              {EL_LEVELS.map((level) => (
                <div
                  key={level}
                  className="flex items-center justify-between text-sm"
                >
                  <span
                    className={`scaffold-badge el-${level.toLowerCase()}`}
                  >
                    {level}
                  </span>
                  <span className="font-medium">0</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s AI Usage
            </CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <Zap className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-title-sm font-bold text-foreground">0</div>
            <p className="text-theme-xs text-muted-foreground">of 1,000 daily limit</p>
            <div className="mt-3 h-2 rounded-full bg-eld-almond-silk/30 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-eld-space-indigo transition-all dark:bg-eld-dusty-grape"
                style={{ width: "0%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Assignments
            </CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
              <FileText className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No assignments yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first scaffolded assignment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/create">
            <PenSquare className="h-4 w-4" />
            Create Your First Assignment
          </Link>
        </Button>
      </div>
    </div>
  );
}
