/**
 * California ELD/ELD Standards Reference Data (2012 CA ELD Standards & ELA/ELD Framework)
 *
 * Hardcoded scaffold strategies organized by proficiency level.
 * Used to auto-select scaffolds and enrich Gemini prompts with
 * level-appropriate CA ELD strategies.
 */

import type { ELLevel } from "@/types";

export interface ScaffoldStrategy {
  category: "visuals" | "language" | "activities";
  name: string;
  description: string;
}

export interface LevelProfile {
  level: ELLevel;
  label: string;
  supportIntensity: string;
  description: string;
  strategies: ScaffoldStrategy[];
  promptContext: string;
}

export const CA_ELD_LEVELS: Record<ELLevel, LevelProfile> = {
  Emerging: {
    level: "Emerging",
    label: "Emerging (Substantial Support)",
    supportIntensity: "substantial",
    description:
      "Students at this level need substantial scaffolding to access grade-level content. Focus on making input comprehensible through visuals, simplified language, and native language support.",
    strategies: [
      // Visuals
      {
        category: "visuals",
        name: "Pictures & Diagrams",
        description: "Use pictures, diagrams, gestures, realia, and videos to make content comprehensible",
      },
      // Language
      {
        category: "language",
        name: "Sentence Starters & Frames",
        description: 'Provide sentence starters/frames (e.g., "I see __ because __")',
      },
      {
        category: "language",
        name: "Word Banks",
        description: "Provide word banks with key vocabulary and simple definitions",
      },
      {
        category: "language",
        name: "Bilingual Glossaries",
        description: "Include bilingual glossaries for key academic terms",
      },
      {
        category: "language",
        name: "Modeled Talk",
        description: "Include examples of modeled academic talk and responses",
      },
      // Activities
      {
        category: "activities",
        name: "Simplified Texts",
        description: "Use simplified texts with shorter sentences and common vocabulary",
      },
      {
        category: "activities",
        name: "Audio Support",
        description: "Provide audio support or read-aloud instructions",
      },
      {
        category: "activities",
        name: "TPR (Total Physical Response)",
        description: "Incorporate physical movement and gestures to reinforce meaning",
      },
      {
        category: "activities",
        name: "Pre-taught Vocabulary",
        description: "Pre-teach key vocabulary with visuals before the assignment",
      },
      {
        category: "activities",
        name: "Think-Pair-Share with Visuals",
        description: "Structure collaborative discussion with visual supports",
      },
      {
        category: "activities",
        name: "Graphic Organizers",
        description: "Provide graphic organizers to structure thinking and writing",
      },
      {
        category: "activities",
        name: "Native Language Notes",
        description: "Allow students to take notes in their native language",
      },
    ],
    promptContext: `This student is at the EMERGING level of English proficiency and needs SUBSTANTIAL scaffolding support. Apply these CA ELD Framework strategies:
- Use visuals (pictures, diagrams, realia) to make content comprehensible
- Provide sentence starters and frames (e.g., "I see __ because __", "The main idea is __")
- Include a word bank with simple definitions for all academic vocabulary
- Simplify sentence structures — use shorter sentences and common vocabulary
- Add graphic organizers to structure thinking
- Allow native language notes where appropriate
- Pre-teach vocabulary with visual supports
The goal is making grade-level content ACCESSIBLE, not dumbing it down.`,
  },

  Expanding: {
    level: "Expanding",
    label: "Expanding (Moderate Support)",
    supportIntensity: "moderate",
    description:
      "Students at this level can engage with age-appropriate content with moderate scaffolding. Focus on building academic language and independent work skills.",
    strategies: [
      // Visuals/Language
      {
        category: "visuals",
        name: "Anchor Charts",
        description: "Use anchor charts summarizing key concepts and academic language",
      },
      {
        category: "language",
        name: "Word Maps",
        description: "Provide word maps connecting new vocabulary to known concepts",
      },
      {
        category: "language",
        name: "Sentence Unpacking",
        description: "Break down complex sentences to show how academic language works",
      },
      {
        category: "language",
        name: "Paragraph Jumbles",
        description: "Use paragraph jumbles to teach text organization",
      },
      // Activities
      {
        category: "activities",
        name: "Collaborative Text Reconstruction",
        description: "Reconstruct texts collaboratively to build language awareness",
      },
      {
        category: "activities",
        name: "Sorting Activities",
        description: "Sort and classify ideas, vocabulary, or text features",
      },
      {
        category: "activities",
        name: "Role-plays",
        description: "Use role-plays to practice academic language in context",
      },
      {
        category: "activities",
        name: "Peer Modeling",
        description: "Pair with peers who model academic language use",
      },
      {
        category: "activities",
        name: "Tiered Assignments",
        description: "Provide tiered options with varying levels of language complexity",
      },
      {
        category: "activities",
        name: "Modified Texts",
        description: "Use moderately modified texts with key vocabulary highlighted",
      },
      {
        category: "activities",
        name: "Think-Write-Pair-Share",
        description: "Add writing step before discussion to build confidence",
      },
      {
        category: "activities",
        name: "Gallery Walks",
        description: "Use gallery walks for collaborative analysis and feedback",
      },
    ],
    promptContext: `This student is at the EXPANDING level of English proficiency and needs MODERATE scaffolding support. Apply these CA ELD Framework strategies:
- Use anchor charts and word maps to build academic vocabulary
- Unpack complex sentences to show how academic language works
- Provide moderately modified text with key vocabulary highlighted
- Include sentence frames for academic discourse (not basic starters)
- Add tiered response options with varying language complexity
- Structure collaborative work (Think-Write-Pair-Share)
The goal is building ACADEMIC LANGUAGE proficiency while engaging with age-appropriate content.`,
  },

  Bridging: {
    level: "Bridging",
    label: "Bridging (Light Support)",
    supportIntensity: "light",
    description:
      "Students at this level are approaching grade-level independence. Focus on nuanced academic language, self-monitoring, and complex text structures.",
    strategies: [
      // Language
      {
        category: "language",
        name: "Complex Sentence Frames",
        description: 'Provide complex frames for cause-effect, comparison, and analysis (e.g., "Although __, the evidence suggests __")',
      },
      {
        category: "language",
        name: "Academic Discourse Posters",
        description: "Reference posters for academic discussion language",
      },
      {
        category: "language",
        name: "Nuanced Vocabulary",
        description: "Focus on nuanced, domain-specific vocabulary and register",
      },
      // Activities
      {
        category: "activities",
        name: "Peer Editing",
        description: "Structured peer editing with academic language feedback criteria",
      },
      {
        category: "activities",
        name: "Journals & Exit Tickets",
        description: "Use journals and exit tickets for self-reflection on language use",
      },
      {
        category: "activities",
        name: "Debates with Rubrics",
        description: "Structure debates with rubrics emphasizing academic register",
      },
      {
        category: "activities",
        name: "Self-Assessment",
        description: "Provide self-assessment checklists for academic language use",
      },
      {
        category: "activities",
        name: "Collaborative Writing",
        description: "Use collaborative writing (e.g., Google Docs) with structured roles",
      },
    ],
    promptContext: `This student is at the BRIDGING level of English proficiency and needs LIGHT scaffolding support. Apply these CA ELD Framework strategies:
- Provide complex sentence frames for academic analysis (cause-effect, comparison, argumentation)
- Focus on nuanced, domain-specific vocabulary rather than basic word banks
- Include self-assessment checklists for monitoring academic language use
- Add peer editing prompts with language-focused criteria
- Structure higher-order thinking activities (debates, analysis)
The goal is developing INDEPENDENCE with grade-level academic language and complex text structures.`,
  },
};

/**
 * Get the prompt context string for a given EL level.
 * Used to enrich Gemini prompts with level-appropriate CA ELD strategies.
 */
export function getELDPromptContext(level: ELLevel): string {
  return CA_ELD_LEVELS[level].promptContext;
}

/**
 * Get strategy names for a given EL level.
 */
export function getStrategiesForLevel(level: ELLevel): string[] {
  return CA_ELD_LEVELS[level].strategies.map((s) => s.name);
}
