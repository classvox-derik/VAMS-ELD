"use client";

import { Link2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GoogleLinkTabProps {
  content: string;
  onChange: (content: string) => void;
}

export function GoogleLinkTab({ content, onChange }: GoogleLinkTabProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Link2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Google Docs Integration
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Google Docs import will be available after you connect your Google account
          in settings. For now, please use the &quot;Type or Paste&quot; tab or
          &quot;Upload File&quot; tab.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span>Coming in a future update</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Or paste a Google Doc URL to fetch later:
        </p>
        <Input
          placeholder="https://docs.google.com/document/d/..."
          value={content}
          onChange={(e) => onChange(e.target.value)}
          disabled
        />
      </div>
    </div>
  );
}
