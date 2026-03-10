import { getELDPromptContext } from "@/lib/eld-standards";
import type { ELLevel, ScaffoldGenerationResult, ScaffoldAction } from "@/types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-haiku-4.5";

function isPlaceholder(): boolean {
  return !OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 10;
}

// ---------------------------------------------------------------------------
// OpenRouter API call
// ---------------------------------------------------------------------------

interface OpenRouterResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string; code?: string };
}

async function callOpenRouter(
  prompt: string,
): Promise<string> {
  const body: Record<string, unknown> = {
    model: MODEL,
    max_tokens: 16384,
    messages: [{ role: "user", content: prompt }],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000); // 2 minute timeout

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("AI generation timed out. The document may be too long. Please try with a shorter document.");
    }
    throw err;
  }
  clearTimeout(timeout);

  const rawText = await res.text();
  let data: OpenRouterResponse;
  try {
    data = JSON.parse(rawText) as OpenRouterResponse;
  } catch {
    throw new Error(`OpenRouter returned non-JSON (${res.status}): ${rawText.slice(0, 500)}`);
  }

  if (!res.ok || data.error) {
    const msg = data.error?.message || `OpenRouter API error (${res.status}): ${rawText.slice(0, 500)}`;
    console.error("[OpenRouter] API error:", res.status, rawText.slice(0, 1000));
    throw new Error(msg);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  return content;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface GenerateParams {
  originalContent: string;
  elLevel: ELLevel;
  scaffoldPrompts: string[];
  scaffoldNames: string[];
  title: string;
  subject?: string;
  gradeLevel?: number;
  /** When set, also produces scaffold_actions for clone-based export */
  sourceDocId?: string;
  /** Full HTML from Google Drive export — scaffolds on top of this HTML structure */
  sourceHtml?: string;
}

const WORD_BANK_SCAFFOLD_PREFIX = "Word Bank";

/**
 * Extract <style> blocks from sourceHtml.
 * Google's export wraps everything in a div with <style>...</style> blocks.
 */
function extractStyles(html: string): { styles: string; body: string } {
  const styleBlocks: string[] = [];
  const body = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
    styleBlocks.push(match);
    return "";
  });
  return { styles: styleBlocks.join("\n"), body: body.trim() };
}

/**
 * Aggressively slim Google Docs HTML for the AI prompt.
 * Extracts base64 images as placeholders (the biggest token sink),
 * strips all wrapper elements (spans, divs), attributes, and structure
 * leaving only semantic content (p, h1-h6, table, img, ul, ol, li, b, i, u, a).
 * Typically reduces 400k+ token docs to <50k tokens.
 */
interface SlimResult {
  html: string;
  images: Map<string, string>;
}

function slimHtml(rawHtml: string): SlimResult {
  let s = rawHtml;
  const images = new Map<string, string>();
  let imgCount = 0;

  // 1. Remove HTML comments and DOCTYPE
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<!DOCTYPE[^>]*>/gi, "");

  // 2. Remove <head>...</head> entirely (styles extracted separately)
  s = s.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");

  // 3. Remove <html>, <body> wrappers
  s = s.replace(/<\/?(html|body)[^>]*>/gi, "");

  // 4. Replace base64 images with tiny placeholders (biggest token saver)
  s = s.replace(/<img\s[^>]*?src="(data:image\/[^"]*)"[^>]*?\/?>/gi, (_match, src) => {
    const key = `IMG_PH_${++imgCount}`;
    images.set(key, src as string);
    return `<img src="${key}">`;
  });

  // 5. Preserve src on remaining img tags, strip other attributes
  s = s.replace(/<img\s[^>]*?src="([^"]*)"[^>]*?\/?>/gi, '<img src="$1">');

  // 6. Preserve href on a tags, strip other attributes
  s = s.replace(/<a\s[^>]*?href="([^"]*)"[^>]*?>/gi, '<a href="$1">');

  // 7. Strip ALL attributes from all other tags
  s = s.replace(/<(\/?)([a-z][a-z0-9]*)\s[^>]*>/gi, "<$1$2>");

  // 8. Remove ALL span tags (Google wraps every text run in spans)
  s = s.replace(/<\/?span>/gi, "");

  // 9. Remove ALL div tags (keep content — divs are just wrappers in Google Docs)
  s = s.replace(/<\/?div>/gi, "");

  // 10. Remove empty paragraphs and list items
  s = s.replace(/<p>\s*<\/p>/gi, "");
  s = s.replace(/<li>\s*<\/li>/gi, "");

  // 11. Remove empty links
  s = s.replace(/<a>\s*<\/a>/gi, "");

  // 12. Collapse whitespace
  s = s.replace(/\s+/g, " ");
  s = s.replace(/>\s*</g, ">\n<");

  // 13. Remove blank lines
  s = s.replace(/\n{2,}/g, "\n");

  return { html: s.trim(), images };
}

/**
 * Wrap AI-generated HTML with a base stylesheet for polished rendering.
 */
function wrapWithBaseStyles(html: string): string {
  const baseStyles = `<style>
.scaffold-output { font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
.scaffold-output h1 { font-family: 'Segoe UI', Arial, sans-serif; font-size: 18pt; text-align: center; border-bottom: 2px solid #333; padding-bottom: 0.5em; margin: 0 0 1em 0; }
.scaffold-output h2 { font-family: 'Segoe UI', Arial, sans-serif; font-size: 15pt; margin: 1.5em 0 0.5em 0; color: #1e3a5f; }
.scaffold-output h3 { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13pt; margin: 1.2em 0 0.4em 0; color: #2c5282; }
.scaffold-output p { margin: 0.75em 0; }
.scaffold-output ol, .scaffold-output ul { padding-left: 1.5em; margin: 0.75em 0; }
.scaffold-output li { margin: 0.3em 0; }
.scaffold-output table { border-collapse: collapse; width: 100%; margin: 1em 0; }
.scaffold-output th, .scaffold-output td { border: 1px solid #999; padding: 8px 12px; text-align: left; }
.scaffold-output th { background: #f0f0f0; font-weight: bold; }
.scaffold-output img { max-width: 100%; height: auto; }
</style>`;
  return `<div class="scaffold-output">${baseStyles}${html}</div>`;
}

export async function generateScaffoldedAssignment(
  params: GenerateParams,
): Promise<ScaffoldGenerationResult> {
  const includeWordBank = params.scaffoldNames.some((n) =>
    n.startsWith(WORD_BANK_SCAFFOLD_PREFIX),
  );
  const includeActions = !!params.sourceDocId;

  if (isPlaceholder()) {
    return buildMockResult(params);
  }

  // When sourceHtml is available, extract styles, slim the body, and placeholder images.
  // The AI works with the slimmed body; we restore images and styles on the output.
  let originalStyles = "";
  let extractedImages = new Map<string, string>();
  if (params.sourceHtml) {
    const { styles, body } = extractStyles(params.sourceHtml);
    originalStyles = styles;
    const { html: slimmed, images } = slimHtml(body);
    extractedImages = images;
    params = { ...params, sourceHtml: slimmed };
  }

  const prompt = buildPrompt(params, includeWordBank, includeActions);

  // Helper: extract scaffolded_html from a parsed JSON object, trying common key variants
  function extractHtmlFromParsed(obj: Record<string, unknown>): string | null {
    const html = obj.scaffolded_html ?? obj.scaffoldedHtml ?? obj.html ?? obj.output;
    return typeof html === "string" && html.length > 50 ? html : null;
  }

  // Helper: try to extract JSON from raw text (handles markdown fences, leading text, etc.)
  function extractJsonFromText(text: string): Record<string, unknown> | null {
    // Strip markdown code fences
    let cleaned = text.replace(/^```(?:json|html)?\n?/i, "").replace(/\n?```$/i, "").trim();

    // Try direct parse first
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, unknown>;
    } catch { /* continue */ }

    // Find first { and last } to extract JSON object from surrounding text
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
        if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, unknown>;
      } catch { /* continue */ }
    }

    return null;
  }

  const rawText = await callOpenRouter(prompt);

  console.log("[OpenRouter] Raw response length:", rawText.length, "first 200 chars:", rawText.slice(0, 200));

  // Try to parse the JSON response
  const parsed = extractJsonFromText(rawText);

  if (parsed) {
    let scaffoldedHtml = extractHtmlFromParsed(parsed);

    if (!scaffoldedHtml) {
      console.error("[OpenRouter] JSON parsed but no scaffolded_html found. Keys:", Object.keys(parsed));
      throw new Error("AI response missing scaffolded_html field");
    }

    // Strip any DOCTYPE/html/head/body tags the AI might have added
    scaffoldedHtml = scaffoldedHtml.replace(/<!DOCTYPE[^>]*>/gi, "");
    scaffoldedHtml = scaffoldedHtml.replace(/<\/?(html|head|body)[^>]*>/gi, "");

    // Restore base64 images from placeholders
    for (const [key, src] of extractedImages) {
      scaffoldedHtml = scaffoldedHtml.replaceAll(key, src);
    }

    // Re-attach original styles, or wrap with base styles for plain text
    scaffoldedHtml = originalStyles
      ? `${originalStyles}\n${scaffoldedHtml}`
      : wrapWithBaseStyles(scaffoldedHtml);

    const scaffoldActions = (parsed.scaffold_actions as ScaffoldAction[]) || null;
    console.log("[OpenRouter] Generation complete:", {
      model: MODEL,
      scaffoldedHtmlLength: scaffoldedHtml.length,
      hasWordBank: !!parsed.word_bank,
      scaffoldActionsReturned: scaffoldActions ? scaffoldActions.length : 0,
    });

    return {
      html: scaffoldedHtml,
      wordBank: (parsed.word_bank as { term: string; definition: string }[]) || null,
      scaffoldsUsed: (parsed.scaffolds_used as string[]) || params.scaffoldNames,
      teacherInstructions: (parsed.teacher_instructions as string) || null,
      isDemo: false,
      scaffoldActions,
    };
  }

  // JSON extraction failed entirely — try to use raw text as HTML (last resort)
  console.error("[OpenRouter] Could not parse JSON from response. Raw text (first 500):", rawText.slice(0, 500));

  // If the raw text looks like it contains HTML tags, use it directly
  if (rawText.includes("<p") || rawText.includes("<div") || rawText.includes("<h")) {
    let html = rawText.replace(/^```(?:json|html)?\n?/i, "").replace(/\n?```$/i, "").trim();

    for (const [key, src] of extractedImages) {
      html = html.replaceAll(key, src);
    }

    return {
      html: originalStyles ? `${originalStyles}\n${html}` : wrapWithBaseStyles(html),
      wordBank: null,
      scaffoldsUsed: params.scaffoldNames,
      teacherInstructions: null,
      isDemo: false,
      scaffoldActions: null,
    };
  }

  throw new Error("AI returned an unparseable response. Please try again.");
}

// ---------------------------------------------------------------------------
// Prompt builder (unchanged logic)
// ---------------------------------------------------------------------------

function buildPrompt(params: GenerateParams, includeWordBank: boolean, includeActions: boolean): string {
  const {
    originalContent,
    elLevel,
    scaffoldPrompts,
    scaffoldNames,
    title,
    subject,
    gradeLevel,
    sourceHtml,
  } = params;

  const scaffoldInstructions = scaffoldPrompts
    .map((prompt, i) => `${i + 1}. **${scaffoldNames[i]}**: ${prompt}`)
    .join("\n");

  const hasTranslation = scaffoldNames.some((n) => /translat|bilingual/i.test(n));
  const hasWordBank = includeWordBank;

  const metaContext = [
    `Assignment title: "${title}"`,
    subject ? `Subject: ${subject}` : null,
    gradeLevel ? `Grade level: ${gradeLevel}` : null,
    `Student EL level: ${elLevel}`,
  ]
    .filter(Boolean)
    .join("\n");

  const eldContext = getELDPromptContext(elLevel);

  let actionsSection = "";
  if (includeActions) {
    actionsSection = `
## Rules for scaffold_actions (CRITICAL — Generate these for Google Docs format preservation)
You MUST generate a scaffold_actions array. Each action describes a precise modification to apply directly to the original Google Doc to preserve its formatting.

### Action Types:
1. **highlight_range**: Find exact text in the original and apply a background color.
   - search_text MUST be an exact, verbatim substring from the original assignment text (case-sensitive, including punctuation)
   - Keep search_text to a phrase or single sentence (not an entire paragraph)
   - background_color must be a hex color string (e.g., "#FFF176" for yellow, "#AED581" for green, "#90CAF9" for blue)

2. **insert_after_paragraph**: Insert new content after an identified paragraph.
   - paragraph_prefix must be the first 60+ characters of the target paragraph, exact match
   - insert_content is the text to insert (plain text, newlines allowed)
   - Use style_italic, style_bold, style_text_color, style_font_size_pt as needed

3. **insert_divider_after_paragraph**: Insert a visual section divider after a paragraph.
   - paragraph_prefix identifies the paragraph after which to insert
   - label is optional divider text (e.g., "Section 2 of 4")

4. **append_section**: Add a section at the END of the document.
   - heading is the section title (e.g., "Word Bank", "Sentence Starters", "Spanish Translation")
   - content is the body text
   - items is for word bank entries [{term, definition}]
   - section_style should be "word_bank", "sentence_frames", or "translation"

### Critical Rules for scaffold_actions:
- search_text and paragraph_prefix values MUST be exact substrings from the Original Assignment below — copy them character-for-character
- For highlights, use short phrases (5-20 words), NOT entire paragraphs
- Order actions: highlight_range first, then insert/divider actions (top-to-bottom through the document), then append_section actions last
- The scaffold_actions should produce equivalent scaffolding to what scaffolded_html contains, but as targeted modifications rather than a full HTML rewrite

`;
  }

  const translationRule = hasTranslation
    ? `\n\n## TRANSLATION (HIGHEST PRIORITY)
Every piece of English text in the document MUST be replaced with its Spanish translation. This applies to ALL text: paragraphs, headings, list items, table cells, instructions, questions — everything the student reads. Only keep proper nouns, names, and numbers unchanged. Do NOT leave any English text in the output. Do NOT add extra sections — just replace the English text with Spanish.`
    : "";

  const htmlRules = sourceHtml
    ? `## Rules for scaffolded_html (CRITICAL — modify the original HTML in-place)
- You are given a SLIMMED version of the original Google Doc HTML below. The original stylesheet will be re-attached automatically — do NOT add <style> blocks.
- Modify the HTML IN-PLACE. PRESERVE the HTML structure: all tags, <img> tags, and element order. Do NOT regenerate, reorganize, or restructure the HTML.
- Do NOT add any extra sections, content, or scaffolds beyond what is listed above.
- **Color coding**: Wrap text with a background-color span. Example: <span style="background-color: #FFF176;">text here</span>
- **Appended sections** (word banks, sentence frames, etc.): Add at the END of the document only.${translationRule}`
    : `## Rules for scaffolded_html (CRITICAL — preserve the original structure, only add scaffolds)
- Convert the original text to HTML that preserves its structure and element order.
- Do NOT add formatting, styling, or structure that wasn't in the original.
- Do NOT add any extra sections, content, or scaffolds beyond what is listed above.
- Use inline CSS styles only. Wrap the entire output in a single <div> element.
- Use semantic HTML matching the original: <p>, <ol>/<ul>, <table>, <b>/<i>/<u>, <h1>-<h6>.
- **Color coding**: Wrap text with a background-color span. Example: <span style="background-color: #FFF176;">text here</span>
- **Appended sections** (word banks, sentence frames, etc.): Add at the END of the document only.${translationRule}`;

  return `You are an expert ELD (English Language Development) scaffolding specialist for California middle school teachers, aligned with the 2012 CA ELD Standards and ELA/ELD Framework.

## Context
${metaContext}

## CA ELD Framework Guidance for ${elLevel} Level
${eldContext}

## Instructions
Apply ONLY the scaffolds listed below. Do NOT add ANY other modifications such as: section dividers, chunking headers ("Section X of Y"), word banks, sentence starters, graphic organizers, vocabulary lists, or any other scaffold not explicitly listed below. If it is not in the list below, do NOT add it.

### Scaffolds to Apply (ONLY these):
${scaffoldInstructions}

${htmlRules}
- Make the output clean, readable, and well-structured for printing
- Target the scaffolding complexity for ${elLevel}-level ELL students
- If a scaffold instruction says to add something "before" or "after" content, place it logically relative to the relevant section

${includeWordBank ? `## Rules for word_bank
- Select 6-12 academic or challenging vocabulary words from the assignment
- The word_bank JSON field must ALWAYS be in English (terms and definitions), even when a bilingual translation scaffold is applied
- Definitions should be appropriate for the ${elLevel} EL level
- For Emerging: use simple, everyday language definitions
- For Expanding: use clear academic definitions
- For Bridging: focus on nuanced/domain-specific terms
${hasTranslation ? `
## BILINGUAL WORD BANK (Spanish Translation + Word Bank selected)
Since both Word Bank and Spanish Translation are selected, you MUST include TWO word bank sections in the scaffolded_html output:
1. **English Word Bank** — titled "Word Bank" with English terms and English definitions
2. **Spanish Word Bank** — titled "Banco de Palabras" with the SAME terms translated to Spanish and definitions in Spanish
Place both word banks at the END of the document. The English word bank comes first, then the Spanish word bank immediately after.
Use the same styling for both. Example structure:
<div class="word-bank" style="border: 2px solid #2563eb; padding: 1.25rem; margin: 2rem 0; background: #eff6ff; border-radius: 8px;">
  <h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Word Bank</h3>
  ...English terms and definitions...
</div>
<div class="word-bank" style="border: 2px solid #2563eb; padding: 1.25rem; margin: 2rem 0; background: #eff6ff; border-radius: 8px;">
  <h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Banco de Palabras</h3>
  ...Spanish terms and definitions...
</div>
` : ""}
` : ""}## Rules for teacher_instructions
- Brief (2-3 sentences) guidance on implementing the scaffolded assignment
- Include any verbal or physical scaffolds the teacher should add beyond the written scaffolds
${actionsSection}
${sourceHtml ? `## Original HTML (slimmed — modify in-place, add scaffolds only):
${sourceHtml}

## Original Plain Text (for reference and scaffold_actions text matching):
${originalContent}` : `## Original Assignment:
${originalContent}`}

CRITICAL RULES — VIOLATION OF ANY OF THESE IS A FAILURE:
1. You MUST output the ENTIRE document with scaffolds applied. NEVER truncate, abbreviate, or skip any part.
2. NEVER use placeholder text like "[full Spanish translation...]", "[rest of document...]", "[content continues...]", or ANY bracketed descriptions. Every single word of the original document must appear (translated if translation is selected, or verbatim if not).
3. The scaffolded_html field must contain REAL, COMPLETE HTML — not a description of what it should contain.
4. Process every paragraph, heading, list item, table cell, and sentence from start to finish.

Respond with valid JSON matching the required schema. Do not include any text outside the JSON object.`;
}

// ---------------------------------------------------------------------------
// Mock / demo result (no API key configured)
// ---------------------------------------------------------------------------

function buildMockResult(params: GenerateParams): ScaffoldGenerationResult {
  const { originalContent, elLevel, scaffoldNames, title } = params;
  const includeWordBank = scaffoldNames.some((n) =>
    n.startsWith(WORD_BANK_SCAFFOLD_PREFIX),
  );

  const scaffoldList = scaffoldNames
    .map((name) => `<li>${name}</li>`)
    .join("\n          ");

  const paragraphs = originalContent
    .split(/\n\n+/)
    .map(
      (p) =>
        `<p style="margin: 0.75rem 0; line-height: 1.7;">${p.trim()}</p>`,
    )
    .join("\n      ");

  const html = `<div style="font-family: system-ui, sans-serif; max-width: 800px;">
    <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
      <strong style="color: #92400e;">Demo Preview</strong>
      <p style="margin: 0.5rem 0 0 0; color: #78350f; font-size: 0.875rem;">
        This is a demo preview. Add your OPENROUTER_API_KEY to <code>.env.local</code> for real AI scaffolding.
      </p>
    </div>

    <h2 style="margin: 0 0 0.5rem 0; color: #1e40af;">${title}</h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">
      EL Level: <strong>${elLevel}</strong>
    </p>

    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 0.75rem 1rem; margin-bottom: 1.5rem; border-radius: 0 6px 6px 0;">
      <strong style="color: #1e40af; font-size: 0.875rem;">Scaffolds Applied:</strong>
      <ul style="margin: 0.5rem 0 0 1.25rem; padding: 0; font-size: 0.875rem; color: #374151;">
          ${scaffoldList}
      </ul>
    </div>

    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; background: white;">
      ${paragraphs}
    </div>

    ${includeWordBank ? `<div style="border: 2px solid #2563eb; padding: 1.25rem; margin: 2rem 0; background: #eff6ff; border-radius: 8px;">
      <h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Word Bank (Demo)</h3>
      <div style="display: grid; gap: 0.5rem;">
        <div><strong style="color: #1e40af;">scaffold:</strong> A support structure to help with learning</div>
        <div><strong style="color: #1e40af;">differentiate:</strong> To make different versions for different needs</div>
        <div><strong style="color: #1e40af;">assignment:</strong> A task or piece of work given to a student</div>
      </div>
    </div>` : ""}
  </div>`;

  return {
    html,
    wordBank: includeWordBank
      ? [
          { term: "scaffold", definition: "A support structure to help with learning" },
          { term: "differentiate", definition: "To make different versions for different needs" },
          { term: "assignment", definition: "A task or piece of work given to a student" },
        ]
      : null,
    scaffoldsUsed: scaffoldNames,
    teacherInstructions:
      "This is a demo preview. Add your OPENROUTER_API_KEY for real scaffolding with teacher-specific instructions.",
    isDemo: true,
    scaffoldActions: null,
  };
}
