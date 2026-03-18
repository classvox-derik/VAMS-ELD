"use client";

import { useMemo, useState } from "react";
import {
  Palette,
  Layers,
  Type,
  BookOpen,
  LayoutGrid,
  Languages,
  Image,
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
import type { ELLevel, ColorCodingOptions } from "@/types";
import { DEFAULT_COLOR_CODING_OPTIONS } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  color_coding: Palette,
  chunking: Layers,
  sentence_frames: Type,
  word_banks: BookOpen,
  visual_organizers: LayoutGrid,
  visual_aids: Image,
  bilingual_support: Languages,
};

const categoryLabels: Record<string, string> = {
  color_coding: "Color Coding",
  chunking: "Chunking",
  sentence_frames: "Sentence Frames",
  word_banks: "Word Banks",
  visual_organizers: "Visual Organizers",
  visual_aids: "Visual Aids",
  bilingual_support: "Bilingual Support",
};

const WORD_TYPE_LABELS: { key: keyof ColorCodingOptions["wordTypes"]; label: string; color: string }[] = [
  { key: "nouns", label: "Nouns", color: "#90CAF9" },
  { key: "verbs", label: "Verbs", color: "#AED581" },
  { key: "adjectives", label: "Adjectives", color: "#FFCC80" },
  { key: "vocabulary", label: "Vocabulary Words", color: "#FFF176" },
];

interface ScaffoldPickerProps {
  elLevel?: ELLevel;
  elLevels?: ELLevel[];
  selectedNames: Set<string>;
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  colorCodingOptions: ColorCodingOptions;
  onColorCodingOptionsChange: (options: ColorCodingOptions) => void;
}

export function ScaffoldPicker({
  elLevel,
  elLevels,
  selectedNames,
  onToggle,
  onSelectAll,
  onClearAll,
  colorCodingOptions,
  onColorCodingOptionsChange,
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

  const isColorCodingSelected = Array.from(selectedNames).some((name) => {
    const scaffold = defaultScaffolds.find((s) => s.name === name);
    return scaffold?.category === "color_coding";
  });

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
                  const isComingSoon = "comingSoon" in scaffold && scaffold.comingSoon;
                  const isColorCoding = scaffold.category === "color_coding";
                  return (
                    <div key={scaffold.name}>
                      <label
                        className={cn(
                          "flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3 transition-colors",
                          isComingSoon
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer",
                          !isComingSoon && isChecked
                            ? "border-eld-space-indigo bg-eld-space-indigo/5"
                            : !isComingSoon
                              ? "hover:bg-gray-50 dark:hover:bg-gray-800/30"
                              : "",
                          isColorCoding && isChecked ? "rounded-b-none border-b-0" : ""
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isComingSoon}
                          onChange={() => onToggle(scaffold.name)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-eld-space-indigo focus:ring-eld-space-indigo/20 dark:border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {scaffold.name}
                            </span>
                            {isComingSoon && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                                Coming soon
                              </span>
                            )}
                            {!isComingSoon && (
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
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {scaffold.description}
                          </p>
                        </div>
                      </label>

                      {/* Color Coding Sub-Options */}
                      {isColorCoding && isChecked && (
                        <div className="rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 p-3 pl-10 space-y-3">
                          {/* Mode Toggle */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Color coding style
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  onColorCodingOptionsChange({
                                    ...colorCodingOptions,
                                    mode: "parts_of_speech",
                                  })
                                }
                                className={cn(
                                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                                  colorCodingOptions.mode === "parts_of_speech"
                                    ? "border-eld-space-indigo bg-eld-space-indigo/10 text-eld-space-indigo dark:text-eld-lilac-ash font-medium"
                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                              >
                                Parts of Speech
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onColorCodingOptionsChange({
                                    ...colorCodingOptions,
                                    mode: "easier_to_read",
                                  })
                                }
                                className={cn(
                                  "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                                  colorCodingOptions.mode === "easier_to_read"
                                    ? "border-eld-space-indigo bg-eld-space-indigo/10 text-eld-space-indigo dark:text-eld-lilac-ash font-medium"
                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                              >
                                Easier to Read
                              </button>
                            </div>
                          </div>

                          {/* Word Type Checkboxes (parts_of_speech mode only) */}
                          {colorCodingOptions.mode === "parts_of_speech" && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Which word types to highlight
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {WORD_TYPE_LABELS.map(({ key, label, color }) => {
                                  const checked = colorCodingOptions.wordTypes[key];
                                  return (
                                    <label
                                      key={key}
                                      className={cn(
                                        "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors",
                                        checked
                                          ? "border-gray-300 dark:border-gray-600"
                                          : "border-gray-200 dark:border-gray-700 opacity-50"
                                      )}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => {
                                          const next = {
                                            ...colorCodingOptions,
                                            wordTypes: {
                                              ...colorCodingOptions.wordTypes,
                                              [key]: !checked,
                                            },
                                          };
                                          // Prevent unchecking all — at least one must remain
                                          const anyChecked = Object.values(next.wordTypes).some(Boolean);
                                          if (anyChecked) {
                                            onColorCodingOptionsChange(next);
                                          }
                                        }}
                                        className="h-3 w-3 rounded border-gray-300 text-eld-space-indigo focus:ring-eld-space-indigo/20 dark:border-gray-600"
                                      />
                                      <span
                                        className="inline-block w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: color }}
                                      />
                                      <span>{label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Easier to Read description */}
                          {colorCodingOptions.mode === "easier_to_read" && (
                            <p className="text-xs text-muted-foreground">
                              Highlights main ideas in yellow, supporting evidence in green, and transition words in blue to help students navigate the text.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
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
