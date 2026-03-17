export interface Update {
  version: string;
  date: string;
  description: string;
}

const updates: Update[] = [
  {
    version: "v1.6.0",
    date: "2026-03-17",
    description: "Color Coding scaffold enhanced — choose between \"Parts of Speech\" mode (nouns, verbs, adjectives, vocabulary words) or \"Easier to Read\" mode (main ideas, evidence, transitions). In Parts of Speech mode, select exactly which word types to highlight.",
  },
  {
    version: "v1.5.0",
    date: "2026-03-11",
    description: "Chunking scaffold updated — now intelligently adapts section count to document length and breaks long paragraphs within sections. Available for all EL levels.",
  },
  {
    version: "v1.4.0",
    date: "2026-03-11",
    description: "Sentence Frames scaffold updated — now generates context-aware starters tailored to each specific question type (opinion, summary, analysis, comparison, cause/effect) instead of generic frames.",
  },
  {
    version: "v1.3.0",
    date: "2026-03-11",
    description: "Library now stores up to 50 saved generations per teacher. When the limit is reached, the oldest entry is automatically removed to make room for new ones.",
  },
  {
    version: "v1.2.0",
    date: "2026-03-10",
    description: "AI model upgraded to Claude Haiku 4.5 — faster generation with improved accuracy and better ELD scaffolding quality.",
  },
  {
    version: "v1.1.0",
    date: "2026-03-02",
    description: "Added ELPAC Test Schedule page — view the live testing schedule directly from the sidebar.",
  },
  {
    version: "v1.0.0",
    date: "2026-03-01",
    description: "Initial release — dashboard, student management, AI-powered scaffold generation, and assignment library.",
  },
];

export default updates;
