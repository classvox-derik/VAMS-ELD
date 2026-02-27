"use client";

import { useState, useEffect, useCallback } from "react";

interface UsageData {
  used: number;
  limit: number;
  globalUsed: number;
  globalLimit: number;
}

const DEFAULT_USAGE: UsageData = { used: 0, limit: 10, globalUsed: 0, globalLimit: 250 };

/**
 * Fetches current AI usage from /api/usage.
 * Polls every 60 seconds and exposes a manual refresh function.
 */
export function useUsage() {
  const [usage, setUsage] = useState<UsageData>(DEFAULT_USAGE);

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

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [refresh]);

  return { ...usage, refresh };
}
