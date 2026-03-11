import { createClient } from "@/lib/supabase";

const defaultScaffolds = [
  {
    name: "Color Coding: Main Ideas & Evidence",
    description:
      "Highlights topic sentences in yellow, evidence in green, transitions in blue",
    category: "color_coding",
    el_level_target: ["Emerging", "Expanding", "Bridging"],
    ai_prompt_template:
      'Color code text throughout the ENTIRE document, in EVERY paragraph from start to finish. Wrap topic sentences with <span style="background-color: #FFF176;">text</span> (yellow), evidence/supporting details with <span style="background-color: #AED581;">text</span> (green), and transition words/phrases with <span style="background-color: #90CAF9;">text</span> (blue). Every paragraph must have at least one highlighted element. Do NOT skip any paragraph.',
    is_default: true,
  },
  {
    name: "Chunking: Break Into Sections",
    description:
      "Divides text into 3-5 manageable sections with numbered headers",
    category: "chunking",
    el_level_target: ["Emerging", "Expanding"],
    ai_prompt_template:
      'Divide the assignment text into 3-5 logical chunks. Between each chunk, insert: <div class="chunk-header" style="font-weight: 600; margin: 1.5rem 0 0.5rem 0; padding: 0.75rem; background: #e5e7eb; border-left: 4px solid #2563eb; color: #1e40af;">Section X of Y</div>. Choose logical breaking points (after paragraphs, before new concepts).',
    is_default: true,
  },
  {
    name: "Sentence Frames",
    description:
      "Provides context-aware sentence starters tailored to each question type (opinion, summary, analysis, comparison, etc.)",
    category: "sentence_frames",
    el_level_target: ["Emerging", "Expanding"],
    ai_prompt_template:
      'For each question or writing prompt in the assignment, analyze what type of response it requires, then insert tailored sentence starters immediately before it using this HTML: <div class="sentence-frame" style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Sentence Starters:</strong><br/>[3-5 starters tailored to the specific question]</div>. Choose starters based on the question type — Opinion/argument ("Do you agree?", "What do you think?", "Should..."): use "I think ___ because ___.", "In my opinion, ___.", "I agree/disagree because ___.", "One reason I believe ___ is ___.", "The evidence shows ___."; Summary/main idea ("What is this text about?", "Summarize..."): use "The main idea is ___.", "This text is mostly about ___.", "First, ___. Then, ___. Finally, ___.", "The author explains ___.", "In summary, ___."; Analysis/evidence ("What does this show?", "How does...?", "Why did..."): use "According to the text, ___.", "This shows that ___.", "The evidence suggests ___.", "This is important because ___.", "___ happened because ___."; Comparison ("How are ___ and ___ similar/different?"): use "___ and ___ are similar because ___.", "Unlike ___, ___ is ___.", "Both ___ and ___ ___.", "One difference is ___.", "One similarity is ___."; Cause/effect ("What caused...?", "What happened as a result?"): use "___ happened because ___.", "As a result of ___, ___.", "This caused ___.", "The effect of ___ was ___."; If the question type is unclear, use: "Based on the text, ___.", "I noticed that ___.", "One example is ___.", "This is important because ___.", "I can conclude that ___." Always select the starters most relevant to the specific question — never use a generic one-size-fits-all set when the question clearly calls for a specific response type.',
    is_default: true,
  },
  {
    name: "Word Bank: Academic Vocabulary",
    description:
      "Identifies challenging words and provides simple definitions",
    category: "word_banks",
    el_level_target: ["Emerging", "Expanding", "Bridging"],
    ai_prompt_template:
      'Identify 8-12 academic or challenging vocabulary words in the assignment. At the bottom, create: <div class="word-bank" style="border: 2px solid #2563eb; padding: 1.25rem; margin: 2rem 0; background: #eff6ff; border-radius: 8px;"><h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Word Bank</h3><div style="display: grid; gap: 0.75rem;"><div><strong style="color: #1e40af;">Word:</strong> Simple definition for middle school ELL student</div></div></div>. Include only words that are challenging for the target EL level.',
    is_default: true,
  },
  {
    name: "Chunking: Paragraph-by-Paragraph",
    description:
      "Breaks long paragraphs into smaller, numbered chunks",
    category: "chunking",
    el_level_target: ["Emerging"],
    ai_prompt_template:
      'For each paragraph longer than 4 sentences, break it into smaller chunks of 2-3 sentences. Add a blank line between chunks to visually separate them.',
    is_default: true,
  },
  {
    name: "Visual Organizer: Venn Diagram Prompt",
    description:
      "Adds a simple text-based Venn diagram template for comparisons",
    category: "visual_organizers",
    el_level_target: ["Emerging", "Expanding"],
    ai_prompt_template:
      'If the assignment asks students to compare two things, insert after the prompt: <div style="border: 2px dashed #6b7280; padding: 1.5rem; margin: 1rem 0; background: #f9fafb;"><strong>Compare & Contrast:</strong><br/><br/><strong>Only in [Item A]:</strong><br/>- _____<br/>- _____<br/><br/><strong>Only in [Item B]:</strong><br/>- _____<br/>- _____<br/><br/><strong>Both have:</strong><br/>- _____<br/>- _____</div>',
    is_default: true,
    comingSoon: true,
  },
  {
    name: "Bilingual Support: Spanish Translation",
    description:
      "Translates assignment content to Spanish while keeping scaffold labels in English",
    category: "bilingual_support",
    el_level_target: ["Emerging", "Expanding", "Bridging"],
    ai_prompt_template:
      "Replace all English text in the document with its Spanish translation. Keep the exact same HTML structure and formatting — only change the text content. Keep proper nouns, names, and numbers unchanged. Do NOT add any extra sections, word banks, or content that was not in the original. The result should be the same document in Spanish.",
    is_default: true,
  },
];

export async function seedScaffoldTemplates(): Promise<{
  inserted: number;
  skipped: number;
}> {
  const supabase = createClient();

  // Check if scaffolds already exist
  const { count } = await supabase
    .from("scaffold_templates")
    .select("*", { count: "exact", head: true })
    .eq("is_default", true);

  if (count && count > 0) {
    return { inserted: 0, skipped: count };
  }

  const { data, error } = await supabase
    .from("scaffold_templates")
    .insert(defaultScaffolds)
    .select();

  if (error) throw error;

  return { inserted: data?.length ?? 0, skipped: 0 };
}

export { defaultScaffolds };
