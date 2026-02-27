"use client";

import { Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsage } from "@/lib/hooks/use-usage";

export function AIUsageCard() {
  const { used, limit } = useUsage();
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  return (
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
        <div className="text-title-sm font-bold text-foreground">{used}</div>
        <p className="text-theme-xs text-muted-foreground">
          of {limit} daily limit
        </p>
        <div className="mt-3 h-2 rounded-full bg-eld-almond-silk/30 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-eld-space-indigo transition-all dark:bg-eld-dusty-grape"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
