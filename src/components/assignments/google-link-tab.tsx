"use client";

import { useState, useEffect } from "react";
import { Link2, Loader2, CheckCircle2, AlertCircle, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GoogleLinkTabProps {
  content: string;
  onChange: (content: string) => void;
}

export function GoogleLinkTab({ content, onChange }: GoogleLinkTabProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [imported, setImported] = useState(false);

  // Check Google connection status
  const [connected, setConnected] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/google-auth/status")
      .then((res) => res.json())
      .then((data) => setConnected(data.connected ?? false))
      .catch(() => setConnected(false));
  }, []);

  const handleImport = async () => {
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    setImported(false);

    try {
      const res = await fetch("/api/google-docs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? data.error ?? "Failed to import document.");
        return;
      }

      onChange(data.content);
      setDocTitle(data.title);
      setImported(true);
    } catch {
      setError("Failed to fetch document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Still loading connection status
  if (connected === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not connected — prompt to connect in Settings
  if (!connected) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
          <Link2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Connect Google Account
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Connect your Google account in Settings to import assignments
          directly from Google Docs.
        </p>
        <Link href="/settings">
          <Button variant="outline" className="mt-4 gap-2">
            <Settings className="h-4 w-4" />
            Go to Settings
          </Button>
        </Link>
      </div>
    );
  }

  // Connected — show import UI
  return (
    <div className="space-y-4">
      {/* Success state */}
      {imported && docTitle && (
        <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Imported <strong>{docTitle}</strong> successfully. The content is
            ready — proceed to the next step.
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* URL input + fetch button */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Google Docs URL
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="https://docs.google.com/document/d/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
              if (imported) setImported(false);
            }}
          />
          <Button
            onClick={handleImport}
            disabled={!url.trim() || loading}
            className="shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Import"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste the URL of any Google Doc your account has access to. The text
          content will be extracted for scaffolding.
        </p>
      </div>

      {/* Preview of imported content */}
      {content && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Imported Content
          </label>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-800/30">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
