"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface UsageData {
  used: number;
  limit: number;
  globalUsed: number;
  globalLimit: number;
}

const DEFAULT_USAGE: UsageData = { used: 0, limit: 10, globalUsed: 0, globalLimit: 250 };

/**
 * Fetches current AI usage from /api/usage.
 * Refreshes on route changes and polls every 60 seconds.
 * Exposes a manual refresh function.
 */
export function useUsage() {
  const [usage, setUsage] = useState<UsageData>(DEFAULT_USAGE);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      if (res.ok) {
        setUsage(await res.json());
      }
    } catch {
      // Silently ignore — keep previous state
    }
  }, []);

  // Refresh on mount, on route change, and poll every 60s
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [refresh, pathname]);

  return { ...usage, refresh };
}
