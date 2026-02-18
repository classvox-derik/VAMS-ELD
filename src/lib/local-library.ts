import type { ELLevel } from "@/types";

const STORAGE_KEY = "vams-scaffold-library";
const MAX_ENTRIES = 50;

export interface LibraryEntry {
  id: string;
  assignmentTitle: string;
  elLevel: ELLevel;
  studentName: string;
  scaffoldsApplied: string[];
  outputHtml: string;
  originalContent: string;
  isDemo: boolean;
  teacherNotes: string;
  createdAt: string;
}

function readStore(): LibraryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LibraryEntry[];
  } catch {
    return [];
  }
}

function writeStore(entries: LibraryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveToLibrary(entry: LibraryEntry): void {
  const entries = readStore();
  entries.unshift(entry);
  // Trim to max entries
  if (entries.length > MAX_ENTRIES) {
    entries.length = MAX_ENTRIES;
  }
  writeStore(entries);
}

export function getLibrary(): LibraryEntry[] {
  return readStore();
}

export function getLibraryEntry(id: string): LibraryEntry | null {
  const entries = readStore();
  return entries.find((e) => e.id === id) ?? null;
}

export function deleteFromLibrary(id: string): void {
  const entries = readStore().filter((e) => e.id !== id);
  writeStore(entries);
}

export function updateTeacherNotes(id: string, notes: string): void {
  const entries = readStore();
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    entry.teacherNotes = notes;
    writeStore(entries);
  }
}
