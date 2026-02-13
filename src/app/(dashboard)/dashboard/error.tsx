"use client";

import { useEffect } from "react";
import { ErrorMessage } from "@/components/shared/error-message";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <ErrorMessage
        title="Dashboard Error"
        message="Failed to load the dashboard. This might be due to a connection issue."
        retry={reset}
      />
    </div>
  );
}
