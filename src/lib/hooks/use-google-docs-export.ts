"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface GoogleStatus {
  configured: boolean;
  connected: boolean;
  email: string | null;
}

interface ExportParams {
  title: string;
  outputHtml: string;
  elLevel: string;
  scaffoldsApplied: string[];
  wordBank?: { term: string; definition: string }[] | null;
  teacherInstructions?: string | null;
}

export function useGoogleDocsExport() {
  const [status, setStatus] = useState<GoogleStatus>({
    configured: false,
    connected: false,
    email: null,
  });
  const [isChecking, setIsChecking] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/google-auth/status");
        const data = await res.json();
        setStatus(data);
      } catch {
        // Leave as disconnected
      } finally {
        setIsChecking(false);
      }
    }
    check();
  }, []);

  const exportToGoogleDocs = useCallback(
    async (params: ExportParams): Promise<string | null> => {
      if (!status.connected) {
        toast.error("Connect your Google account in Settings first.");
        return null;
      }

      setIsExporting(true);
      try {
        const res = await fetch("/api/google-docs/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || "Export failed");
        }

        toast.success("Exported to Google Docs!", {
          action: {
            label: "Open",
            onClick: () => window.open(data.docUrl, "_blank"),
          },
        });

        return data.docUrl;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Export failed";
        toast.error(message);
        return null;
      } finally {
        setIsExporting(false);
      }
    },
    [status.connected]
  );

  return {
    isGoogleConnected: status.connected,
    isGoogleConfigured: status.configured,
    isChecking,
    isExporting,
    googleEmail: status.email,
    exportToGoogleDocs,
  };
}
