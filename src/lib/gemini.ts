import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { getELDPromptContext } from "@/lib/eld-standards";
import type { ELLevel, ScaffoldGenerationResult } from "@/types";

const apiKey = process.env.GEMINI_API_KEY ?? "";

function isPlaceholder(): boolean {
  return !apiKey || apiKey === "placeholder_gemini_key" || apiKey.length < 10;
}

/** JSON schema for structured Gemini output */
const scaffoldResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    scaffolded_html: {
      type: SchemaType.STRING,
      description:
        "The full scaffolded assignment as clean HTML with inline CSS styles. Wrap in a single <div>.",
    },
    scaffolds_used: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description:
        "List of scaffold technique names that were actually applied.",
    },
    word_bank: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          term: { type: SchemaType.STRING },
          definition: { type: SchemaType.STRING },
        },
        required: ["term", "definition"],
      },
      description:
        "Key vocabulary terms with simple definitions appropriate for the EL level. 6-12 terms.",
    },
    teacher_instructions: {
      type: SchemaType.STRING,
      description:
        "Brief instructions for the teacher on how to use this scaffolded assignment (2-3 sentences).",
    },
  },
  required: [
    "scaffolded_html",
    "scaffolds_used",
    "word_bank",
    "teacher_instructions",
  ],
};

function getGeminiModel() {
  if (isPlaceholder()) {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: scaffoldResponseSchema,
    },
  });
}

export interface GenerateParams {
  originalContent: string;
  elLevel: ELLevel;
  scaffoldPrompts: string[];
  scaffoldNames: string[];
  title: string;
  subject?: string;
  gradeLevel?: number;
}

export async function generateScaffoldedAssignment(
  params: GenerateParams
): Promise<ScaffoldGenerationResult> {
  const model = getGeminiModel();

  if (!model) {
    return buildMockResult(params);
  }

  const prompt = buildPrompt(params);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return {
      html: parsed.scaffolded_html,
      wordBank: parsed.word_bank || null,
      scaffoldsUsed: parsed.scaffolds_used || params.scaffoldNames,
      teacherInstructions: parsed.teacher_instructions || null,
      isDemo: false,
    };
  } catch (error) {
    // If JSON parsing fails, try extracting HTML from raw text
    console.error("[Gemini] Structured output parsing failed, falling back:", error);

    const result = await getGeminiModelFallback()!.generateContent(prompt);
    let html = result.response.text();
    html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

    return {
      html,
      wordBank: null,
      scaffoldsUsed: params.scaffoldNames,
      teacherInstructions: null,
      isDemo: false,
    };
  }
}

/** Fallback model without JSON schema constraints */
function getGeminiModelFallback() {
  if (isPlaceholder()) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

function buildPrompt(params: GenerateParams): string {
  const {
    originalContent,
    elLevel,
    scaffoldPrompts,
    scaffoldNames,
    title,
    subject,
    gradeLevel,
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

  // Pull CA ELD Framework context for this level
  const eldContext = getELDPromptContext(elLevel);

  return `You are an expert ELD (English Language Development) scaffolding specialist for California middle school teachers, aligned with the 2012 CA ELD Standards and ELA/ELD Framework.

## Context
${metaContext}

## CA ELD Framework Guidance for ${elLevel} Level
${eldContext}

## Instructions
Apply the following scaffold modifications to the assignment below. Follow each scaffold's instructions precisely.

### Scaffolds to Apply:
${scaffoldInstructions}

## Rules for scaffolded_html
- Preserve ALL original assignment content — do not remove, summarize, or rewrite the text
- Apply scaffolds by ADDING HTML elements (highlights, section dividers, word banks, sentence frames, etc.) around or alongside the original content
- Use inline CSS styles only (no class names that require external stylesheets)
- Wrap the entire output in a single <div> element
- Make the output clean, readable, and well-structured for printing
- Target the scaffolding complexity for ${elLevel}-level ELL students
- If a scaffold instruction says to add something "before" or "after" content, place it logically relative to the relevant section

## Rules for word_bank
- Select 6-12 academic or challenging vocabulary words from the assignment
- Definitions should be appropriate for the ${elLevel} EL level
- For Emerging: use simple, everyday language definitions
- For Expanding: use clear academic definitions
- For Bridging: focus on nuanced/domain-specific terms

## Rules for teacher_instructions
- Brief (2-3 sentences) guidance on implementing the scaffolded assignment
- Include any verbal or physical scaffolds the teacher should add beyond the written scaffolds

## Original Assignment:
${originalContent}`;
}

function buildMockResult(params: GenerateParams): ScaffoldGenerationResult {
  const { originalContent, elLevel, scaffoldNames, title } = params;

  const scaffoldList = scaffoldNames
    .map((name) => `<li>${name}</li>`)
    .join("\n          ");

  const paragraphs = originalContent
    .split(/\n\n+/)
    .map(
      (p) =>
        `<p style="margin: 0.75rem 0; line-height: 1.7;">${p.trim()}</p>`
    )
    .join("\n      ");

  const html = `<div style="font-family: system-ui, sans-serif; max-width: 800px;">
    <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
      <strong style="color: #92400e;">Demo Preview</strong>
      <p style="margin: 0.5rem 0 0 0; color: #78350f; font-size: 0.875rem;">
        This is a demo preview. Connect your Gemini API key in <code>.env.local</code> for real AI scaffolding.
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

    <div style="border: 2px solid #2563eb; padding: 1.25rem; margin: 2rem 0; background: #eff6ff; border-radius: 8px;">
      <h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Word Bank (Demo)</h3>
      <div style="display: grid; gap: 0.5rem;">
        <div><strong style="color: #1e40af;">scaffold:</strong> A support structure to help with learning</div>
        <div><strong style="color: #1e40af;">differentiate:</strong> To make different versions for different needs</div>
        <div><strong style="color: #1e40af;">assignment:</strong> A task or piece of work given to a student</div>
      </div>
    </div>
  </div>`;

  return {
    html,
    wordBank: [
      { term: "scaffold", definition: "A support structure to help with learning" },
      { term: "differentiate", definition: "To make different versions for different needs" },
      { term: "assignment", definition: "A task or piece of work given to a student" },
    ],
    scaffoldsUsed: scaffoldNames,
    teacherInstructions:
      "This is a demo preview. Connect your Gemini API key for real scaffolding with teacher-specific instructions.",
    isDemo: true,
  };
}
