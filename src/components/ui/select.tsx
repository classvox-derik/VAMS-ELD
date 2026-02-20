import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-11 w-full rounded-lg border border-eld-almond-silk/60 bg-white px-4 py-2.5 text-sm text-eld-space-indigo shadow-theme-xs transition-colors duration-200 focus:border-eld-space-indigo focus:outline-none focus:ring-3 focus:ring-eld-space-indigo/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-eld-dusty-grape dark:focus:ring-eld-dusty-grape/20",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
