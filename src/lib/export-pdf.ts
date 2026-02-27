import { jsPDF } from "jspdf";
import {
  parseHtmlToBlocks,
  buildWordBankBlocks,
  buildTeacherInstructionsBlocks,
} from "./html-to-google-docs";

export interface ScaffoldPdfOptions {
  html: string;
  title: string;
  elLevel?: string;
  wordBank?: { term: string; definition: string }[];
  teacherInstructions?: string;
  filename: string;
}

// ---------------------------------------------------------------------------
// Page geometry (US Letter, points)
// ---------------------------------------------------------------------------

const PAGE_H = 792;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 54;
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const CONTENT_W = 612 - MARGIN_LEFT - MARGIN_RIGHT; // 504 pt

// ---------------------------------------------------------------------------
// Font sizing
// ---------------------------------------------------------------------------

const FONT_SIZE: Record<string, number> = {
  heading1: 18,
  heading2: 14,
  heading3: 12,
  heading4: 11,
  paragraph: 11,
  "list-bullet": 11,
  "list-number": 11,
};

const LINE_HEIGHT_FACTOR = 1.55;

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------

interface RGB {
  red: number;
  green: number;
  blue: number;
}

function rgbTo255(c: RGB): [number, number, number] {
  return [
    Math.round(c.red * 255),
    Math.round(c.green * 255),
    Math.round(c.blue * 255),
  ];
}

// ---------------------------------------------------------------------------
// Styled segment: a word (or whitespace) with its visual properties
// ---------------------------------------------------------------------------

interface Segment {
  text: string;
  bold: boolean;
  italic: boolean;
  size: number;
  color?: RGB;
  bgColor?: RGB;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function downloadScaffoldPdf(
  opts: ScaffoldPdfOptions,
): Promise<void> {
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
    orientation: "portrait",
  });

  let y = MARGIN_TOP;
  let listCounter = 0;

  function checkPage(needed: number) {
    if (y + needed > PAGE_H - MARGIN_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  }

  function applyFont(seg: Segment) {
    let style = "normal";
    if (seg.bold && seg.italic) style = "bolditalic";
    else if (seg.bold) style = "bold";
    else if (seg.italic) style = "italic";
    doc.setFont("helvetica", style);
    doc.setFontSize(seg.size);
    if (seg.color) {
      const [r, g, b] = rgbTo255(seg.color);
      doc.setTextColor(r, g, b);
    } else {
      doc.setTextColor(30, 30, 30);
    }
  }

  /**
   * Render a paragraph's worth of styled segments with proper inline flow
   * and word-wrapping.  Handles multiple runs on the same line.
   */
  function renderSegments(segments: Segment[], startX: number, maxW: number) {
    let cursorX = startX;
    const lineH =
      (segments.length ? segments[0].size : 11) * LINE_HEIGHT_FACTOR;

    for (const seg of segments) {
      const lh = seg.size * LINE_HEIGHT_FACTOR;

      // Handle explicit newlines
      const sublines = seg.text.split("\n");
      for (let si = 0; si < sublines.length; si++) {
        if (si > 0) {
          // explicit newline
          y += lh;
          cursorX = startX;
          checkPage(lh);
        }

        const sub = sublines[si];
        if (!sub) continue;

        // Split into words for wrapping
        const words = sub.split(/( +)/); // keep spaces as separate tokens
        for (const word of words) {
          if (!word) continue;
          applyFont(seg);
          const ww = doc.getTextWidth(word);

          // Wrap if this word would overflow (but not if cursor is at line start)
          if (cursorX + ww > startX + maxW && cursorX > startX) {
            y += lh;
            cursorX = startX;
            checkPage(lh);
            // Skip leading spaces on wrapped line
            if (!word.trim()) continue;
          }

          checkPage(lh);

          // Background highlight
          if (seg.bgColor) {
            const [r, g, b] = rgbTo255(seg.bgColor);
            doc.setFillColor(r, g, b);
            doc.rect(cursorX - 0.5, y - seg.size + 2, ww + 1, lh - 2, "F");
            applyFont(seg); // restore text color after fill
          }

          doc.text(word, cursorX, y);
          cursorX += ww;
        }
      }
    }

    // Advance y past the last rendered line
    y += lineH;
  }

  // -----------------------------------------------------------------------
  // Build structured blocks (reuses the Google Docs HTML parser)
  // -----------------------------------------------------------------------

  const headerHtml = [
    `<h1>${escHtml(opts.title)}</h1>`,
    opts.elLevel
      ? `<p style="font-size:10pt;color:#666;">${escHtml(opts.elLevel)} Level \u2014 Scaffolded Assignment</p>`
      : "",
    `<hr />`,
  ].join("");

  const headerBlocks = parseHtmlToBlocks(headerHtml);
  const contentBlocks = parseHtmlToBlocks(opts.html);

  const wordBankBlocks =
    opts.wordBank?.length ? buildWordBankBlocks(opts.wordBank) : [];
  const instructionBlocks = opts.teacherInstructions
    ? buildTeacherInstructionsBlocks(opts.teacherInstructions)
    : [];

  const allBlocks = [
    ...headerBlocks,
    ...contentBlocks,
    ...wordBankBlocks,
    ...instructionBlocks,
  ];

  // -----------------------------------------------------------------------
  // Render blocks into the PDF
  // -----------------------------------------------------------------------

  for (const block of allBlocks) {
    if (block.type === "divider") {
      checkPage(14);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_W, y);
      y += 14;
      continue;
    }

    const fontSize = FONT_SIZE[block.type] ?? 11;
    const lineH = fontSize * LINE_HEIGHT_FACTOR;
    const isHeading = block.type.startsWith("heading");
    const isList =
      block.type === "list-bullet" || block.type === "list-number";

    // Spacing before headings
    if (isHeading && y > MARGIN_TOP + 10) {
      y += lineH * 0.5;
    }

    // Calculate indent
    let indentX = MARGIN_LEFT;
    const indentLevel = block.indent ?? 0;

    if (isList) {
      indentX += 18 + indentLevel * 18;
      checkPage(lineH);

      if (block.type === "list-bullet") {
        listCounter = 0;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(30, 30, 30);
        doc.text("\u2022", MARGIN_LEFT + 6 + indentLevel * 18, y);
      } else {
        listCounter++;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(30, 30, 30);
        doc.text(`${listCounter}.`, MARGIN_LEFT + 2 + indentLevel * 18, y);
      }
    }

    const maxW = CONTENT_W - (indentX - MARGIN_LEFT);

    if (block.runs.length === 0) {
      y += lineH;
      continue;
    }

    // Build flat segment list from runs
    const segments: Segment[] = block.runs.map((run) => ({
      text: run.text,
      bold: isHeading || !!run.style.bold,
      italic: !!run.style.italic,
      size: run.style.fontSize ?? fontSize,
      color: run.style.textColor,
      bgColor: run.style.backgroundColor,
    }));

    renderSegments(segments, indentX, maxW);

    // Reset list counter when leaving numbered lists
    if (!isList) listCounter = 0;

    // Small gap after paragraphs
    if (!isHeading) y += lineH * 0.15;
  }

  // -----------------------------------------------------------------------
  // Save
  // -----------------------------------------------------------------------
  doc.save(opts.filename);
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
