"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageCounterProps {
  used: number;
  limit: number;
  className?: string;
  isCollapsed?: boolean;
}

export function UsageCounter({
  used = 0,
  limit = 1000,
  className,
  isCollapsed = false,
}: UsageCounterProps) {
  const remaining = limit - used;
  const isWarning = remaining <= 100 && remaining > 0;
  const isExhausted = remaining <= 0;
  const percentage = Math.min((used / limit) * 100, 100);

  if (isCollapsed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          className
        )}
        title={`${used} / ${limit.toLocaleString()} AI generations used`}
      >
        <div
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-lg",
            isExhausted
              ? "bg-red-500/20 text-red-400"
              : isWarning
              ? "bg-amber-500/20 text-amber-400"
              : "bg-eld-dusty-grape/30 text-eld-space-indigo dark:text-eld-lilac-ash"
          )}
        >
          <Zap className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl p-3",
        isExhausted
          ? "bg-red-500/10"
          : isWarning
          ? "bg-amber-500/10"
          : "bg-eld-dusty-grape/20",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap
          className={cn(
            "h-4 w-4",
            isExhausted
              ? "text-red-400"
              : isWarning
              ? "text-amber-400"
              : "text-eld-space-indigo dark:text-eld-lilac-ash"
          )}
        />
        <span className="text-theme-xs font-medium text-eld-space-indigo dark:text-eld-seashell/80">
          {used} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-eld-dusty-grape/30">
        <div
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            isExhausted
              ? "bg-red-400"
              : isWarning
              ? "bg-amber-400"
              : "bg-eld-space-indigo dark:bg-eld-lilac-ash"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
