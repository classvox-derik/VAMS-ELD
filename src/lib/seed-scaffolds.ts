import { createClient } from "@/lib/supabase";

const defaultScaffolds = [
  {
    name: "Color Coding: Main Ideas & Evidence",
    description:
      "Highlights topic sentences in yellow, evidence in green, transitions in blue",
    category: "color_coding",
    el_level_target: ["Emerging", "Expanding", "Bridging"],
    ai_prompt_template:
      'Apply HTML with inline styles: topic sentences get <span style="background-color: #FFF176; padding: 2px 4px; border-radius: 2px;">text</span>, evidence gets <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px;">text</span>, transition words get <span style="background-color: #90CAF9; padding: 2px 4px; border-radius: 2px;">text</span>. Identify and wrap appropriate text.',
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
    name: "Sentence Frames: Opinion Writing",
    description:
      "Provides sentence starters for opinion/argument responses",
    category: "sentence_frames",
    el_level_target: ["Emerging", "Expanding"],
    ai_prompt_template:
      'Before any writing prompt or question, insert: <div class="sentence-frame" style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Sentence Frames:</strong><br/>- I think ___ because ___.<br/>- In my opinion, ___.<br/>- I agree/disagree with ___ because ___.</div>',
    is_default: true,
  },
  {
    name: "Sentence Frames: Summary Writing",
    description: "Provides sentence starters for summarizing text",
    category: "sentence_frames",
    el_level_target: ["Emerging", "Expanding"],
    ai_prompt_template:
      'Before summary prompts, insert: <div class="sentence-frame" style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Sentence Frames:</strong><br/>- The main idea is ___.<br/>- First, ___. Then, ___. Finally, ___.<br/>- This text is about ___.</div>',
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
      "Translate ONLY the student-facing assignment content to Spanish — this includes the original assignment text, reading passages, questions, directions for students, and any text the student would read or respond to. DO NOT translate any teacher-facing or scaffold-generated elements. Keep ALL of the following in English: the assignment title, teacher instructions, scaffold labels and headings ('Word Bank', 'Sentence Frames:', 'Section X of Y', 'Compare & Contrast', 'Scaffolds Applied', etc.), section divider text, and Word Bank terms/definitions. Preserve all HTML structure, inline styles, and formatting. Keep proper nouns, names, and numbers unchanged. The translated student content should read naturally in Spanish. If a Word Bank section exists in the HTML, keep the original English word bank intact and add a second word bank directly below it with the heading 'Banco de Palabras' containing the same terms translated to Spanish with Spanish definitions.",
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
