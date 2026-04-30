export interface Update {
  version: string;
  date: string;
  description: string;
}

const updates: Update[] = [
  {
    version: "v1.7.3",
    date: "2026-04-30",
    description: "Database Update — Removed recently reclassified (RFEP) students from the database to keep rosters up to date.",
  },
  {
    version: "v1.7.2",
    date: "2026-03-20",
    description: "Fixed PDF import and export reliability — PDF uploads no longer fail silently on repeated use (resolved a memory leak in the parser). PDF downloads are now guaranteed to work on all deployments by pinning the PDF generation library as a direct dependency. Removed an unused legacy dependency (html2pdf.js).",
  },
  {
    version: "v1.7.1",
    date: "2026-03-20",
    description: "Fixed Parts of Speech color coding accuracy — the AI now follows strict grammatical rules to correctly identify nouns, verbs, and adjectives based on how each word functions in its sentence. Gerunds used as subjects (e.g., \"Swimming is fun\") are now correctly tagged as nouns instead of verbs. Words acting as adjectives (e.g., \"school\" in \"school bus\") are no longer mis-tagged as nouns. Adverbs like \"quickly\" are no longer confused with adjectives. Additionally, selecting a subset of word types (e.g., only Nouns and Adjectives) no longer causes the AI to highlight unselected types.",
  },
  {
    version: "v1.7.0",
    date: "2026-03-19",
    description: "Added Privacy Policy and Terms of Service pages — accessible from the footer. Required for Google OAuth compliance and user transparency.",
  },
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
