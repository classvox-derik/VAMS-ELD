/**
 * Google Docs Scaffolder
 *
 * Applies structured scaffold actions (highlights, insertions, appended sections)
 * directly to a cloned Google Doc, preserving the original document formatting.
 */

import { google, type docs_v1 } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import type { ScaffoldAction } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParagraphLocation {
  text: string;
  startIndex: number;
  endIndex: number;
}

interface ResolvedHighlight {
  type: "highlight";
  startIndex: number;
  endIndex: number;
  color: RGBColor;
}

interface ResolvedInsertion {
  type: "insertion";
  insertAtIndex: number;
  text: string;
  style?: TextStyleSpec;
  isParagraphHeading?: boolean;
}

interface TextStyleSpec {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  textColor?: RGBColor;
  backgroundColor?: RGBColor;
}

interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

type ResolvedAction = ResolvedHighlight | ResolvedInsertion;

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): RGBColor {
  const h = hex.replace("#", "");
  const full = h.length === 3
    ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    : h;
  return {
    red: parseInt(full.slice(0, 2), 16) / 255,
    green: parseInt(full.slice(2, 4), 16) / 255,
    blue: parseInt(full.slice(4, 6), 16) / 255,
  };
}

// Brand colors for scaffold sections
const BRAND_BLUE: RGBColor = { red: 0.118, green: 0.251, blue: 0.686 };
const SUBTLE_GRAY: RGBColor = { red: 0.4, green: 0.4, blue: 0.4 };
const DIVIDER_GRAY: RGBColor = { red: 0.75, green: 0.75, blue: 0.75 };

// ---------------------------------------------------------------------------
// Document structure helpers
// ---------------------------------------------------------------------------

/**
 * Extract all paragraphs with their text and index positions from a Google Doc.
 * Handles nested content inside table cells recursively.
 */
function buildParagraphMap(
  content: docs_v1.Schema$StructuralElement[]
): ParagraphLocation[] {
  const paragraphs: ParagraphLocation[] = [];

  for (const element of content) {
    if (element.paragraph) {
      let text = "";
      for (const el of element.paragraph.elements ?? []) {
        if (el.textRun?.content) {
          text += el.textRun.content;
        }
      }
      paragraphs.push({
        text: text.replace(/\n$/, ""), // Strip trailing newline
        startIndex: element.startIndex ?? 0,
        endIndex: element.endIndex ?? 0,
      });
    }

    if (element.table) {
      for (const row of element.table.tableRows ?? []) {
        for (const cell of row.tableCells ?? []) {
          if (cell.content) {
            paragraphs.push(...buildParagraphMap(cell.content));
          }
        }
      }
    }

    if (element.tableOfContents?.content) {
      paragraphs.push(...buildParagraphMap(element.tableOfContents.content));
    }
  }

  return paragraphs;
}

// ---------------------------------------------------------------------------
// Action resolution
// ---------------------------------------------------------------------------

/**
 * Find exact text in the document paragraphs and return index ranges.
 * Falls back to normalized whitespace matching, then case-insensitive.
 */
function resolveHighlight(
  action: ScaffoldAction,
  paragraphs: ParagraphLocation[]
): ResolvedHighlight[] {
  if (!action.search_text || !action.background_color) return [];

  const searchText = action.search_text;
  const color = hexToRgb(action.background_color);
  const results: ResolvedHighlight[] = [];

  // Try exact match first
  for (const para of paragraphs) {
    const idx = para.text.indexOf(searchText);
    if (idx !== -1) {
      results.push({
        type: "highlight",
        startIndex: para.startIndex + idx,
        endIndex: para.startIndex + idx + searchText.length,
        color,
      });
      return results; // Found exact match
    }
  }

  // Fuzzy fallback: normalize whitespace
  const normalizedSearch = searchText.replace(/\s+/g, " ").trim();
  for (const para of paragraphs) {
    const normalizedPara = para.text.replace(/\s+/g, " ");
    const idx = normalizedPara.indexOf(normalizedSearch);
    if (idx !== -1) {
      // Map back to original indices (approximate)
      results.push({
        type: "highlight",
        startIndex: para.startIndex + idx,
        endIndex: para.startIndex + idx + normalizedSearch.length,
        color,
      });
      return results;
    }
  }

  // Last resort: case-insensitive
  const lowerSearch = normalizedSearch.toLowerCase();
  for (const para of paragraphs) {
    const lowerPara = para.text.replace(/\s+/g, " ").toLowerCase();
    const idx = lowerPara.indexOf(lowerSearch);
    if (idx !== -1) {
      results.push({
        type: "highlight",
        startIndex: para.startIndex + idx,
        endIndex: para.startIndex + idx + lowerSearch.length,
        color,
      });
      return results;
    }
  }

  console.warn(`[Scaffolder] Could not find text to highlight: "${searchText.slice(0, 60)}..."`);
  return [];
}

/**
 * Find the paragraph that matches the given prefix and return its end index.
 */
function resolveInsertionPoint(
  paragraphPrefix: string,
  paragraphs: ParagraphLocation[]
): number | null {
  // Exact prefix match
  for (const para of paragraphs) {
    if (para.text.startsWith(paragraphPrefix)) {
      return para.endIndex;
    }
  }

  // Normalized whitespace match
  const normalized = paragraphPrefix.replace(/\s+/g, " ").trim();
  for (const para of paragraphs) {
    const normalizedPara = para.text.replace(/\s+/g, " ").trim();
    if (normalizedPara.startsWith(normalized)) {
      return para.endIndex;
    }
  }

  // Trimmed prefix match (handle leading whitespace differences)
  for (const para of paragraphs) {
    if (para.text.trimStart().startsWith(paragraphPrefix.trimStart())) {
      return para.endIndex;
    }
  }

  console.warn(`[Scaffolder] Could not find paragraph with prefix: "${paragraphPrefix.slice(0, 60)}..."`);
  return null;
}

/**
 * Resolve all scaffold actions into concrete index positions.
 */
function resolveAllActions(
  actions: ScaffoldAction[],
  paragraphs: ParagraphLocation[],
  docEndIndex: number
): ResolvedAction[] {
  const resolved: ResolvedAction[] = [];

  for (const action of actions) {
    switch (action.action_type) {
      case "highlight_range": {
        const highlights = resolveHighlight(action, paragraphs);
        resolved.push(...highlights);
        break;
      }

      case "insert_after_paragraph": {
        if (!action.paragraph_prefix) break;
        const insertAt = resolveInsertionPoint(action.paragraph_prefix, paragraphs);
        if (insertAt === null) break;

        const text = action.insert_content || "";
        if (!text) break;

        const style: TextStyleSpec = {};
        if (action.style_italic) style.italic = true;
        if (action.style_bold) style.bold = true;
        if (action.style_font_size_pt) style.fontSize = action.style_font_size_pt;
        if (action.style_text_color) style.textColor = hexToRgb(action.style_text_color);

        resolved.push({
          type: "insertion",
          insertAtIndex: insertAt,
          text,
          style: Object.keys(style).length > 0 ? style : undefined,
        });
        break;
      }

      case "insert_divider_after_paragraph": {
        if (!action.paragraph_prefix) break;
        const insertAt = resolveInsertionPoint(action.paragraph_prefix, paragraphs);
        if (insertAt === null) break;

        const dividerLine = "\u2501".repeat(40);
        const dividerText = action.label
          ? `\n${dividerLine}\n${action.label}\n`
          : `\n${dividerLine}\n`;

        resolved.push({
          type: "insertion",
          insertAtIndex: insertAt,
          text: dividerText,
          style: { textColor: DIVIDER_GRAY, fontSize: 8 },
        });

        // If there's a label, add a second styled insertion for the label text
        if (action.label) {
          resolved.push({
            type: "insertion",
            insertAtIndex: insertAt,
            text: "", // Handled as part of the divider text above
            style: { bold: true, textColor: BRAND_BLUE, fontSize: 11 },
            isParagraphHeading: true,
          });
        }
        break;
      }

      case "append_section": {
        // Append sections go at the end of the document
        const heading = action.heading || "Scaffold Section";

        let sectionText = `\n\n${"━".repeat(40)}\n${heading}\n\n`;

        if (action.items && action.items.length > 0) {
          // Word bank format
          for (const item of action.items) {
            sectionText += `${item.term}  —  ${item.definition}\n`;
          }
        } else if (action.content) {
          sectionText += action.content + "\n";
        }

        resolved.push({
          type: "insertion",
          insertAtIndex: docEndIndex,
          text: sectionText,
          style: undefined, // Will be styled per-segment below
        });
        break;
      }
    }
  }

  return resolved;
}

// ---------------------------------------------------------------------------
// Build Google Docs batchUpdate requests
// ---------------------------------------------------------------------------

function buildBatchRequests(
  resolved: ResolvedAction[]
): docs_v1.Schema$Request[] {
  const requests: docs_v1.Schema$Request[] = [];

  // 1. Highlights — these don't shift indices, apply first
  const highlights = resolved.filter((a): a is ResolvedHighlight => a.type === "highlight");
  for (const h of highlights) {
    if (h.endIndex <= h.startIndex) continue;
    requests.push({
      updateTextStyle: {
        range: { startIndex: h.startIndex, endIndex: h.endIndex },
        textStyle: {
          backgroundColor: { color: { rgbColor: h.color } },
        },
        fields: "backgroundColor",
      },
    });
  }

  // 2. Insertions — SORTED BY INDEX DESCENDING to avoid index shifting
  const insertions = resolved
    .filter((a): a is ResolvedInsertion => a.type === "insertion")
    .filter((a) => a.text.length > 0)
    .sort((a, b) => b.insertAtIndex - a.insertAtIndex);

  for (const ins of insertions) {
    // Insert the text
    requests.push({
      insertText: {
        location: { index: ins.insertAtIndex },
        text: ins.text,
      },
    });

    // Apply styling to the inserted text
    if (ins.style) {
      const textStart = ins.insertAtIndex;
      const textEnd = textStart + ins.text.length;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ts: Record<string, any> = {};
      const fields: string[] = [];

      if (ins.style.bold) {
        ts.bold = true;
        fields.push("bold");
      }
      if (ins.style.italic) {
        ts.italic = true;
        fields.push("italic");
      }
      if (ins.style.fontSize) {
        ts.fontSize = { magnitude: ins.style.fontSize, unit: "PT" };
        fields.push("fontSize");
      }
      if (ins.style.textColor) {
        ts.foregroundColor = { color: { rgbColor: ins.style.textColor } };
        fields.push("foregroundColor");
      }
      if (ins.style.backgroundColor) {
        ts.backgroundColor = { color: { rgbColor: ins.style.backgroundColor } };
        fields.push("backgroundColor");
      }

      if (fields.length > 0 && textEnd > textStart) {
        requests.push({
          updateTextStyle: {
            range: { startIndex: textStart, endIndex: textEnd },
            textStyle: ts,
            fields: fields.join(","),
          },
        });
      }
    }
  }

  return requests;
}

// ---------------------------------------------------------------------------
// Main export function
// ---------------------------------------------------------------------------

/**
 * Apply scaffold modifications to a cloned Google Doc.
 *
 * @param auth - Authenticated OAuth2 client
 * @param clonedDocId - ID of the cloned document to modify
 * @param scaffoldActions - Structured scaffold actions from Gemini
 * @param elLevel - EL level for context in appended sections
 * @returns Stats about the operation
 */
export async function applyScaffoldsToClonedDoc(
  auth: OAuth2Client,
  clonedDocId: string,
  scaffoldActions: ScaffoldAction[],
  elLevel: string
): Promise<{ applied: number; skipped: number }> {
  const docs = google.docs({ version: "v1", auth });

  // 1. Read the cloned document structure
  const doc = await docs.documents.get({ documentId: clonedDocId });
  const document = doc.data;

  if (!document.body?.content) {
    console.warn("[Scaffolder] Document body is empty");
    return { applied: 0, skipped: 0 };
  }

  // 2. Build paragraph index map
  const paragraphs = buildParagraphMap(document.body.content);
  const lastElement = document.body.content[document.body.content.length - 1];
  const docEndIndex = lastElement?.endIndex ?? 1;

  // 3. Resolve all actions to concrete index positions
  const resolvedActions = resolveAllActions(scaffoldActions, paragraphs, docEndIndex);

  const totalActions = scaffoldActions.length;
  const resolvedCount = resolvedActions.length;

  console.log(
    `[Scaffolder] Resolved ${resolvedCount} modifications from ${totalActions} actions for doc ${clonedDocId} (${elLevel})`
  );

  if (resolvedActions.length === 0) {
    return { applied: 0, skipped: totalActions };
  }

  // 4. Build and execute batchUpdate
  const requests = buildBatchRequests(resolvedActions);

  if (requests.length > 0) {
    await docs.documents.batchUpdate({
      documentId: clonedDocId,
      requestBody: { requests },
    });
  }

  return {
    applied: resolvedCount,
    skipped: totalActions - resolvedCount,
  };
}
