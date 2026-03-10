import { getELDPromptContext } from "@/lib/eld-standards";
import type { ELLevel, ScaffoldGenerationResult, ScaffoldAction } from "@/types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

function isPlaceholder(): boolean {
  return !OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 10;
}

// ---------------------------------------------------------------------------
// OpenAI-compatible JSON Schema for structured output
// ---------------------------------------------------------------------------

interface JsonSchema {
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  description?: string;
}

const scaffoldActionSchema: JsonSchema = {
  type: "object",
  properties: {
    action_type: { type: "string", description: "One of: highlight_range, insert_after_paragraph, insert_divider_after_paragraph, append_section" },
    search_text: { type: "string", description: "For highlight_range: the exact verbatim text to highlight." },
    background_color: { type: "string", description: "Hex color (e.g., '#FFF176') for highlights or section styling." },
    category: { type: "string", description: "For highlight_range: what this highlight represents (topic_sentence, evidence, transition)." },
    paragraph_prefix: { type: "string", description: "For insert/divider actions: first 60+ characters of the target paragraph." },
    insert_content: { type: "string", description: "For insert_after_paragraph: the text content to insert." },
    label: { type: "string", description: "For insert_divider_after_paragraph: optional divider label text." },
    heading: { type: "string", description: "For append_section: the section heading." },
    content: { type: "string", description: "For append_section: the section body text." },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { term: { type: "string" }, definition: { type: "string" } },
        required: ["term", "definition"],
      },
      description: "For append_section word banks: term-definition pairs.",
    },
    section_style: { type: "string", description: "For append_section: one of word_bank, sentence_frames, translation." },
    style_italic: { type: "boolean" },
    style_bold: { type: "boolean" },
    style_font_size_pt: { type: "number" },
    style_text_color: { type: "string" },
  },
  required: ["action_type"],
};

function buildResponseSchema(includeWordBank: boolean, includeActions: boolean): JsonSchema {
  const properties: Record<string, JsonSchema> = {
    scaffolded_html: { type: "string", description: "The full scaffolded assignment as clean HTML with inline CSS styles." },
    scaffolds_used: { type: "array", items: { type: "string" }, description: "List of scaffold technique names applied." },
    teacher_instructions: { type: "string", description: "Brief instructions for the teacher (2-3 sentences)." },
  };
  const required = ["scaffolded_html", "scaffolds_used", "teacher_instructions"];

  if (includeWordBank) {
    properties.word_bank = {
      type: "array",
      items: {
        type: "object",
        properties: { term: { type: "string" }, definition: { type: "string" } },
        required: ["term", "definition"],
      },
      description: "Key vocabulary terms with simple definitions. 6-12 terms.",
    };
    required.push("word_bank");
  }

  if (includeActions) {
    properties.scaffold_actions = {
      type: "array",
      items: scaffoldActionSchema,
      description: "Structured scaffold modifications for the original Google Doc.",
    };
    required.push("scaffold_actions");
  }

  return { type: "object", properties, required };
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
  schema: JsonSchema | null,
): Promise<string> {
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  };

  if (schema) {
    body.response_format = {
      type: "json_schema",
      json_schema: { name: "scaffold_response", strict: false, schema },
    };
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

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
 * Strips redundant attributes (id, style on spans, data-*, empty spans)
 * while keeping semantic structure (p, h1-h6, table, img, ul, ol, li, b, i, u, a).
 * This can reduce token count by 60-80%.
 */
function slimHtml(html: string): string {
  let s = html;
  // Remove all id attributes
  s = s.replace(/\s+id="[^"]*"/gi, "");
  // Remove all style attributes (styles come from the stylesheet we re-attach)
  s = s.replace(/\s+style="[^"]*"/gi, "");
  // Remove data-* attributes
  s = s.replace(/\s+data-[a-z-]+="[^"]*"/gi, "");
  // Remove class attributes (we re-attach the stylesheet, but AI doesn't need them)
  s = s.replace(/\s+class="[^"]*"/gi, "");
  // Remove empty spans: <span>text</span> → text
  s = s.replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1");
  // Remove Google's tracking spans and links
  s = s.replace(/<a\s*>([\s\S]*?)<\/a>/gi, "$1");
  // Collapse multiple whitespace/newlines
  s = s.replace(/\n\s*\n/g, "\n");
  s = s.replace(/>\s+</g, "> <");
  return s.trim();
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

  // Strip sourceHtml from the AI call — Google Docs HTML is too large/bloated
  // and causes provider errors. The AI works from plain text instead.
  // sourceHtml is still used client-side for the original preview.
  params = { ...params, sourceHtml: undefined };

  const prompt = buildPrompt(params, includeWordBank, includeActions);
  const schema = buildResponseSchema(includeWordBank, includeActions);

  try {
    const text = await callOpenRouter(prompt, schema);
    const parsed = JSON.parse(text);

    let scaffoldedHtml = parsed.scaffolded_html as string;

    const scaffoldActions = (parsed.scaffold_actions as ScaffoldAction[]) || null;
    console.log("[OpenRouter] Generation complete:", {
      model: MODEL,
      includeActions,
      sourceDocId: params.sourceDocId || "(none)",
      scaffoldActionsReturned: scaffoldActions ? scaffoldActions.length : 0,
    });

    return {
      html: scaffoldedHtml,
      wordBank: parsed.word_bank || null,
      scaffoldsUsed: parsed.scaffolds_used || params.scaffoldNames,
      teacherInstructions: parsed.teacher_instructions || null,
      isDemo: false,
      scaffoldActions,
    };
  } catch (error) {
    console.error("[OpenRouter] Structured output failed, falling back:", error);

    // Fallback: no schema constraint, extract HTML from raw text
    try {
      const rawText = await callOpenRouter(prompt, null);
      let html = rawText;

      // Try parsing as JSON first
      try {
        const parsed = JSON.parse(html);
        html = parsed.scaffolded_html || html;
      } catch {
        // Not JSON — strip markdown code fences if present
        html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();
      }

      return {
        html,
        wordBank: null,
        scaffoldsUsed: params.scaffoldNames,
        teacherInstructions: null,
        isDemo: false,
        scaffoldActions: null,
      };
    } catch (fallbackError) {
      // Both attempts failed — re-throw original error
      console.error("[OpenRouter] Fallback also failed:", fallbackError);
      throw error;
    }
  }
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

  const htmlRules = sourceHtml
    ? `## Rules for scaffolded_html (CRITICAL — follow ALL of these)
- You are given a SIMPLIFIED version of the original Google Doc HTML below (attributes stripped to save space). Use it to understand the document structure and content.
- You MUST apply EVERY scaffold listed above. Do not skip any scaffold. Each one must be visibly present in the output.
- Reproduce the document content faithfully using clean semantic HTML (p, h1-h6, ul, ol, li, table, tr, td, b, i, u, a, img tags).
- PRESERVE all <img> tags and their src attributes exactly as given.
- For color coding scaffolds: wrap target text with <span style="background-color: #COLOR; padding: 2px 4px; border-radius: 2px;">text</span>.
- For translation scaffolds: translate ALL student-facing content. Translation IS the scaffold — replace the original language text while keeping scaffold labels in English.
- For word banks, sentence frames, and other appended sections: add them AFTER the document content.
- Use inline CSS styles throughout (the output will be wrapped with the original stylesheet separately).
- Wrap the entire output in a single <div> element`
    : `## Rules for scaffolded_html (CRITICAL — follow ALL of these)
- You MUST apply EVERY scaffold listed above. Do not skip any scaffold. Each one must be visibly present in the output.
- Preserve the original assignment structure and meaning — do not remove content or summarize
- EXCEPTION: If a bilingual/translation scaffold is requested, you MUST translate ALL student-facing content as that scaffold's instructions describe. Translation IS the scaffold — it replaces the original language for student-facing text while keeping scaffold labels in English.
- For color coding scaffolds: you MUST wrap the relevant text with the specified highlight colors. Identify topic sentences, evidence, and transitions throughout the ENTIRE document, not just the first paragraph. Every paragraph should have at least some highlighted text.
- Apply scaffolds by ADDING or MODIFYING HTML elements (highlights, section dividers, word banks, sentence frames, etc.) around or alongside the content
- Use inline CSS styles only (no class names that require external stylesheets)
- Wrap the entire output in a single <div> element`;

  return `You are an expert ELD (English Language Development) scaffolding specialist for California middle school teachers, aligned with the 2012 CA ELD Standards and ELA/ELD Framework.

## Context
${metaContext}

## CA ELD Framework Guidance for ${elLevel} Level
${eldContext}

## Instructions
Apply the following scaffold modifications to the assignment below. Follow each scaffold's instructions precisely.

### Scaffolds to Apply:
${scaffoldInstructions}

${htmlRules}
- Make the output clean, readable, and well-structured for printing
- Target the scaffolding complexity for ${elLevel}-level ELL students
- If a scaffold instruction says to add something "before" or "after" content, place it logically relative to the relevant section

${includeWordBank ? `## Rules for word_bank
- Select 6-12 academic or challenging vocabulary words from the assignment
- The word_bank field must ALWAYS be in English (terms and definitions), even when a bilingual translation scaffold is applied
- Definitions should be appropriate for the ${elLevel} EL level
- For Emerging: use simple, everyday language definitions
- For Expanding: use clear academic definitions
- For Bridging: focus on nuanced/domain-specific terms

` : ""}## Rules for teacher_instructions
- Brief (2-3 sentences) guidance on implementing the scaffolded assignment
- Include any verbal or physical scaffolds the teacher should add beyond the written scaffolds
${actionsSection}
${sourceHtml ? `## Original Assignment HTML (modify this in-place — preserve all tags, classes, and attributes):
${sourceHtml}

## Original Assignment Plain Text (for reference and scaffold_actions matching):
${originalContent}` : `## Original Assignment:
${originalContent}`}

IMPORTANT: Respond with valid JSON matching the required schema. Do not include any text outside the JSON object.`;
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
