"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Layers,
  Palette,
  LayoutList,
  MessageSquareText,
  BookA,
  Network,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  CheckCircle2,
  Target,
  Lightbulb,
  Copy,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Reusable Components                                                */
/* ------------------------------------------------------------------ */

function Collapsible({
  title,
  children,
  defaultOpen = false,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-eld-almond-silk/40 dark:border-gray-700/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 md:px-5 md:py-4 text-left font-semibold text-foreground hover:bg-eld-almond-silk/10 dark:hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-eld-almond-silk/30 dark:bg-eld-dusty-grape/30">
              <Icon className="h-4 w-4 text-eld-space-indigo dark:text-eld-almond-silk" />
            </div>
          )}
          <span className="text-sm md:text-base">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-eld-almond-silk/30 dark:border-gray-700/40 px-4 py-4 md:px-5 md:py-5 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}

function InfoBanner({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning" | "success";
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-300",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300",
    success:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-300",
  };

  const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle2,
  };

  const IconComponent = icons[variant];

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${styles[variant]}`}
    >
      <IconComponent className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-lg md:text-xl font-bold text-foreground ${className}`}
    >
      {children}
    </h2>
  );
}

function CopyableTemplate({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-eld-almond-silk/40 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-eld-almond-silk/20 hover:text-foreground dark:border-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-700"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
      <pre className="whitespace-pre-wrap rounded-xl border border-eld-almond-silk/30 bg-eld-almond-silk/10 p-4 pr-24 text-xs leading-relaxed text-muted-foreground dark:border-gray-700/40 dark:bg-white/[0.02]">
        {content}
      </pre>
    </div>
  );
}

function LevelBadge({ level }: { level: "Emerging" | "Expanding" | "Bridging" }) {
  const styles = {
    Emerging:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Expanding:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Bridging:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Scaffold Example Preview                                           */
/* ------------------------------------------------------------------ */

function ExamplePreview({
  title,
  html,
}: {
  title: string;
  html: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        {title}
      </p>
      <div
        className="rounded-xl border border-eld-almond-silk/30 bg-white p-4 text-sm leading-relaxed text-foreground dark:border-gray-700/40 dark:bg-white/[0.02]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scaffold Section Component                                         */
/* ------------------------------------------------------------------ */

function ScaffoldSection({
  icon: Icon,
  title,
  description,
  whenToUse,
  exampleBefore,
  exampleAfter,
  template,
  tips,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  whenToUse: string[];
  exampleBefore: string;
  exampleAfter: string;
  template: string;
  tips: string[];
}) {
  return (
    <Collapsible title={title} icon={Icon} defaultOpen={false}>
      <div className="space-y-5">
        {/* Description */}
        <div>
          <p className="text-sm leading-relaxed">{description}</p>
        </div>

        {/* When to Use */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target className="h-4 w-4 text-eld-space-indigo dark:text-eld-almond-silk" />
            When to Use
          </h4>
          <ul className="space-y-1.5">
            {whenToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Example */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-eld-space-indigo dark:text-eld-almond-silk" />
            Example
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <ExamplePreview title="Before (Original)" html={exampleBefore} />
            <ExamplePreview title="After (Scaffolded)" html={exampleAfter} />
          </div>
        </div>

        {/* Teacher Template */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Copy className="h-4 w-4 text-eld-space-indigo dark:text-eld-almond-silk" />
            Teacher Template (Copy &amp; Use)
          </h4>
          <p className="mb-3 text-xs text-muted-foreground/70">
            Copy this template to create your own scaffolded materials without the AI tool.
          </p>
          <CopyableTemplate content={template} />
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <InfoBanner variant="info">
            <strong>Tips:</strong>
            <ul className="mt-1 space-y-1">
              {tips.map((tip, i) => (
                <li key={i}>- {tip}</li>
              ))}
            </ul>
          </InfoBanner>
        )}
      </div>
    </Collapsible>
  );
}

/* ================================================================== */
/*  EMERGING TAB                                                       */
/* ================================================================== */

function EmergingTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-l-4 border-red-400 bg-red-50/50 p-4 dark:border-red-500 dark:bg-red-900/10">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-red-800 dark:text-red-300">
            Emerging Level — Substantial Support
          </h3>
          <LevelBadge level="Emerging" />
        </div>
        <p className="text-sm text-red-700/80 dark:text-red-300/70">
          Students at this level need the most scaffolding. All five scaffold
          categories should be used extensively. Focus on making input
          comprehensible through visuals, simplified language, and structured
          supports. Use shorter sentences, bilingual glossaries, and heavy
          graphic organizer support.
        </p>
      </div>

      <SectionHeading>All Scaffolds for Emerging Students</SectionHeading>

      <div className="space-y-4">
        {/* Color Coding */}
        <ScaffoldSection
          icon={Palette}
          title="Color Coding: Main Ideas & Evidence"
          description="Color coding helps Emerging students visually distinguish between different parts of a text — topic sentences, supporting evidence, and transitions. At this level, use bold, high-contrast highlighting and limit to 2-3 colors to avoid overwhelming students."
          whenToUse={[
            "Reading passages with main ideas and supporting details",
            "Informational texts where students need to identify text structure",
            "Before asking students to write their own paragraphs (model the structure)",
            "When students struggle to distinguish between key ideas and supporting details",
          ]}
          exampleBefore={`<p>The water cycle is a continuous process that moves water through the environment. First, the sun heats water in oceans and lakes, causing it to evaporate into the air. Then, the water vapor rises and cools, forming clouds through condensation. Finally, when the clouds become heavy enough, precipitation falls as rain or snow back to Earth.</p>`}
          exampleAfter={`<p><span style="background-color: #FFF176; padding: 2px 4px; border-radius: 2px; color: #000;">The water cycle is a continuous process that moves water through the environment.</span> <span style="background-color: #90CAF9; padding: 2px 4px; border-radius: 2px; color: #000;">First,</span> the sun heats water in oceans and lakes, causing it to <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px; color: #000;">evaporate into the air.</span> <span style="background-color: #90CAF9; padding: 2px 4px; border-radius: 2px; color: #000;">Then,</span> the water vapor rises and cools, <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px; color: #000;">forming clouds through condensation.</span> <span style="background-color: #90CAF9; padding: 2px 4px; border-radius: 2px; color: #000;">Finally,</span> when the clouds become heavy enough, <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px; color: #000;">precipitation falls as rain or snow back to Earth.</span></p><p style="margin-top: 12px; font-size: 0.8rem; color: #555;"><strong>Key:</strong> <span style="background-color: #FFF176; padding: 2px 6px; border-radius: 2px;">Yellow = Main Idea</span>&nbsp; <span style="background-color: #AED581; padding: 2px 6px; border-radius: 2px;">Green = Evidence/Details</span>&nbsp; <span style="background-color: #90CAF9; padding: 2px 6px; border-radius: 2px;">Blue = Transitions</span></p>`}
          template={`COLOR CODING TEMPLATE — Emerging Level
==========================================

Instructions: Highlight or underline using these colors:
  - YELLOW = Main Idea (the most important sentence)
  - GREEN  = Evidence / Supporting Details
  - BLUE   = Transition Words (First, Then, Finally, etc.)

Title: _______________________________________

Passage:
[Paste or write your passage here]

Student Task:
1. Read the passage one time all the way through.
2. Find the MAIN IDEA sentence. Highlight it YELLOW.
3. Find EVIDENCE or DETAILS. Highlight them GREEN.
4. Find TRANSITION WORDS. Highlight them BLUE.

Reflection:
- The main idea is: ___________________________
- One detail that supports it is: ______________`}
          tips={[
            "Limit to 2-3 colors maximum for Emerging students",
            "Always include a color key at the bottom of the page",
            "Model the first highlight together as a class before independent work",
            "Consider providing pre-highlighted examples first, then have students try on a new passage",
          ]}
        />

        {/* Chunking: Break Into Sections */}
        <ScaffoldSection
          icon={LayoutList}
          title="Chunking: Break Into Sections"
          description="Chunking divides a long text or assignment into 3-5 smaller, numbered sections with clear headers. For Emerging students, use very short chunks (2-3 sentences each) with visual dividers and pause prompts. This prevents cognitive overload and helps students process text in manageable pieces."
          whenToUse={[
            "Any reading passage longer than one paragraph",
            "Multi-step assignments or directions",
            "Texts with dense academic vocabulary",
            "When students shut down or skip parts of longer assignments",
          ]}
          exampleBefore={`<p>The American Revolution began because the colonists were unhappy with British rule. They had to pay taxes but had no voice in the British government. Groups like the Sons of Liberty organized protests. The Boston Tea Party in 1773 was one of the most famous protests, where colonists dumped tea into Boston Harbor. The British responded with harsh laws called the Intolerable Acts, which made the colonists even angrier. Eventually, fighting broke out at Lexington and Concord in 1775, beginning the war.</p>`}
          exampleAfter={`<div style="font-weight: 600; margin: 0 0 0.5rem 0; padding: 0.75rem; background: #e5e7eb; border-left: 4px solid #2563eb; color: #1e40af; border-radius: 4px;">Section 1 of 3: Why Were the Colonists Unhappy?</div><p>The American Revolution began because the colonists were unhappy with British rule. They had to pay taxes but had no voice in the British government.</p><div style="margin: 0.75rem 0; padding: 0.5rem; background: #fef3c7; border-left: 3px solid #f59e0b; font-size: 0.875rem; font-weight: 500; border-radius: 4px;">&#9208; Pause here. Re-read Section 1 before continuing.</div><div style="font-weight: 600; margin: 1.5rem 0 0.5rem 0; padding: 0.75rem; background: #e5e7eb; border-left: 4px solid #2563eb; color: #1e40af; border-radius: 4px;">Section 2 of 3: Protests and Reactions</div><p>Groups like the Sons of Liberty organized protests. The Boston Tea Party in 1773 was one of the most famous protests, where colonists dumped tea into Boston Harbor. The British responded with harsh laws called the Intolerable Acts.</p><div style="margin: 0.75rem 0; padding: 0.5rem; background: #fef3c7; border-left: 3px solid #f59e0b; font-size: 0.875rem; font-weight: 500; border-radius: 4px;">&#9208; Pause here. Re-read Section 2 before continuing.</div><div style="font-weight: 600; margin: 1.5rem 0 0.5rem 0; padding: 0.75rem; background: #e5e7eb; border-left: 4px solid #2563eb; color: #1e40af; border-radius: 4px;">Section 3 of 3: The War Begins</div><p>The colonists became even angrier. Eventually, fighting broke out at Lexington and Concord in 1775, beginning the war.</p>`}
          template={`CHUNKING TEMPLATE — Emerging Level
==========================================

Instructions: Break the text into 3-5 short sections.
Add a header and pause prompt after each section.

Title: _______________________________________

┌──────────────────────────────────────────┐
│ Section 1 of ___:  [Section Title]       │
├──────────────────────────────────────────┤
│                                          │
│ [Paste 2-3 sentences here]              │
│                                          │
│ >> PAUSE: Re-read Section 1 before      │
│    continuing.                           │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Section 2 of ___:  [Section Title]       │
├──────────────────────────────────────────┤
│                                          │
│ [Paste 2-3 sentences here]              │
│                                          │
│ >> PAUSE: Re-read Section 2 before      │
│    continuing.                           │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Section 3 of ___:  [Section Title]       │
├──────────────────────────────────────────┤
│                                          │
│ [Paste 2-3 sentences here]              │
│                                          │
│ >> PAUSE: Re-read Section 3 before      │
│    continuing.                           │
└──────────────────────────────────────────┘

Check-In Questions:
1. What was Section 1 about? _______________
2. What was Section 2 about? _______________
3. What was Section 3 about? _______________`}
          tips={[
            "For Emerging students, keep chunks to 2-3 sentences maximum",
            "Add a short descriptive title to each section header",
            "Include pause/re-read prompts between every section",
            "Consider adding a simple check-in question after each chunk",
          ]}
        />

        {/* Chunking: Paragraph-by-Paragraph */}
        <ScaffoldSection
          icon={LayoutList}
          title="Chunking: Paragraph-by-Paragraph"
          description="This scaffold breaks individual long paragraphs into smaller pieces of 2-3 sentences each. Specifically designed for Emerging students who struggle with paragraphs longer than 4 sentences. Adds visual pause markers between chunks to encourage re-reading."
          whenToUse={[
            "When a passage has paragraphs longer than 4 sentences",
            "Textbook readings with dense paragraphs",
            "Test prep passages that use long, complex paragraphs",
            "When students consistently lose track of meaning in long paragraphs",
          ]}
          exampleBefore={`<p>Photosynthesis is the process by which plants make their own food using sunlight. Plants take in carbon dioxide from the air through tiny holes in their leaves called stomata. They also absorb water from the soil through their roots. The chlorophyll in the leaves captures energy from sunlight. This energy is used to combine the carbon dioxide and water to make glucose, which is a type of sugar the plant uses for food. Oxygen is released as a byproduct, which is what humans and animals breathe.</p>`}
          exampleAfter={`<p>Photosynthesis is the process by which plants make their own food using sunlight. Plants take in carbon dioxide from the air through tiny holes in their leaves called stomata.</p><div style="margin: 0.75rem 0; padding: 0.5rem; background: #fef3c7; border-left: 3px solid #f59e0b; font-size: 0.875rem; font-weight: 500; border-radius: 4px;">&#9208; Pause here and re-read before continuing.</div><p>They also absorb water from the soil through their roots. The chlorophyll in the leaves captures energy from sunlight.</p><div style="margin: 0.75rem 0; padding: 0.5rem; background: #fef3c7; border-left: 3px solid #f59e0b; font-size: 0.875rem; font-weight: 500; border-radius: 4px;">&#9208; Pause here and re-read before continuing.</div><p>This energy is used to combine the carbon dioxide and water to make glucose, which is a type of sugar the plant uses for food. Oxygen is released as a byproduct, which is what humans and animals breathe.</p>`}
          template={`PARAGRAPH-BY-PARAGRAPH CHUNKING — Emerging Level
=================================================

Instructions: Break any paragraph longer than 4 sentences
into chunks of 2-3 sentences. Add a pause between each.

Original paragraph topic: ________________________

Chunk 1:
_________________________________________________
_________________________________________________
[2-3 sentences]

>> PAUSE and re-read Chunk 1.
   What is this chunk about? ____________________

Chunk 2:
_________________________________________________
_________________________________________________
[2-3 sentences]

>> PAUSE and re-read Chunk 2.
   What is this chunk about? ____________________

Chunk 3:
_________________________________________________
_________________________________________________
[2-3 sentences]

>> PAUSE and re-read Chunk 3.
   What is this chunk about? ____________________

Put it all together:
The whole paragraph is about ____________________`}
          tips={[
            "This is especially effective for Emerging students who need even smaller chunks than the section-based chunking",
            "Pair with a word bank for challenging vocabulary in each chunk",
            "Have students summarize each chunk in their own words (or native language) before moving on",
          ]}
        />

        {/* Sentence Frames: Opinion Writing */}
        <ScaffoldSection
          icon={MessageSquareText}
          title="Sentence Frames: Opinion Writing"
          description="Provides fill-in-the-blank sentence starters that guide Emerging students through structuring an opinion or argument response. At this level, frames should be simple, using common vocabulary and clear structures. Provide multiple options so students can choose the frame that best fits their idea."
          whenToUse={[
            "Any prompt asking students to state an opinion or take a position",
            "Argumentative or persuasive writing assignments",
            "Discussion preparation before Socratic seminars or class debates",
            "When students can verbally express an opinion but struggle to write it",
          ]}
          exampleBefore={`<p><strong>Writing Prompt:</strong> Do you think schools should have a longer summer break? Write a paragraph explaining your opinion and give at least two reasons.</p>`}
          exampleAfter={`<p><strong>Writing Prompt:</strong> Do you think schools should have a longer summer break? Write a paragraph explaining your opinion and give at least two reasons.</p><div style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Sentence Frames to Help You:</strong><br/><br/>&#x2022; I think ____________ because ____________.<br/><br/>&#x2022; In my opinion, ____________.<br/><br/>&#x2022; One reason I believe this is ____________.<br/><br/>&#x2022; Another reason is ____________.<br/><br/>&#x2022; I agree / disagree with ____________ because ____________.</div>`}
          template={`SENTENCE FRAMES: OPINION WRITING — Emerging Level
===================================================

Topic / Prompt: __________________________________
_________________________________________________

Sentence Frames (choose the ones that help you):

1. I think _____________ because _____________.

2. In my opinion, _____________.

3. One reason I believe this is _____________.

4. Another reason is _____________.

5. I agree / disagree with _________ because _________.

6. For example, _____________.

7. This is important because _____________.

My Opinion Paragraph:
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________

Checklist:
[ ] I stated my opinion clearly.
[ ] I gave at least two reasons.
[ ] I used at least one sentence frame.`}
          tips={[
            "Read the frames aloud with students before they write",
            "Allow students to draft ideas in their native language first, then use frames to write in English",
            "Model completing one frame together as a class before independent work",
            "Display sentence frames on a poster or anchor chart for ongoing reference",
          ]}
        />

        {/* Sentence Frames: Summary Writing */}
        <ScaffoldSection
          icon={MessageSquareText}
          title="Sentence Frames: Summary Writing"
          description="Provides structured sentence starters specifically for summarizing a text. Emerging students often retell every detail; these frames guide them to identify and state only the main ideas and key details in a logical order."
          whenToUse={[
            "After reading any informational or narrative text",
            "Summarizing a lesson, video, or experiment",
            "When students retell too many details or miss the main idea",
            "Close reading activities that require identifying central ideas",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Summarize the article about the water cycle in 3-4 sentences.</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Summarize the article about the water cycle in 3-4 sentences.</p><div style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Sentence Frames to Help You:</strong><br/><br/>&#x2022; The main idea of this text is ____________.<br/><br/>&#x2022; First, ____________. Then, ____________. Finally, ____________.<br/><br/>&#x2022; This text is mostly about ____________.<br/><br/>&#x2022; One important detail is ____________.<br/><br/>&#x2022; In conclusion, ____________.</div>`}
          template={`SENTENCE FRAMES: SUMMARY WRITING — Emerging Level
===================================================

Text / Topic being summarized: ___________________
_________________________________________________

Sentence Frames (choose the ones that help you):

1. The main idea of this text is _____________.

2. This text is mostly about _____________.

3. First, _____________. Then, _____________.
   Finally, _____________.

4. One important detail is _____________.

5. Another important detail is _____________.

6. In conclusion, _____________.

My Summary:
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________

Checklist:
[ ] I stated the main idea.
[ ] I included 2-3 key details (not every detail).
[ ] My summary is in my own words.
[ ] My summary makes sense if someone didn't read
    the original text.`}
          tips={[
            "Teach the difference between 'retelling everything' and 'summarizing the main idea' explicitly",
            "Have students underline or highlight the main idea in the original text before summarizing",
            "The 'First, Then, Finally' frame works especially well for sequential/narrative texts",
          ]}
        />

        {/* Word Banks */}
        <ScaffoldSection
          icon={BookA}
          title="Word Bank: Academic Vocabulary"
          description="A word bank provides 8-12 challenging academic or domain-specific vocabulary words with simple, student-friendly definitions. For Emerging students, definitions should use the simplest possible language, and consider including native language translations or picture cues when possible."
          whenToUse={[
            "Any text with academic or domain-specific vocabulary",
            "Before students read a new passage or chapter",
            "Writing assignments where students need to use specific terminology",
            "Science, social studies, and math assignments with technical terms",
          ]}
          exampleBefore={`<p>Read the passage about ecosystems and answer the questions.</p><p>An ecosystem is a community of living organisms interacting with their physical environment. Producers, such as plants, convert sunlight into energy through photosynthesis. Consumers eat producers or other consumers to obtain energy. Decomposers break down dead organisms and recycle nutrients back into the soil.</p>`}
          exampleAfter={`<p>Read the passage about ecosystems and answer the questions.</p><p>An ecosystem is a community of living organisms interacting with their physical environment. Producers, such as plants, convert sunlight into energy through photosynthesis. Consumers eat producers or other consumers to obtain energy. Decomposers break down dead organisms and recycle nutrients back into the soil.</p><div style="border: 2px solid #2563eb; padding: 1.25rem; margin: 1.5rem 0; background: #eff6ff; border-radius: 8px;"><h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Word Bank</h3><div style="display: grid; gap: 0.75rem;"><div><strong style="color: #1e40af;">Ecosystem:</strong> A place where living things and non-living things work together</div><div><strong style="color: #1e40af;">Organism:</strong> Any living thing (plant, animal, bacteria)</div><div><strong style="color: #1e40af;">Producers:</strong> Living things that make their own food (like plants)</div><div><strong style="color: #1e40af;">Consumers:</strong> Living things that eat other living things for energy</div><div><strong style="color: #1e40af;">Decomposers:</strong> Living things that break down dead plants and animals</div><div><strong style="color: #1e40af;">Photosynthesis:</strong> How plants use sunlight to make food</div><div><strong style="color: #1e40af;">Nutrients:</strong> Good things in food and soil that help living things grow</div><div><strong style="color: #1e40af;">Environment:</strong> Everything around a living thing (air, water, soil)</div></div></div>`}
          template={`WORD BANK — Emerging Level
==========================================

Subject: ____________  Topic: _______________

Instructions: Use this word bank while you read.
Look at the words and definitions BEFORE you read.

┌──────────────────┬───────────────────────────┐
│ Word             │ What It Means             │
├──────────────────┼───────────────────────────┤
│ 1. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 2. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 3. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 4. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 5. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 6. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 7. _____________ │ _________________________ │
│                  │ _________________________ │
├──────────────────┼───────────────────────────┤
│ 8. _____________ │ _________________________ │
│                  │ _________________________ │
└──────────────────┴───────────────────────────┘

Practice: Use 3 words from the word bank in your
own sentences.

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________`}
          tips={[
            "Pre-teach the word bank before students encounter the text — don't just hand it out",
            "Use the simplest possible definitions (imagine explaining to a younger sibling)",
            "Include pictures or drawings next to words when possible",
            "Consider adding native language translations for newcomer students",
            "Limit to 8-12 words to avoid overwhelming students",
          ]}
        />

        {/* Visual Organizers */}
        <ScaffoldSection
          icon={Network}
          title="Visual Organizer: Venn Diagram"
          description="A text-based Venn diagram template for comparing and contrasting two items. For Emerging students, include clear labels, simple instructions, and pre-written category headers. This graphic organizer helps students organize their thinking before writing a compare/contrast response."
          whenToUse={[
            "Any assignment asking students to compare or contrast two things",
            "Reading two related texts and finding similarities/differences",
            "Science comparisons (e.g., plant vs. animal cells)",
            "Social studies comparisons (e.g., two historical figures, two civilizations)",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Compare and contrast the American Revolution and the French Revolution. How were they similar? How were they different?</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Compare and contrast the American Revolution and the French Revolution. How were they similar? How were they different?</p><div style="border: 2px dashed #6b7280; padding: 1.5rem; margin: 1rem 0; background: #f9fafb; border-radius: 8px;"><strong>Compare &amp; Contrast Organizer:</strong><br/><br/><strong>Only the American Revolution:</strong><br/>- _____<br/>- _____<br/>- _____<br/><br/><strong>Only the French Revolution:</strong><br/>- _____<br/>- _____<br/>- _____<br/><br/><strong>Both Revolutions:</strong><br/>- _____<br/>- _____<br/>- _____</div>`}
          template={`VENN DIAGRAM / COMPARE & CONTRAST — Emerging Level
===================================================

Topic: ________________ vs. ____________________

┌─────────────────────────────────────────────────┐
│                                                 │
│  Only [Item A]: _______________                 │
│                                                 │
│  1. ________________________________________    │
│  2. ________________________________________    │
│  3. ________________________________________    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  BOTH (Similar):                                │
│                                                 │
│  1. ________________________________________    │
│  2. ________________________________________    │
│  3. ________________________________________    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Only [Item B]: _______________                 │
│                                                 │
│  1. ________________________________________    │
│  2. ________________________________________    │
│  3. ________________________________________    │
│                                                 │
└─────────────────────────────────────────────────┘

Now write a sentence using this frame:
"_______ and _______ are similar because _______,
 but they are different because _______________."

_________________________________________________
_________________________________________________`}
          tips={[
            "Model filling in one section together as a class before independent work",
            "Pair this organizer with sentence frames for writing the compare/contrast paragraph",
            "Allow students to draw pictures in addition to writing words",
            "For newcomers, allow native language notes in the organizer first, then translate to English",
          ]}
        />

        {/* Visual Organizer: Main Idea Map */}
        <ScaffoldSection
          icon={Network}
          title="Visual Organizer: Main Idea & Details Map"
          description="A graphic organizer that helps Emerging students identify the main idea of a text and find 3 supporting details. This is especially useful for informational texts where students need to distinguish central ideas from supporting evidence."
          whenToUse={[
            "After reading informational text passages",
            "Before writing a summary",
            "When students need help identifying what the text is mostly about",
            "Close reading activities focused on central ideas and key details",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Read the article about recycling. What is the main idea? What are three supporting details?</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Read the article about recycling. What is the main idea? What are three supporting details?</p><div style="border: 2px solid #8b5cf6; padding: 1.5rem; margin: 1rem 0; background: #f5f3ff; border-radius: 8px;"><strong style="color: #6d28d9;">Main Idea &amp; Details Map</strong><br/><br/><div style="text-align: center; padding: 0.75rem; background: #ede9fe; border-radius: 6px; border: 1px solid #c4b5fd; font-weight: 600;">Main Idea: What is this text MOSTLY about?<br/>______________________________________</div><br/><div style="display: grid; gap: 0.75rem;"><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #ddd8fe;">Detail 1: ______________________________________</div><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #ddd8fe;">Detail 2: ______________________________________</div><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #ddd8fe;">Detail 3: ______________________________________</div></div></div>`}
          template={`MAIN IDEA & DETAILS MAP — Emerging Level
==========================================

Text / Article Title: ___________________________

Step 1: Read the text.
Step 2: Answer the questions below.

┌─────────────────────────────────────────────┐
│          MAIN IDEA                          │
│                                             │
│ What is this text MOSTLY about?             │
│                                             │
│ ________________________________________    │
│ ________________________________________    │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Detail 1│ │Detail 2│ │Detail 3│
│        │ │        │ │        │
│________│ │________│ │________│
│________│ │________│ │________│
│________│ │________│ │________│
└────────┘ └────────┘ └────────┘

Now write a summary using this frame:
"This text is mostly about _____________.
 One detail is _________________________.
 Another detail is ____________________.
 Finally, _____________________________."

_________________________________________________
_________________________________________________
_________________________________________________`}
          tips={[
            "Have students state the main idea verbally before writing it down",
            "Remind students: the main idea is NOT a detail — it is what ALL the details are about",
            "This pairs well with the summary sentence frames scaffold",
            "For extra support, give students 5 details to choose from (2 correct, 3 distractors)",
          ]}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  EXPANDING TAB                                                      */
/* ================================================================== */

function ExpandingTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-l-4 border-orange-400 bg-orange-50/50 p-4 dark:border-orange-500 dark:bg-orange-900/10">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-orange-800 dark:text-orange-300">
            Expanding Level — Moderate Support
          </h3>
          <LevelBadge level="Expanding" />
        </div>
        <p className="text-sm text-orange-700/80 dark:text-orange-300/70">
          Students at this level can engage with age-appropriate content with moderate
          scaffolding. Focus on building academic language, unpacking complex sentences,
          and gradually increasing independence. Scaffolds should challenge students to
          use more sophisticated language while still providing structured support.
        </p>
      </div>

      <SectionHeading>All Scaffolds for Expanding Students</SectionHeading>

      <div className="space-y-4">
        {/* Color Coding */}
        <ScaffoldSection
          icon={Palette}
          title="Color Coding: Claims, Evidence & Reasoning"
          description="At the Expanding level, color coding shifts from basic main idea identification to analyzing argument structure. Students highlight claims, evidence, and reasoning (CER) to understand how authors build arguments. This supports analytical reading and prepares students for argumentative writing."
          whenToUse={[
            "Argumentative or persuasive texts",
            "Science lab reports or explanations using CER format",
            "Before students write their own argument paragraphs",
            "When analyzing author's purpose and rhetorical strategies",
          ]}
          exampleBefore={`<p>Many scientists believe that climate change is the most serious challenge facing our planet. According to NASA, global temperatures have risen by 1.1°C since the late 1800s. This matters because even small temperature changes can cause major shifts in weather patterns, sea levels, and ecosystems. If temperatures continue to rise, we could see more extreme weather events and rising sea levels that threaten coastal cities.</p>`}
          exampleAfter={`<p><span style="background-color: #FFF176; padding: 2px 4px; border-radius: 2px; color: #000;">Many scientists believe that climate change is the most serious challenge facing our planet.</span> <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px; color: #000;">According to NASA, global temperatures have risen by 1.1°C since the late 1800s.</span> <span style="background-color: #90CAF9; padding: 2px 4px; border-radius: 2px; color: #000;">This matters because even small temperature changes can cause major shifts in weather patterns, sea levels, and ecosystems.</span> <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px; color: #000;">If temperatures continue to rise, we could see more extreme weather events and rising sea levels that threaten coastal cities.</span></p><p style="margin-top: 12px; font-size: 0.8rem; color: #555;"><strong>Key:</strong> <span style="background-color: #FFF176; padding: 2px 6px; border-radius: 2px;">Yellow = Claim</span>&nbsp; <span style="background-color: #AED581; padding: 2px 6px; border-radius: 2px;">Green = Evidence</span>&nbsp; <span style="background-color: #90CAF9; padding: 2px 6px; border-radius: 2px;">Blue = Reasoning</span></p>`}
          template={`COLOR CODING: CLAIMS, EVIDENCE & REASONING — Expanding Level
=============================================================

Instructions: Highlight or underline using these colors:
  - YELLOW = Claim (the author's main argument or position)
  - GREEN  = Evidence (facts, data, quotes that support the claim)
  - BLUE   = Reasoning (explains WHY the evidence matters)

Title: _______________________________________
Author: ______________________________________

After highlighting, answer:
1. What is the author's main CLAIM?
   _____________________________________________

2. What EVIDENCE does the author use? (List 2-3)
   a. _________________________________________
   b. _________________________________________
   c. _________________________________________

3. How does the author explain WHY the evidence
   supports the claim? (REASONING)
   _____________________________________________
   _____________________________________________

4. How strong is this argument? Why?
   _____________________________________________
   _____________________________________________`}
          tips={[
            "Teach the CER (Claim, Evidence, Reasoning) framework explicitly before using this scaffold",
            "Some sentences may contain both evidence and reasoning — discuss gray areas",
            "Have students compare their highlighting with a partner to discuss differences",
          ]}
        />

        {/* Chunking */}
        <ScaffoldSection
          icon={LayoutList}
          title="Chunking: Sections with Guiding Questions"
          description="At the Expanding level, chunking uses larger sections (a full paragraph or two) with guiding questions rather than simple pause prompts. The questions push students toward deeper analysis and academic language use, building critical thinking alongside reading comprehension."
          whenToUse={[
            "Multi-paragraph informational texts",
            "Primary source documents in social studies",
            "Complex science readings with multiple concepts",
            "Literature with shifting themes or perspectives",
          ]}
          exampleBefore={`<p>The Industrial Revolution transformed society in the 18th and 19th centuries. Factories replaced small workshops, and cities grew rapidly as people moved from rural areas seeking work. New inventions like the steam engine and spinning jenny dramatically increased production capacity.</p><p>However, these changes came at a cost. Factory workers, including children, often worked 14-16 hour days in dangerous conditions. Air and water pollution increased dramatically. The gap between rich factory owners and poor workers widened, leading to social unrest and the eventual rise of labor unions.</p>`}
          exampleAfter={`<div style="font-weight: 600; margin: 0 0 0.5rem 0; padding: 0.75rem; background: #e5e7eb; border-left: 4px solid #2563eb; color: #1e40af; border-radius: 4px;">Section 1 of 2: The Changes</div><p>The Industrial Revolution transformed society in the 18th and 19th centuries. Factories replaced small workshops, and cities grew rapidly as people moved from rural areas seeking work. New inventions like the steam engine and spinning jenny dramatically increased production capacity.</p><div style="margin: 0.75rem 0; padding: 0.75rem; background: #eff6ff; border-left: 3px solid #3b82f6; font-size: 0.875rem; border-radius: 4px;"><strong>Guiding Questions:</strong><br/>1. What were the main changes during the Industrial Revolution?<br/>2. Why did people move to cities?<br/>3. What is the author's tone — positive, negative, or neutral?</div><div style="font-weight: 600; margin: 1.5rem 0 0.5rem 0; padding: 0.75rem; background: #e5e7eb; border-left: 4px solid #2563eb; color: #1e40af; border-radius: 4px;">Section 2 of 2: The Costs</div><p>However, these changes came at a cost. Factory workers, including children, often worked 14-16 hour days in dangerous conditions. Air and water pollution increased dramatically. The gap between rich factory owners and poor workers widened, leading to social unrest and the eventual rise of labor unions.</p><div style="margin: 0.75rem 0; padding: 0.75rem; background: #eff6ff; border-left: 3px solid #3b82f6; font-size: 0.875rem; border-radius: 4px;"><strong>Guiding Questions:</strong><br/>1. What were the negative effects of industrialization?<br/>2. How does the word "however" signal a shift in the text?<br/>3. What cause-and-effect relationship does the author describe?</div>`}
          template={`CHUNKING WITH GUIDING QUESTIONS — Expanding Level
===================================================

Title: _______________________________________

┌──────────────────────────────────────────────┐
│ Section 1: [Title] _________________________ │
├──────────────────────────────────────────────┤
│                                              │
│ [Paste paragraph(s) for this section]       │
│                                              │
│ Guiding Questions:                           │
│ 1. _________________________________________ │
│ 2. _________________________________________ │
│ 3. What academic vocabulary is important     │
│    in this section? ________________________ │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Section 2: [Title] _________________________ │
├──────────────────────────────────────────────┤
│                                              │
│ [Paste paragraph(s) for this section]       │
│                                              │
│ Guiding Questions:                           │
│ 1. _________________________________________ │
│ 2. _________________________________________ │
│ 3. How does this section connect to          │
│    Section 1? _____________________________ │
└──────────────────────────────────────────────┘

Synthesis Question:
How do all the sections connect to one main idea?
_________________________________________________
_________________________________________________`}
          tips={[
            "Use higher-order guiding questions (analyze, evaluate, connect) rather than basic recall",
            "Include at least one question about academic language or text structure per section",
            "Encourage students to annotate the text while answering questions",
          ]}
        />

        {/* Sentence Frames: Analytical Writing */}
        <ScaffoldSection
          icon={MessageSquareText}
          title="Sentence Frames: Analytical & Academic Writing"
          description="At the Expanding level, sentence frames shift from basic opinion starters to academic analysis frames. These help students engage with complex ideas using academic register, including cause-effect, comparison, and evidence-based reasoning structures."
          whenToUse={[
            "Analytical writing across all content areas",
            "Literary analysis essays",
            "Science explanations using CER format",
            "Comparing two texts, ideas, or perspectives",
          ]}
          exampleBefore={`<p><strong>Writing Prompt:</strong> Analyze how the author uses figurative language in the poem "The Road Not Taken" by Robert Frost. Explain how the figurative language contributes to the poem's theme.</p>`}
          exampleAfter={`<p><strong>Writing Prompt:</strong> Analyze how the author uses figurative language in the poem "The Road Not Taken" by Robert Frost. Explain how the figurative language contributes to the poem's theme.</p><div style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Academic Sentence Frames:</strong><br/><br/>&#x2022; The author uses [type of figurative language] when he/she writes, "____________." This suggests that ____________.<br/><br/>&#x2022; One example of [literary device] is "____________," which shows ____________.<br/><br/>&#x2022; This figurative language is important because it helps the reader understand ____________.<br/><br/>&#x2022; The [metaphor/simile/personification] in line ___ contributes to the theme of ____________ by ____________.<br/><br/>&#x2022; Based on this evidence, the author's message is ____________.</div>`}
          template={`SENTENCE FRAMES: ANALYTICAL WRITING — Expanding Level
======================================================

Topic / Prompt: __________________________________

ACADEMIC ANALYSIS FRAMES:

For introducing analysis:
• The author uses _____________ to show _____________.
• One example of _____________ is "_______________,"
  which suggests _____________.

For explaining evidence:
• This is significant because _____________.
• This evidence demonstrates that _____________.
• This [quote/detail] reveals _____________.

For comparing:
• While [Text A] _____________, [Text B] _____________.
• Both texts show _____________, but they differ in _____________.
• Similarly, _____________, which suggests _____________.

For cause and effect:
• As a result of _____________, _____________.
• Because _____________, the [character/outcome] _____________.
• This led to _____________, which ultimately _____________.

For concluding:
• Overall, the evidence shows that _____________.
• Based on this analysis, _____________.
• In conclusion, the author's use of _____________
  effectively conveys _____________.

My Analysis:
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________`}
          tips={[
            "Encourage students to combine multiple frames in a single paragraph",
            "Model the difference between 'I think' (opinion) and 'The evidence shows' (analysis)",
            "Have students practice orally first using the frames before writing",
            "Gradually remove frames as students internalize academic language patterns",
          ]}
        />

        {/* Word Banks */}
        <ScaffoldSection
          icon={BookA}
          title="Word Bank: Academic Vocabulary with Context"
          description="At the Expanding level, word banks go beyond simple definitions to include example sentences and word connections. Students are expected to use these words in their own writing, not just recognize them. Focus on Tier 2 academic words (analyze, contrast, significant) and domain-specific Tier 3 words."
          whenToUse={[
            "Texts with sophisticated academic vocabulary",
            "Cross-curricular assignments requiring academic register",
            "Before essay or report writing assignments",
            "When students understand content but lack academic language to express ideas",
          ]}
          exampleBefore={`<p>Read the article about the impact of social media on teenagers and write an argumentative essay about whether schools should ban cell phones during school hours.</p>`}
          exampleAfter={`<p>Read the article about the impact of social media on teenagers and write an argumentative essay about whether schools should ban cell phones during school hours.</p><div style="border: 2px solid #2563eb; padding: 1.25rem; margin: 1.5rem 0; background: #eff6ff; border-radius: 8px;"><h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Academic Word Bank</h3><div style="display: grid; gap: 0.75rem;"><div><strong style="color: #1e40af;">Impact (noun):</strong> A strong effect on something. <em>"Social media has a significant impact on how teens communicate."</em></div><div><strong style="color: #1e40af;">Argue (verb):</strong> To give reasons for or against something. <em>"Some people argue that cell phones are distracting."</em></div><div><strong style="color: #1e40af;">Evidence (noun):</strong> Facts or information that prove something. <em>"The evidence shows that screen time affects sleep."</em></div><div><strong style="color: #1e40af;">Furthermore (adverb):</strong> In addition; also (a transition word). <em>"Furthermore, studies show that social media can affect mental health."</em></div><div><strong style="color: #1e40af;">Perspective (noun):</strong> A point of view or way of looking at something. <em>"From a teacher's perspective, phones are a major distraction."</em></div><div><strong style="color: #1e40af;">Consequently (adverb):</strong> As a result (shows cause and effect). <em>"Students check their phones often; consequently, they miss instruction."</em></div></div></div>`}
          template={`ACADEMIC WORD BANK WITH CONTEXT — Expanding Level
===================================================

Subject: ____________  Topic: ___________________

Instructions: Study these words BEFORE reading.
Use at least 4 of these words in your writing.

┌───────────────────────────────────────────────┐
│ Word: _________________                       │
│ Part of Speech: ___________                   │
│ Definition: _________________________________ │
│ Example: "___________________________________ │
│ ___________________________________________"  │
├───────────────────────────────────────────────┤
│ Word: _________________                       │
│ Part of Speech: ___________                   │
│ Definition: _________________________________ │
│ Example: "___________________________________ │
│ ___________________________________________"  │
├───────────────────────────────────────────────┤
│ Word: _________________                       │
│ Part of Speech: ___________                   │
│ Definition: _________________________________ │
│ Example: "___________________________________ │
│ ___________________________________________"  │
├───────────────────────────────────────────────┤
│ Word: _________________                       │
│ Part of Speech: ___________                   │
│ Definition: _________________________________ │
│ Example: "___________________________________ │
│ ___________________________________________"  │
├───────────────────────────────────────────────┤
│ Word: _________________                       │
│ Part of Speech: ___________                   │
│ Definition: _________________________________ │
│ Example: "___________________________________ │
│ ___________________________________________"  │
├───────────────────────────────────────────────┤
│ Word: _________________                       │
│ Part of Speech: ___________                   │
│ Definition: _________________________________ │
│ Example: "___________________________________ │
│ ___________________________________________"  │
└───────────────────────────────────────────────┘

Word Connections: Pick 2 words and explain how
they relate to each other.
_________________________________________________
_________________________________________________`}
          tips={[
            "Include Tier 2 (cross-curricular) academic words, not just Tier 3 (domain-specific) words",
            "Require students to USE the words in their writing, not just define them",
            "Add example sentences using the word in context",
            "Consider adding synonyms and antonyms to deepen vocabulary understanding",
          ]}
        />

        {/* Visual Organizers */}
        <ScaffoldSection
          icon={Network}
          title="Visual Organizer: Cause & Effect Chart"
          description="A graphic organizer that helps Expanding students map out cause-and-effect relationships in informational texts. Unlike simple matching, this organizer asks students to trace chains of causes and effects and explain the connections between them using academic language."
          whenToUse={[
            "History texts describing events and their consequences",
            "Science readings about processes, reactions, or environmental changes",
            "Current events analysis",
            "Narrative texts where characters' actions drive the plot",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Identify three cause-and-effect relationships in the article about the Dust Bowl. Explain how each cause led to its effect.</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Identify three cause-and-effect relationships in the article about the Dust Bowl. Explain how each cause led to its effect.</p><div style="border: 2px solid #f59e0b; padding: 1.5rem; margin: 1rem 0; background: #fffbeb; border-radius: 8px;"><strong style="color: #b45309;">Cause &amp; Effect Organizer</strong><br/><br/><div style="display: grid; gap: 1rem;"><div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center;"><div style="padding: 0.75rem; background: #fef3c7; border-radius: 6px; border: 1px solid #fcd34d;"><strong>Cause:</strong> ___________</div><div style="font-size: 1.5rem;">&#10132;</div><div style="padding: 0.75rem; background: #fef3c7; border-radius: 6px; border: 1px solid #fcd34d;"><strong>Effect:</strong> ___________</div></div><div style="padding: 0.5rem; background: white; border-radius: 4px; font-size: 0.875rem; font-style: italic;">Explain the connection: Because _______, _______ happened, which led to _______.</div></div></div>`}
          template={`CAUSE & EFFECT CHART — Expanding Level
==========================================

Topic: ________________________________________

Instructions: Identify cause-and-effect relationships.
Then explain HOW the cause led to the effect.

CAUSE #1                    EFFECT #1
_____________________  -->  _____________________
_____________________       _____________________

Connection: Because _____________________________,
_____________________________________________ happened.

CAUSE #2                    EFFECT #2
_____________________  -->  _____________________
_____________________       _____________________

Connection: As a result of ______________________,
_____________________________________________.

CAUSE #3                    EFFECT #3
_____________________  -->  _____________________
_____________________       _____________________

Connection: This led to _________________________
because ________________________________________.

Chain Reaction: How are these cause-and-effect
relationships connected to each other?
_________________________________________________
_________________________________________________
_________________________________________________`}
          tips={[
            "Teach signal words for cause/effect: because, as a result, consequently, therefore, led to",
            "Encourage students to look for chain reactions (one effect becomes the cause of the next event)",
            "Model the difference between correlation and causation at this level",
          ]}
        />

        {/* Visual Organizer: T-Chart */}
        <ScaffoldSection
          icon={Network}
          title="Visual Organizer: T-Chart for Two Perspectives"
          description="A T-chart organizer for analyzing two sides of an issue or two perspectives on a topic. At the Expanding level, this pushes students beyond simple listing to analyzing which perspective is more supported by evidence and forming their own evidence-based position."
          whenToUse={[
            "Debate preparation or argumentative writing assignments",
            "Analyzing two characters' perspectives in literature",
            "Evaluating pros and cons of a policy or decision",
            "Comparing two historical or scientific viewpoints",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Should students be required to wear school uniforms? Analyze both sides of the argument and take a position supported by evidence.</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Should students be required to wear school uniforms? Analyze both sides of the argument and take a position supported by evidence.</p><div style="border: 2px solid #6366f1; padding: 1.5rem; margin: 1rem 0; background: #eef2ff; border-radius: 8px;"><strong style="color: #4338ca;">Two Perspectives Organizer</strong><br/><br/><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #c7d2fe;"><strong style="color: #4338ca;">For Uniforms:</strong><br/>- _____<br/>- _____<br/>- _____<br/><em>Strongest evidence:</em> _____</div><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #c7d2fe;"><strong style="color: #4338ca;">Against Uniforms:</strong><br/>- _____<br/>- _____<br/>- _____<br/><em>Strongest evidence:</em> _____</div></div><br/><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #c7d2fe;"><strong>My Position:</strong> Based on the evidence, I believe ______ because ______.</div></div>`}
          template={`T-CHART: TWO PERSPECTIVES — Expanding Level
=============================================

Issue / Question: _______________________________
_________________________________________________

┌─────────────────────┬─────────────────────────┐
│ PERSPECTIVE A:      │ PERSPECTIVE B:          │
│ ________________    │ ________________        │
├─────────────────────┼─────────────────────────┤
│                     │                         │
│ 1. ________________ │ 1. ________________     │
│ 2. ________________ │ 2. ________________     │
│ 3. ________________ │ 3. ________________     │
│                     │                         │
│ Evidence:           │ Evidence:               │
│ ________________    │ ________________        │
│ ________________    │ ________________        │
│                     │                         │
│ Strongest point:    │ Strongest point:        │
│ ________________    │ ________________        │
└─────────────────────┴─────────────────────────┘

My Position:
Based on the evidence, I believe _______________
because ________________________________________
________________________________________________.

One counterargument is ________________________,
but I still believe ___________ because ________
________________________________________________.`}
          tips={[
            "Require students to fill in BOTH sides before writing their position — this builds stronger arguments",
            "Teach the concept of counterarguments at this level",
            "Encourage students to evaluate which evidence is STRONGEST, not just list all points",
          ]}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  BRIDGING TAB                                                       */
/* ================================================================== */

function BridgingTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-l-4 border-green-400 bg-green-50/50 p-4 dark:border-green-500 dark:bg-green-900/10">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-green-800 dark:text-green-300">
            Bridging Level — Light Support
          </h3>
          <LevelBadge level="Bridging" />
        </div>
        <p className="text-sm text-green-700/80 dark:text-green-300/70">
          Students at this level are approaching grade-level independence. Scaffolds
          should focus on nuanced academic language, complex text structures, and
          self-monitoring strategies. The goal is building independence — use scaffolds
          as reference tools rather than mandatory supports. Emphasis shifts to
          self-assessment, peer collaboration, and sophisticated analytical language.
        </p>
      </div>

      <SectionHeading>All Scaffolds for Bridging Students</SectionHeading>

      <div className="space-y-4">
        {/* Color Coding */}
        <ScaffoldSection
          icon={Palette}
          title="Color Coding: Rhetorical Analysis"
          description="At the Bridging level, color coding is used for advanced rhetorical analysis — identifying ethos, pathos, and logos appeals, or tracking author's use of rhetorical devices across a text. Students at this level should be able to explain WHY the author made specific language choices and evaluate their effectiveness."
          whenToUse={[
            "Argumentative or persuasive texts for rhetorical analysis",
            "Speeches, editorials, and opinion pieces",
            "AP-level or advanced analytical reading tasks",
            "When students need to evaluate the effectiveness of arguments, not just identify them",
          ]}
          exampleBefore={`<p>We must act now to protect our oceans. Every year, over 8 million tons of plastic waste enters our oceans, killing marine wildlife and destroying ecosystems that millions of people depend on for food and livelihood. Dr. Sylvia Earle, one of the world's leading marine biologists, warns that "the ocean is in trouble, and therefore so are we." Can we really afford to wait while our children inherit a dying sea?</p>`}
          exampleAfter={`<p><span style="background-color: #90CAF9; padding: 2px 4px; border-radius: 2px; color: #000;">We must act now to protect our oceans.</span> <span style="background-color: #AED581; padding: 2px 4px; border-radius: 2px; color: #000;">Every year, over 8 million tons of plastic waste enters our oceans, killing marine wildlife and destroying ecosystems that millions of people depend on for food and livelihood.</span> <span style="background-color: #CE93D8; padding: 2px 4px; border-radius: 2px; color: #000;">Dr. Sylvia Earle, one of the world's leading marine biologists, warns that</span> "the ocean is in trouble, and therefore so are we." <span style="background-color: #FFAB91; padding: 2px 4px; border-radius: 2px; color: #000;">Can we really afford to wait while our children inherit a dying sea?</span></p><p style="margin-top: 12px; font-size: 0.8rem; color: #555;"><strong>Key:</strong> <span style="background-color: #90CAF9; padding: 2px 6px; border-radius: 2px;">Blue = Call to Action</span>&nbsp; <span style="background-color: #AED581; padding: 2px 6px; border-radius: 2px;">Green = Logos (Facts/Data)</span>&nbsp; <span style="background-color: #CE93D8; padding: 2px 6px; border-radius: 2px;">Purple = Ethos (Credibility)</span>&nbsp; <span style="background-color: #FFAB91; padding: 2px 6px; border-radius: 2px;">Orange = Pathos (Emotional Appeal)</span></p>`}
          template={`COLOR CODING: RHETORICAL ANALYSIS — Bridging Level
===================================================

Instructions: Highlight using these colors:
  - GREEN  = Logos (facts, statistics, logical reasoning)
  - PURPLE = Ethos (expert quotes, credibility appeals)
  - ORANGE = Pathos (emotional language, imagery, questions)
  - BLUE   = Call to Action / Thesis

Title: _______________________________________
Author: ______________________________________

ANALYSIS:

1. Which appeal does the author use MOST? Why?
   _____________________________________________
   _____________________________________________

2. Identify one example of logos and explain why
   it is (or isn't) effective:
   _____________________________________________
   _____________________________________________

3. How does the author use pathos to persuade?
   Is this an effective strategy? Why or why not?
   _____________________________________________
   _____________________________________________

4. Does the author establish credibility (ethos)?
   How? Is it convincing?
   _____________________________________________
   _____________________________________________

5. Overall, how effective is this argument?
   What could the author improve?
   _____________________________________________
   _____________________________________________`}
          tips={[
            "Encourage students to evaluate the EFFECTIVENESS of each appeal, not just identify it",
            "Discuss how authors often combine multiple appeals in a single sentence",
            "This is excellent preparation for AP-level rhetorical analysis",
            "Consider having students compare two texts' use of rhetorical strategies",
          ]}
        />

        {/* Sentence Frames: Complex Analysis */}
        <ScaffoldSection
          icon={MessageSquareText}
          title="Sentence Frames: Complex Academic Discourse"
          description="At the Bridging level, sentence frames provide sophisticated academic language structures for complex analysis — cause-effect chains, nuanced comparisons, concession and rebuttal, and synthesis across multiple sources. These frames model the language of academic essays and formal discourse."
          whenToUse={[
            "Multi-paragraph analytical or argumentative essays",
            "Synthesizing multiple sources into a single argument",
            "Literary analysis requiring nuanced interpretation",
            "When students have strong ideas but need academic register to express them",
          ]}
          exampleBefore={`<p><strong>Writing Prompt:</strong> Synthesize the three articles about renewable energy. What is the most compelling argument for transitioning to renewable energy sources, and what are the most significant challenges?</p>`}
          exampleAfter={`<p><strong>Writing Prompt:</strong> Synthesize the three articles about renewable energy. What is the most compelling argument for transitioning to renewable energy sources, and what are the most significant challenges?</p><div style="font-style: italic; color: #6b7280; margin: 1rem 0; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #9ca3af;"><strong>Complex Academic Frames:</strong><br/><br/><strong>For synthesis:</strong><br/>&#x2022; While [Source A] emphasizes ____________, [Source B] argues ____________, suggesting that ____________.<br/>&#x2022; Taken together, these sources demonstrate that ____________.<br/><br/><strong>For concession &amp; rebuttal:</strong><br/>&#x2022; Although some argue that ____________, the evidence suggests ____________ because ____________.<br/>&#x2022; While it is true that ____________, this does not negate the fact that ____________.<br/><br/><strong>For nuanced analysis:</strong><br/>&#x2022; The relationship between ____________ and ____________ is complex; on one hand ____________, while on the other ____________.<br/>&#x2022; This evidence complicates the assumption that ____________ by revealing ____________.</div>`}
          template={`SENTENCE FRAMES: COMPLEX ACADEMIC DISCOURSE — Bridging Level
=============================================================

Topic / Prompt: __________________________________

FOR INTRODUCING A THESIS:
• This analysis reveals that _____________, as
  evidenced by _____________ and _____________.
• Although _____________ appears straightforward,
  a closer examination reveals _____________.

FOR SYNTHESIZING MULTIPLE SOURCES:
• While [Source A] emphasizes _____________,
  [Source B] argues _____________, suggesting
  that _____________.
• Taken together, these sources demonstrate
  that _____________.

FOR CONCESSION & REBUTTAL:
• Although some argue that _____________, the
  evidence suggests _____________ because _______.
• While it is true that _____________, this does
  not negate the fact that _____________.
• Proponents of _______ contend that _________;
  however, _____________.

FOR NUANCED ANALYSIS:
• The relationship between ______ and ______ is
  complex; on one hand _______, while on the
  other _____________.
• This evidence complicates the assumption that
  _____________ by revealing _____________.
• Rather than a simple [cause/correlation],
  _____________ suggests a more nuanced _______.

FOR CONCLUDING:
• Ultimately, the evidence compels the conclusion
  that _____________.
• These findings have significant implications
  for _____________, particularly _____________.

My Writing:
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________`}
          tips={[
            "Frame these as reference tools, not requirements — Bridging students should select frames that fit their ideas",
            "Encourage students to modify and personalize the frames, not just fill in blanks",
            "Discuss the difference between academic register and informal language explicitly",
            "These frames prepare students for AP, honors, and college-level writing",
          ]}
        />

        {/* Word Banks */}
        <ScaffoldSection
          icon={BookA}
          title="Word Bank: Nuanced & Domain-Specific Vocabulary"
          description="At the Bridging level, word banks focus on nuanced vocabulary distinctions — the difference between 'argue' and 'contend,' or 'significant' and 'paramount.' Students learn to select the most precise word for their intended meaning, building the sophisticated vocabulary needed for academic independence."
          whenToUse={[
            "Essay writing requiring precise academic language",
            "When students use basic vocabulary but need more sophisticated alternatives",
            "Advanced content-area texts with discipline-specific terminology",
            "Before peer editing sessions focused on word choice",
          ]}
          exampleBefore={`<p>Write a literary analysis essay about the theme of identity in "The House on Mango Street" by Sandra Cisneros.</p>`}
          exampleAfter={`<p>Write a literary analysis essay about the theme of identity in "The House on Mango Street" by Sandra Cisneros.</p><div style="border: 2px solid #2563eb; padding: 1.25rem; margin: 1.5rem 0; background: #eff6ff; border-radius: 8px;"><h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.125rem;">Nuanced Vocabulary Bank</h3><div style="display: grid; gap: 0.75rem;"><div><strong style="color: #1e40af;">Convey</strong> (vs. "show"): To communicate a meaning or feeling. <em>Use "convey" when the author communicates something indirectly.</em></div><div><strong style="color: #1e40af;">Embody</strong> (vs. "represent"): To be a perfect example of a quality. <em>"Esperanza embodies the tension between aspiration and circumstance."</em></div><div><strong style="color: #1e40af;">Juxtapose</strong> (vs. "compare"): To place side by side to highlight contrast. <em>"Cisneros juxtaposes poverty and dreams to reveal..."</em></div><div><strong style="color: #1e40af;">Underscore</strong> (vs. "show"): To emphasize the importance of something. <em>"This scene underscores the theme of..."</em></div><div><strong style="color: #1e40af;">Nuanced</strong> (vs. "complicated"): Having subtle differences in meaning. <em>"The author presents a nuanced view of identity."</em></div><div><strong style="color: #1e40af;">Poignant</strong> (vs. "sad"): Evoking a deep sense of sadness or emotion. <em>"The poignant ending reveals..."</em></div></div></div>`}
          template={`NUANCED VOCABULARY BANK — Bridging Level
==========================================

Subject: ____________  Assignment: ______________

Instructions: Use these words to make your writing
more precise and academic. Pay attention to how each
word is DIFFERENT from the simpler alternative.

┌───────────────────────────────────────────────────┐
│ PRECISE WORD: _______________                     │
│ Instead of: _______________ (basic word)          │
│ Definition: ________________________________      │
│ When to use it: ____________________________      │
│ Example: "___________________________________     │
│ ___________________________________________"      │
├───────────────────────────────────────────────────┤
│ PRECISE WORD: _______________                     │
│ Instead of: _______________ (basic word)          │
│ Definition: ________________________________      │
│ When to use it: ____________________________      │
│ Example: "___________________________________     │
│ ___________________________________________"      │
├───────────────────────────────────────────────────┤
│ PRECISE WORD: _______________                     │
│ Instead of: _______________ (basic word)          │
│ Definition: ________________________________      │
│ When to use it: ____________________________      │
│ Example: "___________________________________     │
│ ___________________________________________"      │
├───────────────────────────────────────────────────┤
│ PRECISE WORD: _______________                     │
│ Instead of: _______________ (basic word)          │
│ Definition: ________________________________      │
│ When to use it: ____________________________      │
│ Example: "___________________________________     │
│ ___________________________________________"      │
├───────────────────────────────────────────────────┤
│ PRECISE WORD: _______________                     │
│ Instead of: _______________ (basic word)          │
│ Definition: ________________________________      │
│ When to use it: ____________________________      │
│ Example: "___________________________________     │
│ ___________________________________________"      │
├───────────────────────────────────────────────────┤
│ PRECISE WORD: _______________                     │
│ Instead of: _______________ (basic word)          │
│ Definition: ________________________________      │
│ When to use it: ____________________________      │
│ Example: "___________________________________     │
│ ___________________________________________"      │
└───────────────────────────────────────────────────┘

Self-Check: After writing, review your essay.
Did you replace basic words with precise ones?
Circle 3 places where you upgraded your word choice.`}
          tips={[
            "Focus on the NUANCE between basic and precise words, not just adding harder vocabulary",
            "Encourage students to keep a personal vocabulary journal of precise words they discover",
            "Pair with peer editing — have partners suggest more precise word choices",
            "Model how overusing advanced vocabulary can make writing feel forced",
          ]}
        />

        {/* Visual Organizer: Argument Map */}
        <ScaffoldSection
          icon={Network}
          title="Visual Organizer: Argument Map with Counterarguments"
          description="An advanced graphic organizer that maps out a full argument structure including thesis, supporting claims with evidence, counterarguments, and rebuttals. This organizer prepares Bridging students for sophisticated argumentative writing by making the logical structure of their argument visible."
          whenToUse={[
            "Multi-paragraph argumentative or persuasive essays",
            "Debate preparation",
            "Research papers requiring synthesis of multiple sources",
            "When students need to strengthen their argument by addressing opposing views",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Write a 5-paragraph argumentative essay on whether the voting age should be lowered to 16. Use evidence from at least two sources to support your position and address a counterargument.</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Write a 5-paragraph argumentative essay on whether the voting age should be lowered to 16. Use evidence from at least two sources to support your position and address a counterargument.</p><div style="border: 2px solid #059669; padding: 1.5rem; margin: 1rem 0; background: #ecfdf5; border-radius: 8px;"><strong style="color: #065f46;">Argument Map</strong><br/><br/><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 2px solid #059669; text-align: center; font-weight: 600;">THESIS: ______________________________________</div><br/><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"><div><div style="padding: 0.75rem; background: #d1fae5; border-radius: 6px; border: 1px solid #6ee7b7; margin-bottom: 0.5rem;"><strong>Claim 1:</strong> _____<br/>Evidence: _____<br/>Source: _____</div><div style="padding: 0.75rem; background: #d1fae5; border-radius: 6px; border: 1px solid #6ee7b7;"><strong>Claim 2:</strong> _____<br/>Evidence: _____<br/>Source: _____</div></div><div><div style="padding: 0.75rem; background: #fef3c7; border-radius: 6px; border: 1px solid #fcd34d; margin-bottom: 0.5rem;"><strong>Counterargument:</strong> _____<br/>Their evidence: _____</div><div style="padding: 0.75rem; background: #dbeafe; border-radius: 6px; border: 1px solid #93c5fd;"><strong>My Rebuttal:</strong> _____<br/>Why my position is stronger: _____</div></div></div></div>`}
          template={`ARGUMENT MAP WITH COUNTERARGUMENTS — Bridging Level
====================================================

Topic / Prompt: __________________________________

THESIS (your position):
_________________________________________________
_________________________________________________

SUPPORTING CLAIMS:

Claim 1: _______________________________________
  Evidence: _____________________________________
  Source: _______________________________________
  Explanation: __________________________________

Claim 2: _______________________________________
  Evidence: _____________________________________
  Source: _______________________________________
  Explanation: __________________________________

Claim 3 (optional): ____________________________
  Evidence: _____________________________________
  Source: _______________________________________
  Explanation: __________________________________

COUNTERARGUMENT:
What might someone who DISAGREES say?
_________________________________________________
What evidence might they use?
_________________________________________________

MY REBUTTAL:
Why is my argument STILL stronger?
_________________________________________________
_________________________________________________

CONCLUSION:
Restate thesis + why it matters:
_________________________________________________
_________________________________________________

Self-Assessment Checklist:
[ ] My thesis takes a clear position.
[ ] Each claim is supported by specific evidence.
[ ] I cited at least two sources.
[ ] I addressed a counterargument.
[ ] My rebuttal explains why my position is stronger.
[ ] My conclusion connects to a bigger idea.`}
          tips={[
            "Emphasize that strong arguments ACKNOWLEDGE opposing views — they don't ignore them",
            "Have students peer-review each other's argument maps before drafting",
            "Use this as a planning tool — students fill out the map, then write the essay",
            "Encourage students to evaluate whether their evidence actually supports their claim",
          ]}
        />

        {/* Self-Assessment Checklist */}
        <ScaffoldSection
          icon={MessageSquareText}
          title="Self-Assessment: Academic Language Checklist"
          description="A self-monitoring checklist that Bridging students use to evaluate their own writing for academic language features. This scaffold builds metacognitive awareness and independence — instead of the teacher providing the scaffold, the student checks their own work against academic standards."
          whenToUse={[
            "Final draft revision for any writing assignment",
            "Before peer editing sessions",
            "When building student independence in academic writing",
            "As a regular routine for self-reflection on language growth",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Review your essay draft before submitting. Check it for academic language use.</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Review your essay draft before submitting. Check it for academic language use.</p><div style="border: 2px solid #8b5cf6; padding: 1.5rem; margin: 1rem 0; background: #f5f3ff; border-radius: 8px;"><strong style="color: #6d28d9;">Academic Language Self-Assessment</strong><br/><br/><div style="display: grid; gap: 0.5rem; font-size: 0.875rem;"><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I used precise academic vocabulary (not just basic words)</div><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I varied my sentence structure (simple, compound, complex)</div><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I used transition words to connect ideas between sentences and paragraphs</div><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I cited evidence from the text using proper formatting</div><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I explained my reasoning (not just stated facts)</div><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I maintained an academic tone (no slang or casual language)</div><div style="padding: 0.5rem; background: white; border-radius: 4px;">&#9744; I addressed a counterargument (if argumentative)</div></div></div>`}
          template={`ACADEMIC LANGUAGE SELF-ASSESSMENT — Bridging Level
===================================================

Name: ________________  Date: ___________________
Assignment: _____________________________________

Review your writing and check each item honestly.

VOCABULARY & WORD CHOICE:
[ ] I used precise academic vocabulary, not just
    basic words. (Circle 3 examples in your essay)
[ ] I chose words that convey the exact meaning
    I intended (nuanced word choice).
[ ] I avoided repetition by using synonyms
    and varied language.

SENTENCE STRUCTURE:
[ ] I used a variety of sentence types (simple,
    compound, complex).
[ ] I combined short sentences using conjunctions,
    relative clauses, or participial phrases.
[ ] My sentences flow smoothly from one to the next.

ORGANIZATION & TRANSITIONS:
[ ] I used transition words to connect ideas
    (furthermore, however, consequently, etc.)
[ ] Each paragraph has a clear topic sentence.
[ ] My ideas are organized in a logical order.

EVIDENCE & ANALYSIS:
[ ] I cited specific evidence from the text.
[ ] I explained HOW the evidence supports my claim
    (not just dropped in quotes).
[ ] I analyzed the evidence rather than just
    summarizing it.

ACADEMIC TONE:
[ ] I maintained formal/academic tone throughout.
[ ] I avoided slang, contractions, and "I feel."
[ ] I used third person where appropriate.

AREAS TO IMPROVE (pick 1-2):
1. _____________________________________________
2. _____________________________________________

GOAL for next assignment:
_________________________________________________`}
          tips={[
            "Have students complete this BEFORE turning in their final draft, not after",
            "Gradually release responsibility — students should begin using this independently",
            "Use the 'Areas to Improve' section to set personal goals for the next assignment",
            "Consider having students highlight or circle the evidence of each checklist item in their essay",
          ]}
        />

        {/* Peer Editing */}
        <ScaffoldSection
          icon={Network}
          title="Peer Editing: Language-Focused Feedback Guide"
          description="A structured peer editing guide that focuses specifically on academic language feedback. Bridging students provide each other with specific, actionable feedback on word choice, sentence structure, and academic register — building both the editor's analytical skills and the writer's revision skills."
          whenToUse={[
            "Peer review sessions for essays and research papers",
            "After initial drafts but before final revision",
            "When building a culture of academic feedback in the classroom",
            "Collaborative writing workshops",
          ]}
          exampleBefore={`<p><strong>Prompt:</strong> Exchange essays with a partner and provide feedback on their writing.</p>`}
          exampleAfter={`<p><strong>Prompt:</strong> Exchange essays with a partner and provide feedback on their writing.</p><div style="border: 2px solid #0891b2; padding: 1.5rem; margin: 1rem 0; background: #ecfeff; border-radius: 8px;"><strong style="color: #155e75;">Peer Editing Guide — Focus on Academic Language</strong><br/><br/><div style="display: grid; gap: 0.75rem; font-size: 0.875rem;"><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #a5f3fc;"><strong>Word Choice:</strong> Find 2 places where the writer could use a more precise or academic word. Write your suggestion next to the word.</div><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #a5f3fc;"><strong>Evidence Integration:</strong> Does the writer explain their evidence, or just drop in quotes? Star one place where they could add more analysis.</div><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #a5f3fc;"><strong>Sentence Variety:</strong> Are the sentences varied in length and structure? Underline a section that feels repetitive.</div><div style="padding: 0.75rem; background: white; border-radius: 6px; border: 1px solid #a5f3fc;"><strong>Strengths:</strong> What is the STRONGEST part of this essay's language? Write a specific compliment.</div></div></div>`}
          template={`PEER EDITING: ACADEMIC LANGUAGE FEEDBACK — Bridging Level
==========================================================

Writer's Name: _____________  Editor's Name: ____________
Assignment: _____________________________________________

INSTRUCTIONS FOR THE EDITOR:
Read your partner's essay carefully. Focus on their
LANGUAGE, not their ideas. Give specific feedback.

1. WORD CHOICE
   Find 2 places where a MORE PRECISE word could
   replace a basic word.

   a. Change "___________" to "___________"
      (Paragraph ___, Line ___)
   b. Change "___________" to "___________"
      (Paragraph ___, Line ___)

2. EVIDENCE INTEGRATION
   Find 1 place where the writer "drops in" a quote
   without explaining it. How should they fix it?
   _________________________________________________
   _________________________________________________

3. SENTENCE VARIETY
   Underline a section where sentences feel repetitive
   or choppy. Suggest how to combine or vary them:
   _________________________________________________
   _________________________________________________

4. TRANSITIONS
   Is there a place where the ideas jump without a
   transition? Which transition word would help?
   _________________________________________________

5. ACADEMIC TONE
   Is there any informal language (slang, "I feel,"
   contractions)? Circle and suggest alternatives.
   _________________________________________________

6. STRONGEST LANGUAGE MOMENT
   What is the BEST sentence or word choice in
   this essay? Why is it effective?
   _________________________________________________
   _________________________________________________

OVERALL FEEDBACK (2-3 sentences):
_________________________________________________
_________________________________________________
_________________________________________________`}
          tips={[
            "Model giving specific, actionable feedback (not just 'good job' or 'fix this')",
            "Teach the difference between editing for IDEAS and editing for LANGUAGE",
            "Have editors sign their feedback — accountability improves quality",
            "Consider a feedback fishbowl: model a peer editing session for the whole class first",
          ]}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Page Component                                                */
/* ================================================================== */

export default function ScaffoldsReferencePage() {
  const [activeTab, setActiveTab] = useState("emerging");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="scaffold-heading">ELD Scaffolds Reference</h1>
        <p className="scaffold-description mt-1">
          Complete reference for all ELD scaffold types by proficiency level,
          with examples and printable templates for teachers.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-eld-almond-silk/40 bg-white p-5 md:flex-row md:items-center md:gap-6 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-eld-almond-silk/30 dark:bg-eld-dusty-grape/30">
          <Layers className="h-7 w-7 text-eld-space-indigo dark:text-eld-almond-silk" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Every Scaffold, Every Level — In Detail
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This page covers all five scaffold categories (Color Coding, Chunking,
            Sentence Frames, Word Banks, and Visual Organizers) across all three
            ELD proficiency levels. Each scaffold includes a detailed explanation,
            a before-and-after example, and a copyable template you can use
            without the AI tool.
          </p>
        </div>
      </div>

      {/* How to Use */}
      <InfoBanner variant="info">
        <strong>How to use this page:</strong> Select a proficiency level tab
        below to see all scaffolds appropriate for that level. Each scaffold
        includes a concrete example and a teacher template you can copy, print,
        and fill in with your own content. Click the &quot;Copy&quot; button on
        any template to copy it to your clipboard.
      </InfoBanner>

      {/* Quick Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scaffold Categories at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Palette,
                name: "Color Coding",
                description: "Highlight text elements with colors to make structure visible",
                levels: "All Levels",
              },
              {
                icon: LayoutList,
                name: "Chunking",
                description: "Break long texts into smaller, manageable sections",
                levels: "Emerging & Expanding",
              },
              {
                icon: MessageSquareText,
                name: "Sentence Frames",
                description: "Provide structured sentence starters for writing",
                levels: "All Levels",
              },
              {
                icon: BookA,
                name: "Word Banks",
                description: "Key vocabulary with definitions and context",
                levels: "All Levels",
              },
              {
                icon: Network,
                name: "Visual Organizers",
                description: "Graphic organizers to structure thinking",
                levels: "All Levels",
              },
            ].map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center gap-2 rounded-xl border border-eld-almond-silk/40 p-4 text-center dark:border-gray-700/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eld-almond-silk/30 dark:bg-eld-dusty-grape/30">
                  <cat.icon className="h-5 w-5 text-eld-space-indigo dark:text-eld-almond-silk" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{cat.name}</h4>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
                <span className="text-xs font-medium text-eld-dusty-grape dark:text-eld-lilac-ash">
                  {cat.levels}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Level Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="min-w-max">
            <TabsTrigger value="emerging">
              <span className="flex items-center gap-2">
                Emerging
                <span className="hidden sm:inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  Substantial
                </span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="expanding">
              <span className="flex items-center gap-2">
                Expanding
                <span className="hidden sm:inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                  Moderate
                </span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="bridging">
              <span className="flex items-center gap-2">
                Bridging
                <span className="hidden sm:inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Light
                </span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="emerging">
          <EmergingTab />
        </TabsContent>
        <TabsContent value="expanding">
          <ExpandingTab />
        </TabsContent>
        <TabsContent value="bridging">
          <BridgingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
