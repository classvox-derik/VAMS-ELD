"use client";

import { useMemo, useState } from "react";
import {
  Palette,
  Layers,
  Type,
  BookOpen,
  LayoutGrid,
  Languages,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ELBadge } from "@/components/students/el-badge";
import { cn } from "@/lib/utils";
import { defaultScaffolds } from "@/lib/seed-scaffolds";
import type { ELLevel } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  color_coding: Palette,
  chunking: Layers,
  sentence_frames: Type,
  word_banks: BookOpen,
  visual_organizers: LayoutGrid,
  bilingual_support: Languages,
};

const categoryLabels: Record<string, string> = {
  color_coding: "Color Coding",
  chunking: "Chunking",
  sentence_frames: "Sentence Frames",
  word_banks: "Word Banks",
  visual_organizers: "Visual Organizers",
  bilingual_support: "Bilingual Support",
};

interface ScaffoldPickerProps {
  elLevel?: ELLevel;
  elLevels?: ELLevel[];
  selectedNames: Set<string>;
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function ScaffoldPicker({
  elLevel,
  elLevels,
  selectedNames,
  onToggle,
  onSelectAll,
  onClearAll,
}: ScaffoldPickerProps) {
  const [detailName, setDetailName] = useState<string | null>(null);

  const levels = elLevels ?? (elLevel ? [elLevel] : []);

  const filteredScaffolds = useMemo(
    () => defaultScaffolds.filter((s) => levels.some((l) => s.el_level_target.includes(l))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levels.join(",")]
  );

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredScaffolds>();
    filteredScaffolds.forEach((s) => {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    });
    return map;
  }, [filteredScaffolds]);

  const detailScaffold = detailName
    ? defaultScaffolds.find((s) => s.name === detailName) ?? null
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Which scaffolds would you like to apply?
        </label>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing scaffolds recommended for{" "}
        <strong>{levels.join(", ")}</strong> level{levels.length !== 1 ? "s" : ""}.
        {selectedNames.size === 0 && " Select at least one scaffold."}
      </p>

      <div className="space-y-4">
        {Array.from(grouped.entries()).map(([category, scaffolds]) => {
          const Icon = categoryIcons[category] || BookOpen;
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-eld-lilac-ash" />
                <span className="text-sm font-medium text-muted-foreground">
                  {categoryLabels[category] || category}
                </span>
              </div>
              <div className="space-y-2">
                {scaffolds.map((scaffold) => {
                  const isChecked = selectedNames.has(scaffold.name);
                  return (
                    <label
                      key={scaffold.name}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3 cursor-pointer transition-colors",
                        isChecked
                          ? "border-eld-space-indigo bg-eld-space-indigo/5"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(scaffold.name)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-eld-space-indigo focus:ring-eld-space-indigo/20 dark:border-gray-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {scaffold.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setDetailName(scaffold.name);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Details for ${scaffold.name}`}
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {scaffold.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scaffold Detail Modal */}
      <Dialog
        open={detailName !== null}
        onOpenChange={(open) => {
          if (!open) setDetailName(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {detailScaffold && (
            <>
              <DialogHeader>
                <DialogTitle>{detailScaffold.name}</DialogTitle>
                <DialogDescription>
                  {categoryLabels[detailScaffold.category] ||
                    detailScaffold.category}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {detailScaffold.description}
                </p>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Target EL Levels
                  </p>
                  <div className="flex gap-1">
                    {detailScaffold.el_level_target.map((level) => (
                      <ELBadge
                        key={level}
                        level={level as ELLevel}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant={
                      detailName !== null && selectedNames.has(detailName)
                        ? "outline"
                        : "default"
                    }
                    size="sm"
                    onClick={() => {
                      if (detailName !== null) {
                        onToggle(detailName);
                      }
                    }}
                  >
                    {detailName !== null && selectedNames.has(detailName)
                      ? "Remove from Selection"
                      : "Add to Selection"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
