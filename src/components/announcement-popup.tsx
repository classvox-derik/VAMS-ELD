"use client";

import { useState, useEffect } from "react";
import { FileUp, FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "vams-announcement-v1.7.2-dismissed";

export function AnnouncementPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            PDF Import & Export — Now Fixed
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-2 text-sm text-muted-foreground">
              <p>
                We resolved issues that were causing PDF uploads and downloads to fail for some users. Here&apos;s what changed:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <FileUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span>
                    <strong className="text-foreground">PDF uploads</strong> now work reliably — a memory issue that caused repeated imports to fail has been fixed.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FileDown className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong className="text-foreground">PDF downloads</strong> are now guaranteed across all environments — the underlying library has been stabilized.
                  </span>
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-1">
          <Button onClick={dismiss} className="w-full sm:w-auto">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
