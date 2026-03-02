"use client";

import { CalendarDays } from "lucide-react";

export default function ElpacSchedulePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="scaffold-heading flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-eld-dusty-grape dark:text-eld-almond-silk" />
          ELPAC Test Schedule
        </h1>
        <p className="scaffold-description mt-1">
          View the current ELPAC testing schedule and progress.
        </p>
      </div>

      {/* Embedded Google Sheet */}
      <div className="rounded-xl border border-eld-almond-silk/40 bg-white shadow-theme-sm overflow-hidden dark:border-gray-700 dark:bg-gray-900">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1xAU59X_QSkAEmIB86t_kyuG0tQb-mJlH6pK80gpMzY0/preview"
          className="w-full border-0"
          style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}
          title="ELPAC Test Schedule"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
