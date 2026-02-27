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

const PAGE_W = 612; // letter width in pt
const PAGE_H = 792; // letter height in pt
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 54;
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;

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
// Text-wrapping utility
// ---------------------------------------------------------------------------

/**
 * Word-wrap `text` to fit within `maxWidth` (pt) at the given font settings.
 * Returns an array of lines.  Handles embedded newlines.
 */
function wrapText(
  doc: jsPDF,
  text: string,
  maxWidth: number,
): string[] {
  const result: string[] = [];
  for (const rawLine of text.split("\n")) {
    if (!rawLine.trim()) {
      result.push("");
      continue;
    }
    const words = rawLine.split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (doc.getTextWidth(test) > maxWidth && line) {
        result.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) result.push(line);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function downloadScaffoldPdf(
  opts: ScaffoldPdfOptions,
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });

  let y = MARGIN_TOP;
  let listCounter = 0;

  function checkPage(needed: number) {
    if (y + needed > PAGE_H - MARGIN_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  }

  /**
   * Set font style on the jsPDF instance.
   */
  function setFont(
    bold: boolean,
    italic: boolean,
    size: number,
    color?: RGB,
  ) {
    let style = "normal";
    if (bold && italic) style = "bolditalic";
    else if (bold) style = "bold";
    else if (italic) style = "italic";
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    if (color) {
      const [r, g, b] = rgbTo255(color);
      doc.setTextColor(r, g, b);
    } else {
      doc.setTextColor(30, 30, 30);
    }
  }

  /**
   * Render a single styled run, word-wrapping and advancing `y`.
   * Returns the new y position.
   */
  function renderRun(
    text: string,
    bold: boolean,
    italic: boolean,
    size: number,
    color: RGB | undefined,
    bgColor: RGB | undefined,
    x: number,
    maxW: number,
  ): void {
    setFont(bold, italic, size, color);
    const lineH = size * LINE_HEIGHT_FACTOR;
    const lines = wrapText(doc, text, maxW);

    for (const line of lines) {
      checkPage(lineH);

      // Background highlight
      if (bgColor) {
        const [r, g, b] = rgbTo255(bgColor);
        const tw = doc.getTextWidth(line);
        doc.setFillColor(r, g, b);
        doc.rect(x - 1, y - size + 2, tw + 2, lineH - 2, "F");
        // Re-set text colour after fill
        if (color) {
          const [cr, cg, cb] = rgbTo255(color);
          doc.setTextColor(cr, cg, cb);
        } else {
          doc.setTextColor(30, 30, 30);
        }
      }

      doc.text(line, x, y);
      y += lineH;
    }
  }

  // -----------------------------------------------------------------------
  // Build structured blocks (reuses the Google Docs HTML parser)
  // -----------------------------------------------------------------------

  // Header blocks
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
    const isList = block.type === "list-bullet" || block.type === "list-number";

    // Spacing before headings
    if (isHeading && y > MARGIN_TOP + 10) {
      y += lineH * 0.5;
    }

    // List prefix
    let indentX = MARGIN_LEFT;
    const indentLevel = block.indent ?? 0;
    if (isList) {
      indentX += 18 + indentLevel * 18;
      checkPage(lineH);

      if (block.type === "list-bullet") {
        listCounter = 0;
        setFont(false, false, fontSize);
        doc.text("\u2022", MARGIN_LEFT + 6 + indentLevel * 18, y);
      } else {
        listCounter++;
        setFont(false, false, fontSize);
        doc.text(`${listCounter}.`, MARGIN_LEFT + 2 + indentLevel * 18, y);
      }
    }

    const maxW = CONTENT_W - (indentX - MARGIN_LEFT);

    // For blocks with a single long text, we render run-by-run.
    // If there are multiple styled runs within a block, we handle them
    // sequentially on the same line when possible.
    if (block.runs.length === 0) {
      y += lineH;
      continue;
    }

    // Simple path: render each run.
    // For multi-run blocks (e.g. "bold term" + "definition") we concatenate
    // within the same logical paragraph.
    for (const run of block.runs) {
      const bold = isHeading || !!run.style.bold;
      const italic = !!run.style.italic;
      const size = run.style.fontSize ?? fontSize;
      const color = run.style.textColor;
      const bgColor = run.style.backgroundColor;

      renderRun(run.text, bold, italic, size, color, bgColor, indentX, maxW);
    }

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
