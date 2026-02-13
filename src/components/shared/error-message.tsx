"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  retry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-destructive" />
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {retry && (
        <Button onClick={retry} variant="outline" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}
