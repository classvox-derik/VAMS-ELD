"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TextInputTabProps {
  content: string;
  onChange: (content: string) => void;
}

const MAX_CHARS = 50000;

export function TextInputTab({ content, onChange }: TextInputTabProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your assignment here... Include all instructions, questions, and reading passages."
          rows={14}
          maxLength={MAX_CHARS}
          className="resize-y min-h-[280px]"
        />
        {content.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={() => onChange("")}
            aria-label="Clear text"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {content.length < 50 && content.length > 0
            ? `${50 - content.length} more characters needed`
            : "\u00A0"}
        </span>
        <span
          className={
            content.length > MAX_CHARS * 0.9
              ? "text-warning"
              : ""
          }
        >
          {content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
