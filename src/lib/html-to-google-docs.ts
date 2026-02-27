/**
 * HTML-to-Google-Docs converter
 *
 * Parses scaffolded HTML (with inline CSS) into Google Docs API batch-update
 * requests that preserve headings, bold/italic, text colours, background
 * colours, lists, and table-like structures.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  textColor?: RGBColor;
  backgroundColor?: RGBColor;
}

interface TextRun {
  text: string;
  style: TextStyle;
}

type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "paragraph"
  | "list-bullet"
  | "list-number"
  | "divider";

interface DocumentBlock {
  type: BlockType;
  runs: TextRun[];
  indent?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DocsRequest = Record<string, any>;

export interface ConversionResult {
  /** Full plain-text content that was inserted into the doc. */
  text: string;
  /** Google Docs batchUpdate requests (insertText + all formatting). */
  requests: DocsRequest[];
}

// ---------------------------------------------------------------------------
// CSS / colour helpers
// ---------------------------------------------------------------------------

function parseInlineStyle(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleStr) return styles;
  for (const decl of styleStr.split(";")) {
    const [prop, ...rest] = decl.split(":");
    if (prop && rest.length) {
      styles[prop.trim().toLowerCase()] = rest.join(":").trim();
    }
  }
  return styles;
}

function parseColor(raw: string): RGBColor | null {
  if (!raw) return null;
  const c = raw.trim();

  // #fff / #ffffff / #ffffffaa
  const hex = c.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return {
      red: parseInt(h.slice(0, 2), 16) / 255,
      green: parseInt(h.slice(2, 4), 16) / 255,
      blue: parseInt(h.slice(4, 6), 16) / 255,
    };
  }

  // rgb(r,g,b) or rgba(r,g,b,a)
  const rgb = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) {
    return {
      red: +rgb[1] / 255,
      green: +rgb[2] / 255,
      blue: +rgb[3] / 255,
    };
  }

  const named: Record<string, RGBColor> = {
    red: { red: 1, green: 0, blue: 0 },
    blue: { red: 0, green: 0, blue: 1 },
    green: { red: 0, green: 0.502, blue: 0 },
    yellow: { red: 1, green: 1, blue: 0 },
    orange: { red: 1, green: 0.647, blue: 0 },
    purple: { red: 0.502, green: 0, blue: 0.502 },
    white: { red: 1, green: 1, blue: 1 },
    black: { red: 0, green: 0, blue: 0 },
    gray: { red: 0.502, green: 0.502, blue: 0.502 },
    grey: { red: 0.502, green: 0.502, blue: 0.502 },
  };
  return named[c.toLowerCase()] ?? null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

// ---------------------------------------------------------------------------
// HTML tokeniser (server-safe, no DOM required)
// ---------------------------------------------------------------------------

type Token =
  | { type: "open"; tag: string; attrs: Record<string, string>; selfClosing: boolean }
  | { type: "close"; tag: string }
  | { type: "text"; content: string };

function tokenizeHtml(html: string): Token[] {
  const tokens: Token[] = [];

  // Strip script / style / comment blocks
  let clean = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  clean = clean.replace(/<!--[\s\S]*?-->/g, "");

  const re = /<\/?([a-z][a-z0-9]*)\b([^>]*?)(\/?)\s*>|([^<]+)/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(clean)) !== null) {
    if (m[4]) {
      const text = decodeEntities(m[4]);
      if (text) tokens.push({ type: "text", content: text });
    } else if (m[0].startsWith("</")) {
      tokens.push({ type: "close", tag: m[1].toLowerCase() });
    } else {
      const tag = m[1].toLowerCase();
      const selfClosing = !!m[3] || ["br", "hr", "img", "input"].includes(tag);
      const attrs: Record<string, string> = {};
      const attrRe = /([a-z\-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
      let am: RegExpExecArray | null;
      while ((am = attrRe.exec(m[2] || "")) !== null) {
        attrs[am[1].toLowerCase()] = am[2] ?? am[3] ?? am[4] ?? "";
      }
      tokens.push({ type: "open", tag, attrs, selfClosing });
    }
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// Tag classification
// ---------------------------------------------------------------------------

const BLOCK_TAGS = new Set([
  "div", "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "li", "ul", "ol", "table", "tr", "td", "th",
  "blockquote", "section", "article", "header", "footer",
  "main", "aside", "nav", "figure", "figcaption", "details", "summary",
]);

const BOLD_TAGS = new Set(["strong", "b"]);
const ITALIC_TAGS = new Set(["em", "i"]);
const UNDERLINE_TAGS = new Set(["u", "ins"]);

const HEADING_MAP: Record<string, BlockType> = {
  h1: "heading1",
  h2: "heading2",
  h3: "heading3",
  h4: "heading4",
  h5: "heading4",
  h6: "heading4",
};

// ---------------------------------------------------------------------------
// Style stack
// ---------------------------------------------------------------------------

interface StyleFrame {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textColor?: RGBColor;
  backgroundColor?: RGBColor;
  fontSize?: number;
}

function extractStyleFrame(tag: string, attrs: Record<string, string>): StyleFrame {
  const frame: StyleFrame = {};
  const css = parseInlineStyle(attrs.style || "");

  if (BOLD_TAGS.has(tag)) frame.bold = true;
  if (ITALIC_TAGS.has(tag)) frame.italic = true;
  if (UNDERLINE_TAGS.has(tag)) frame.underline = true;

  const fw = css["font-weight"];
  if (fw === "bold" || fw === "700" || fw === "800" || fw === "900") frame.bold = true;
  if (css["font-style"] === "italic") frame.italic = true;
  if (css["text-decoration"]?.includes("underline")) frame.underline = true;

  const colorStr = css["color"];
  if (colorStr) {
    const c = parseColor(colorStr);
    if (c) frame.textColor = c;
  }

  const bg = css["background-color"] || css["background"];
  if (bg && !bg.includes("url(") && !bg.includes("gradient")) {
    const c = parseColor(bg);
    // Skip near-white backgrounds (not useful as highlight)
    if (c && !(c.red > 0.95 && c.green > 0.95 && c.blue > 0.95)) {
      frame.backgroundColor = c;
    }
  }

  const fs = css["font-size"];
  if (fs) {
    const pt = fs.match(/^(\d+(?:\.\d+)?)\s*pt$/i);
    const px = fs.match(/^(\d+(?:\.\d+)?)\s*px$/i);
    const rem = fs.match(/^(\d+(?:\.\d+)?)\s*rem$/i);
    if (pt) frame.fontSize = +pt[1];
    else if (px) frame.fontSize = +px[1] * 0.75;
    else if (rem) frame.fontSize = +rem[1] * 12;
  }

  return frame;
}

function mergeFrames(stack: StyleFrame[]): TextStyle {
  const out: TextStyle = {};
  for (const f of stack) {
    if (f.bold) out.bold = true;
    if (f.italic) out.italic = true;
    if (f.underline) out.underline = true;
    if (f.textColor) out.textColor = f.textColor;
    if (f.backgroundColor) out.backgroundColor = f.backgroundColor;
    if (f.fontSize) out.fontSize = f.fontSize;
  }
  return out;
}

function stylesEqual(a: TextStyle, b: TextStyle): boolean {
  return (
    a.bold === b.bold &&
    a.italic === b.italic &&
    a.underline === b.underline &&
    a.fontSize === b.fontSize &&
    colorsEqual(a.textColor, b.textColor) &&
    colorsEqual(a.backgroundColor, b.backgroundColor)
  );
}

function colorsEqual(a?: RGBColor, b?: RGBColor): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.red - b.red) < 0.01 &&
    Math.abs(a.green - b.green) < 0.01 &&
    Math.abs(a.blue - b.blue) < 0.01
  );
}

// ---------------------------------------------------------------------------
// HTML → DocumentBlock[]
// ---------------------------------------------------------------------------

export function parseHtmlToBlocks(html: string): DocumentBlock[] {
  const tokens = tokenizeHtml(html);
  const blocks: DocumentBlock[] = [];

  const styleStack: StyleFrame[] = [];
  const tagStack: string[] = [];
  let currentBlock: DocumentBlock | null = null;
  let listType: ("ul" | "ol")[] = [];

  function ensureBlock(type?: BlockType): DocumentBlock {
    if (!currentBlock) currentBlock = { type: type ?? "paragraph", runs: [] };
    return currentBlock;
  }

  function flushBlock() {
    if (!currentBlock) return;
    // Trim trailing whitespace from last run
    const last = currentBlock.runs[currentBlock.runs.length - 1];
    if (last) last.text = last.text.replace(/[\n\r\t ]+$/, "");
    // Keep if it has any visible content, or is a divider
    if (
      currentBlock.type === "divider" ||
      currentBlock.runs.some((r) => r.text.trim())
    ) {
      blocks.push(currentBlock);
    }
    currentBlock = null;
  }

  function addText(text: string) {
    if (!text) return;
    const block = ensureBlock();
    const style = mergeFrames(styleStack);
    const prev = block.runs[block.runs.length - 1];
    if (prev && stylesEqual(prev.style, style)) {
      prev.text += text;
    } else {
      block.runs.push({ text, style });
    }
  }

  for (const token of tokens) {
    if (token.type === "text") {
      let text = token.content.replace(/[\s\n\r]+/g, " ");
      if (!currentBlock || currentBlock.runs.length === 0) {
        text = text.replace(/^\s+/, "");
      }
      if (text) addText(text);
      continue;
    }

    if (token.type === "open") {
      const { tag, attrs, selfClosing } = token;

      if (tag === "br") {
        addText("\n");
        continue;
      }
      if (tag === "hr") {
        flushBlock();
        blocks.push({ type: "divider", runs: [] });
        continue;
      }

      if (BLOCK_TAGS.has(tag)) {
        if (tag === "ul" || tag === "ol") {
          flushBlock();
          listType.push(tag);
        } else if (tag === "li") {
          flushBlock();
          const lt = listType[listType.length - 1];
          currentBlock = {
            type: lt === "ol" ? "list-number" : "list-bullet",
            runs: [],
            indent: Math.max(0, listType.length - 1),
          };
        } else if (tag === "td" || tag === "th") {
          if (currentBlock && currentBlock.runs.length > 0) addText("    ");
          if (tag === "th") {
            styleStack.push({ bold: true });
            tagStack.push(tag);
          }
        } else if (tag === "tr") {
          flushBlock();
          currentBlock = { type: "paragraph", runs: [] };
        } else if (tag === "table") {
          flushBlock();
        } else {
          flushBlock();
          currentBlock = { type: HEADING_MAP[tag] ?? "paragraph", runs: [] };
        }
      }

      if (!selfClosing) {
        const frame = extractStyleFrame(tag, attrs);
        styleStack.push(frame);
        tagStack.push(tag);
      }
      continue;
    }

    // token.type === "close"
    const { tag } = token;

    const idx = tagStack.lastIndexOf(tag);
    if (idx !== -1) {
      tagStack.splice(idx, 1);
      styleStack.splice(idx, 1);
    }

    if (tag === "ul" || tag === "ol") {
      flushBlock();
      listType.pop();
    } else if (
      tag === "li" ||
      tag === "tr" ||
      tag === "p" ||
      tag === "div" ||
      tag === "blockquote" ||
      tag === "section" ||
      tag === "article" ||
      HEADING_MAP[tag]
    ) {
      flushBlock();
    }
  }

  flushBlock();
  return blocks;
}

// ---------------------------------------------------------------------------
// DocumentBlock[] → Google Docs API requests
// ---------------------------------------------------------------------------

export function blocksToDocsRequests(
  blocks: DocumentBlock[],
  startIndex: number,
): ConversionResult {
  const requests: DocsRequest[] = [];

  interface FmtRange {
    start: number;
    end: number;
    style: TextStyle;
  }
  interface ParaInfo {
    start: number;
    end: number;
    type: BlockType;
    indent?: number;
  }

  const fmtRanges: FmtRange[] = [];
  const paraInfos: ParaInfo[] = [];
  let fullText = "";

  for (const block of blocks) {
    if (block.type === "divider") {
      const line = "\u2501".repeat(40) + "\n";
      const s = fullText.length;
      fullText += line;
      fmtRanges.push({
        start: s,
        end: s + line.length - 1,
        style: { textColor: { red: 0.75, green: 0.75, blue: 0.75 }, fontSize: 8 },
      });
      continue;
    }

    const blockStart = fullText.length;

    for (const run of block.runs) {
      const rs = fullText.length;
      fullText += run.text;
      const re = fullText.length;
      const hasStyle =
        run.style.bold ||
        run.style.italic ||
        run.style.underline ||
        run.style.fontSize ||
        run.style.textColor ||
        run.style.backgroundColor;
      if (hasStyle && re > rs) {
        fmtRanges.push({ start: rs, end: re, style: run.style });
      }
    }

    fullText += "\n";
    paraInfos.push({
      start: blockStart,
      end: fullText.length,
      type: block.type,
      indent: block.indent,
    });
  }

  // --- 1. Insert text ---
  if (fullText) {
    requests.push({
      insertText: {
        location: { index: startIndex },
        text: fullText,
      },
    });
  }

  // --- 2. Paragraph styles (headings, bullets) ---
  const headingStyleMap: Record<string, string> = {
    heading1: "HEADING_1",
    heading2: "HEADING_2",
    heading3: "HEADING_3",
    heading4: "HEADING_4",
  };

  for (const p of paraInfos) {
    const absS = startIndex + p.start;
    const absE = startIndex + p.end;

    const ns = headingStyleMap[p.type];
    if (ns) {
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: absS, endIndex: absE },
          paragraphStyle: { namedStyleType: ns },
          fields: "namedStyleType",
        },
      });
    }

    if (p.type === "list-bullet") {
      requests.push({
        createParagraphBullets: {
          range: { startIndex: absS, endIndex: absE },
          bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
        },
      });
    } else if (p.type === "list-number") {
      requests.push({
        createParagraphBullets: {
          range: { startIndex: absS, endIndex: absE },
          bulletPreset: "NUMBERED_DECIMAL_ALPHA_ROMAN",
        },
      });
    }

    if (p.indent && p.indent > 0) {
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: absS, endIndex: absE },
          paragraphStyle: {
            indentStart: { magnitude: p.indent * 36, unit: "PT" },
          },
          fields: "indentStart",
        },
      });
    }
  }

  // --- 3. Text styles ---
  for (const r of fmtRanges) {
    const absS = startIndex + r.start;
    const absE = startIndex + r.end;
    if (absE <= absS) continue;

    const ts: Record<string, unknown> = {};
    const fields: string[] = [];

    if (r.style.bold) {
      ts.bold = true;
      fields.push("bold");
    }
    if (r.style.italic) {
      ts.italic = true;
      fields.push("italic");
    }
    if (r.style.underline) {
      ts.underline = true;
      fields.push("underline");
    }
    if (r.style.fontSize) {
      ts.fontSize = { magnitude: r.style.fontSize, unit: "PT" };
      fields.push("fontSize");
    }
    if (r.style.textColor) {
      ts.foregroundColor = { color: { rgbColor: r.style.textColor } };
      fields.push("foregroundColor");
    }
    if (r.style.backgroundColor) {
      ts.backgroundColor = { color: { rgbColor: r.style.backgroundColor } };
      fields.push("backgroundColor");
    }

    if (fields.length) {
      requests.push({
        updateTextStyle: {
          range: { startIndex: absS, endIndex: absE },
          textStyle: ts,
          fields: fields.join(","),
        },
      });
    }
  }

  return { text: fullText, requests };
}

// ---------------------------------------------------------------------------
// Section builders (word bank, teacher instructions)
// ---------------------------------------------------------------------------

const BRAND_BLUE: RGBColor = { red: 0.118, green: 0.251, blue: 0.686 };
const SUBTLE_GRAY: RGBColor = { red: 0.4, green: 0.4, blue: 0.4 };

export function buildWordBankBlocks(
  wordBank: { term: string; definition: string }[],
): DocumentBlock[] {
  const blocks: DocumentBlock[] = [];
  blocks.push({ type: "divider", runs: [] });
  blocks.push({
    type: "heading2",
    runs: [{ text: "Word Bank", style: {} }],
  });

  for (const entry of wordBank) {
    blocks.push({
      type: "paragraph",
      runs: [
        { text: entry.term, style: { bold: true, textColor: BRAND_BLUE } },
        { text: `  \u2014  ${entry.definition}`, style: {} },
      ],
    });
  }

  return blocks;
}

export function buildTeacherInstructionsBlocks(
  instructions: string,
): DocumentBlock[] {
  return [
    { type: "divider", runs: [] },
    { type: "heading2", runs: [{ text: "Teacher Instructions", style: {} }] },
    {
      type: "paragraph",
      runs: [
        {
          text: instructions,
          style: { italic: true, textColor: SUBTLE_GRAY },
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// High-level: build the full Google Docs document body
// ---------------------------------------------------------------------------

export interface ExportDocumentParams {
  title: string;
  elLevel: string;
  scaffoldsApplied: string[];
  outputHtml: string;
  wordBank?: { term: string; definition: string }[] | null;
  teacherInstructions?: string | null;
}

/**
 * Build all Google Docs batchUpdate requests for a scaffolded assignment.
 * Returns the full list of requests ready to pass to `docs.documents.batchUpdate`.
 */
export function buildDocumentRequests(params: ExportDocumentParams): DocsRequest[] {
  const {
    title,
    elLevel,
    scaffoldsApplied,
    outputHtml,
    wordBank,
    teacherInstructions,
  } = params;

  // -- Header blocks --
  const headerBlocks: DocumentBlock[] = [
    {
      type: "heading1",
      runs: [{ text: title, style: {} }],
    },
    {
      type: "paragraph",
      runs: [
        {
          text: `${elLevel} Level \u2014 Scaffolded Assignment`,
          style: { fontSize: 11, textColor: SUBTLE_GRAY },
        },
      ],
    },
    {
      type: "paragraph",
      runs: [
        {
          text: `Scaffolds Applied: ${scaffoldsApplied.join(", ")}`,
          style: { fontSize: 10, textColor: SUBTLE_GRAY, italic: true },
        },
      ],
    },
    { type: "divider", runs: [] },
  ];

  // -- Content blocks (from scaffolded HTML) --
  const contentBlocks = parseHtmlToBlocks(outputHtml);

  // -- Optional sections --
  const wordBankBlocks =
    wordBank && wordBank.length > 0 ? buildWordBankBlocks(wordBank) : [];
  const instructionBlocks = teacherInstructions
    ? buildTeacherInstructionsBlocks(teacherInstructions)
    : [];

  const allBlocks = [
    ...headerBlocks,
    ...contentBlocks,
    ...wordBankBlocks,
    ...instructionBlocks,
  ];

  // Convert to Google Docs requests (insert at index 1 = start of doc body)
  const { requests } = blocksToDocsRequests(allBlocks, 1);
  return requests;
}
