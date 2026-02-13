import { cn } from "@/lib/utils";
import type { ELLevel } from "@/types";

const levelStyles: Record<ELLevel, string> = {
  Emerging: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Expanding: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Bridging: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

interface ELBadgeProps {
  level: ELLevel;
  className?: string;
}

export function ELBadge({ level, className }: ELBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        levelStyles[level],
        className
      )}
    >
      {level}
    </span>
  );
}
