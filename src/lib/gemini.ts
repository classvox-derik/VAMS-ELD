import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ELLevel } from "@/types";

const apiKey = process.env.GEMINI_API_KEY ?? "";

function isPlaceholder(): boolean {
  return !apiKey || apiKey === "placeholder_gemini_key" || apiKey.length < 10;
}

export function getGeminiModel() {
  if (isPlaceholder()) {
    console.warn(
      "[Gemini] Using placeholder API key. AI generation will return mock results."
    );
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

interface GenerateParams {
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
): Promise<{ html: string; isDemo: boolean }> {
  const model = getGeminiModel();

  if (!model) {
    return { html: buildMockHtml(params), isDemo: true };
  }

  const prompt = buildPrompt(params);

  const result = await model.generateContent(prompt);
  const response = result.response;
  let html = response.text();

  // Strip markdown code fences if Gemini wraps the output
  html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

  return { html, isDemo: false };
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

  return `You are an expert ELD (English Language Development) scaffolding specialist for middle school teachers. Your job is to take an assignment and apply specific scaffolding modifications to make it more accessible for English Language Learners.

## Context
${metaContext}

## Instructions
Apply the following scaffold modifications to the assignment below. Follow each scaffold's instructions precisely. Return ONLY the scaffolded HTML — no explanations, no markdown, no code fences.

### Scaffolds to Apply:
${scaffoldInstructions}

## Rules
- Preserve ALL original assignment content — do not remove, summarize, or rewrite the text
- Apply scaffolds by ADDING HTML elements (highlights, section dividers, word banks, sentence frames, etc.) around or alongside the original content
- Use inline CSS styles only (no class names that require external stylesheets)
- Wrap the entire output in a single <div> element
- Make the output clean, readable, and well-structured
- Target the scaffolding complexity for ${elLevel}-level ELL students
- If a scaffold instruction says to add something "before" or "after" content, place it logically relative to the relevant section

## Original Assignment:
${originalContent}`;
}

function buildMockHtml(params: GenerateParams): string {
  const { originalContent, elLevel, scaffoldNames, title } = params;

  const scaffoldList = scaffoldNames
    .map((name) => `<li>${name}</li>`)
    .join("\n          ");

  // Wrap original content paragraphs
  const paragraphs = originalContent
    .split(/\n\n+/)
    .map(
      (p) =>
        `<p style="margin: 0.75rem 0; line-height: 1.7;">${p.trim()}</p>`
    )
    .join("\n      ");

  return `<div style="font-family: system-ui, sans-serif; max-width: 800px;">
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
}
