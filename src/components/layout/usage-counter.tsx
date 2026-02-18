"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageCounterProps {
  used: number;
  limit: number;
  className?: string;
}

export function UsageCounter({
  used = 0,
  limit = 1000,
  className,
}: UsageCounterProps) {
  const remaining = limit - used;
  const isWarning = remaining <= 100 && remaining > 0;
  const isExhausted = remaining <= 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        isExhausted
          ? "bg-destructive/10 text-destructive"
          : isWarning
          ? "bg-warning/10 text-warning-700"
          : "text-muted-foreground",
        className
      )}
    >
      <Zap className="h-3 w-3" />
      <span>
        {used} / {limit.toLocaleString()}
      </span>
    </div>
  );
}
