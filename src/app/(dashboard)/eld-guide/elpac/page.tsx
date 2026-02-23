"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ClipboardCheck,
  Target,
  FileText,
  Shield,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  Clock,
  Users,
  GraduationCap,
  BarChart3,
  Calendar,
  HelpCircle,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Pencil,
  Headphones,
  Mic,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared Components                                                  */
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

/* ------------------------------------------------------------------ */
/*  Assessment Overview Tab                                            */
/* ------------------------------------------------------------------ */

function AssessmentOverviewTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            About the ELPAC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The <strong className="text-foreground">English Language Proficiency
            Assessments for California (ELPAC)</strong> is the required state
            test for English language proficiency (ELP) that must be given to
            students whose primary language is a language other than English.
            State and federal law require that local educational agencies (LEAs)
            administer a state test of ELP to eligible students in kindergarten
            (or year one of a two-year kindergarten program, sometimes referred
            to as &quot;transitional kindergarten&quot;) through grade twelve.
          </p>
          <p>
            The ELPAC is aligned with the 2012 California English Language
            Development Standards. It was developed by the California Department
            of Education (CDE) in partnership with Educational Testing Service
            (ETS) and replaced the California English Language Development Test
            (CELDT) beginning in 2017–18.
          </p>
          <p>
            The ELPAC has two components:
          </p>
          <ul className="space-y-2 ml-1">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-[10px] font-bold text-blue-800 dark:text-blue-200">1</span>
              <strong className="text-foreground">Initial ELPAC</strong> — Used to identify students as English Learners (ELs) or as Initially Fluent English Proficient (IFEP)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-[10px] font-bold text-purple-800 dark:text-purple-200">2</span>
              <strong className="text-foreground">Summative ELPAC</strong> — Administered annually to measure an EL student&apos;s progress in learning English and to identify the student&apos;s ELP level
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Initial vs Summative Comparison */}
      <SectionHeading>Initial ELPAC vs. Summative ELPAC</SectionHeading>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-base">Initial ELPAC</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-foreground">Purpose:</strong>{" "}
                  Determine whether a student is an English Learner or Initially
                  Fluent English Proficient (IFEP)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-foreground">Who Takes It:</strong>{" "}
                  Students new to California public schools whose Home Language
                  Survey (HLS) indicates a language other than English
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-foreground">When:</strong>{" "}
                  Within 30 calendar days of initial enrollment; administered
                  year-round
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-foreground">Duration:</strong>{" "}
                  Approximately 30–45 minutes for TK–2; 45–75 minutes for
                  grades 3–12 (untimed)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-foreground">Format:</strong>{" "}
                  Paper-based for TK–2; computer-based for 3–12; one-on-one
                  Speaking component for all grades
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <strong className="text-foreground">Results:</strong>{" "}
                  Binary classification: EL or IFEP. Score reports available
                  within 3 weeks of testing.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200/50 dark:border-purple-800/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-base">Summative ELPAC</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div>
                  <strong className="text-foreground">Purpose:</strong>{" "}
                  Measure annual progress toward English proficiency; provide
                  data for reclassification, accountability, and program
                  evaluation
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div>
                  <strong className="text-foreground">Who Takes It:</strong>{" "}
                  All currently identified English Learners in California
                  public schools, grades TK–12
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div>
                  <strong className="text-foreground">When:</strong>{" "}
                  Annually during a fixed testing window, February 1 through
                  May 31
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div>
                  <strong className="text-foreground">Duration:</strong>{" "}
                  Varies by grade span; approximately 1.5–3.5 hours across
                  multiple sessions (untimed)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div>
                  <strong className="text-foreground">Format:</strong>{" "}
                  Paper-based for TK–2; computer-based for 3–12; includes both
                  group-administered and one-on-one components
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                <div>
                  <strong className="text-foreground">Results:</strong>{" "}
                  Overall performance level 1–4; domain levels 1–3; scale
                  scores. Level 4 required for reclassification consideration.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Dates */}
      <SectionHeading>ELPAC Key Dates &amp; Timeline</SectionHeading>
      <Card>
        <CardContent className="pt-5 md:pt-6">
          <div className="relative space-y-0">
            {[
              {
                period: "Year-round",
                event: "Initial ELPAC Administration",
                detail:
                  "Administer within 30 calendar days of a student's first enrollment in a California public school.",
              },
              {
                period: "July – January",
                event: "Summative ELPAC Preparation",
                detail:
                  "LEAs prepare test settings in TOMS, assign test examiners, coordinate logistics, and train staff.",
              },
              {
                period: "February 1 – May 31",
                event: "Summative ELPAC Testing Window",
                detail:
                  "All identified ELs take the Summative ELPAC. Both group and one-on-one components must be completed within the window.",
              },
              {
                period: "June – August",
                event: "Score Reporting & Data Analysis",
                detail:
                  "Score reports are released to districts. Student Score Reports (SSRs) are generated for parents. Districts analyze data for program evaluation.",
              },
              {
                period: "Ongoing (post-results)",
                event: "Reclassification Review",
                detail:
                  "Districts evaluate ELs who scored Level 4 against all reclassification criteria. Parent consultation occurs. Eligible students are reclassified as RFEP.",
              },
              {
                period: "4 years post-RFEP",
                event: "RFEP Monitoring Period",
                detail:
                  "Reclassified students are monitored for academic progress for four years. If they struggle, additional support is provided.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eld-almond-silk/40 dark:bg-eld-dusty-grape/40">
                    <span className="text-xs font-bold text-eld-space-indigo dark:text-eld-almond-silk">
                      {index + 1}
                    </span>
                  </div>
                  {index < 5 && (
                    <div className="mt-1 h-full w-px bg-eld-almond-silk/30 dark:bg-gray-700" />
                  )}
                </div>
                <div className="pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {item.period}
                  </span>
                  <h4 className="mt-0.5 font-semibold text-foreground">
                    {item.event}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Test Domains Tab                                                   */
/* ------------------------------------------------------------------ */

function DomainsTab() {
  return (
    <div className="space-y-6">
      <SectionHeading>The Four ELPAC Domains</SectionHeading>

      <p className="text-sm text-muted-foreground">
        The ELPAC assesses English language proficiency across four domains.
        Each domain is assessed separately and receives its own score. The
        four domain scores combine to produce an overall performance level.
      </p>

      {/* Listening */}
      <Card className="border-blue-200/40 dark:border-blue-800/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Headphones className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Listening</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehension of spoken English
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            The Listening domain assesses students&apos; ability to understand
            spoken English in both academic and social contexts. Students listen
            to a variety of audio stimuli and respond to questions.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-blue-50/50 p-3 dark:bg-blue-900/10">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                Task Types
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700/80 dark:text-blue-300/70">
                <li>&bull; Listen to a short conversation</li>
                <li>&bull; Listen to a classroom presentation</li>
                <li>&bull; Listen to an academic lecture</li>
                <li>&bull; Listen to a read-aloud story</li>
                <li>&bull; Listen and identify main idea/details</li>
              </ul>
            </div>
            <div className="rounded-lg bg-blue-50/50 p-3 dark:bg-blue-900/10">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                Skills Assessed
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700/80 dark:text-blue-300/70">
                <li>&bull; Identifying main ideas and key details</li>
                <li>&bull; Making inferences from spoken text</li>
                <li>&bull; Understanding academic vocabulary in context</li>
                <li>&bull; Following multi-step oral directions</li>
                <li>&bull; Recognizing language used for different purposes</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3 dark:border-blue-800/40 dark:bg-blue-900/5">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-xs uppercase tracking-wider">
              Administration Notes
            </h4>
            <p className="mt-1 text-sm text-blue-700/80 dark:text-blue-300/70">
              The Listening domain is group-administered for grades 3–12
              (computer-based) and individually administered for TK–2 (paper-based).
              Audio is played through headphones (computer) or read aloud by the
              examiner (paper). Students may listen to each audio clip up to
              three times (grades TK–2) or twice (grades 3–12).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Speaking */}
      <Card className="border-green-200/40 dark:border-green-800/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <Mic className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Speaking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Production of spoken English
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            The Speaking domain is always administered one-on-one with a
            trained test examiner. This allows for authentic assessment of oral
            language skills including pronunciation, grammar, vocabulary,
            fluency, and discourse.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-green-50/50 p-3 dark:bg-green-900/10">
              <h4 className="font-semibold text-green-800 dark:text-green-300">
                Task Types
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-green-700/80 dark:text-green-300/70">
                <li>&bull; Describe a picture or scene</li>
                <li>&bull; Retell a story or sequence events</li>
                <li>&bull; Summarize a passage read aloud</li>
                <li>&bull; Present an opinion with supporting reasons</li>
                <li>&bull; Respond to academic prompts orally</li>
                <li>&bull; Engage in a brief conversation with the examiner</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-50/50 p-3 dark:bg-green-900/10">
              <h4 className="font-semibold text-green-800 dark:text-green-300">
                Skills Assessed
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-green-700/80 dark:text-green-300/70">
                <li>&bull; Oral fluency and coherence</li>
                <li>&bull; Vocabulary usage and precision</li>
                <li>&bull; Grammatical accuracy and complexity</li>
                <li>&bull; Pronunciation and intelligibility</li>
                <li>&bull; Discourse organization</li>
                <li>&bull; Use of academic language registers</li>
              </ul>
            </div>
          </div>
          <InfoBanner variant="info">
            The Speaking domain is the most resource-intensive component of the
            ELPAC, requiring trained examiners and private testing spaces. Each
            student&apos;s speaking assessment takes approximately 10–20 minutes
            depending on grade level.
          </InfoBanner>
        </CardContent>
      </Card>

      {/* Reading */}
      <Card className="border-amber-200/40 dark:border-amber-800/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Reading</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehension of written English
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            The Reading domain assesses students&apos; ability to read and
            comprehend written English texts, including both literary and
            informational passages appropriate for their grade span.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-amber-50/50 p-3 dark:bg-amber-900/10">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                Task Types
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-amber-700/80 dark:text-amber-300/70">
                <li>&bull; Read a passage and answer comprehension questions</li>
                <li>&bull; Identify vocabulary meaning in context</li>
                <li>&bull; Analyze text structure and organization</li>
                <li>&bull; Make inferences and draw conclusions</li>
                <li>&bull; Compare/contrast information across texts</li>
              </ul>
            </div>
            <div className="rounded-lg bg-amber-50/50 p-3 dark:bg-amber-900/10">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                Skills Assessed
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-amber-700/80 dark:text-amber-300/70">
                <li>&bull; Literal comprehension</li>
                <li>&bull; Inferential comprehension</li>
                <li>&bull; Vocabulary knowledge (academic and domain-specific)</li>
                <li>&bull; Text analysis and evaluation</li>
                <li>&bull; Understanding text features and structures</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-3 dark:border-amber-800/40 dark:bg-amber-900/5">
            <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-xs uppercase tracking-wider">
              Grade-Span Considerations
            </h4>
            <p className="mt-1 text-sm text-amber-700/80 dark:text-amber-300/70">
              For TK–2 students, the Reading domain is administered one-on-one
              and focuses on foundational literacy skills (letter recognition,
              sight words, simple sentences). For grades 3–12, Reading is
              computer-based and includes increasingly complex literary and
              informational texts with multi-paragraph passages.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Writing */}
      <Card className="border-purple-200/40 dark:border-purple-800/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Pencil className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Writing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Production of written English
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            The Writing domain assesses students&apos; ability to produce
            written English for various academic purposes, including opinion,
            informational, and narrative writing tasks.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-purple-50/50 p-3 dark:bg-purple-900/10">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300">
                Task Types
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-purple-700/80 dark:text-purple-300/70">
                <li>&bull; Write a short opinion/argument essay</li>
                <li>&bull; Write an informational paragraph or essay</li>
                <li>&bull; Describe a process or event in writing</li>
                <li>&bull; Summarize information from a passage</li>
                <li>&bull; Label or complete sentences (TK–2)</li>
                <li>&bull; Write a narrative or personal experience</li>
              </ul>
            </div>
            <div className="rounded-lg bg-purple-50/50 p-3 dark:bg-purple-900/10">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300">
                Skills Assessed
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-purple-700/80 dark:text-purple-300/70">
                <li>&bull; Organization and coherence</li>
                <li>&bull; Development of ideas with details/evidence</li>
                <li>&bull; Grammar and sentence structure variety</li>
                <li>&bull; Academic vocabulary usage</li>
                <li>&bull; Conventions (spelling, punctuation, capitalization)</li>
                <li>&bull; Audience and purpose awareness</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50/30 p-3 dark:border-purple-800/40 dark:bg-purple-900/5">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 text-xs uppercase tracking-wider">
              Scoring Notes
            </h4>
            <p className="mt-1 text-sm text-purple-700/80 dark:text-purple-300/70">
              Writing responses are scored by trained human raters using
              rubrics that evaluate the response holistically. For the
              Summative ELPAC, each writing task receives a score that
              contributes to the overall Writing domain score. Rubrics assess
              both language proficiency and communicative effectiveness.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Domain Weighting */}
      <SectionHeading>Domain Score Weighting</SectionHeading>
      <Card>
        <CardContent className="pt-5 md:pt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            The four domain scores are combined to calculate the overall ELPAC
            performance level. The weighting varies slightly by grade span but
            generally follows this distribution:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { domain: "Listening", pct: "~25%", color: "blue" },
              { domain: "Speaking", pct: "~25%", color: "green" },
              { domain: "Reading", pct: "~25%", color: "amber" },
              { domain: "Writing", pct: "~25%", color: "purple" },
            ].map((item) => {
              const bgMap: Record<string, string> = {
                blue: "bg-blue-100 dark:bg-blue-900/30",
                green: "bg-green-100 dark:bg-green-900/30",
                amber: "bg-amber-100 dark:bg-amber-900/30",
                purple: "bg-purple-100 dark:bg-purple-900/30",
              };
              const textMap: Record<string, string> = {
                blue: "text-blue-800 dark:text-blue-300",
                green: "text-green-800 dark:text-green-300",
                amber: "text-amber-800 dark:text-amber-300",
                purple: "text-purple-800 dark:text-purple-300",
              };
              return (
                <div
                  key={item.domain}
                  className={`rounded-xl p-4 text-center ${bgMap[item.color]}`}
                >
                  <p className={`text-2xl font-bold ${textMap[item.color]}`}>
                    {item.pct}
                  </p>
                  <p className={`text-xs font-medium mt-1 ${textMap[item.color]}`}>
                    {item.domain}
                  </p>
                </div>
              );
            })}
          </div>
          <InfoBanner variant="info">
            For TK–K students, the oral domains (Listening and Speaking) carry
            a greater weight since these students are still developing
            foundational literacy. Exact weighting formulas are available in the
            ELPAC Technical Report published by CDE.
          </InfoBanner>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scoring & Levels Tab                                               */
/* ------------------------------------------------------------------ */

function ScoringTab() {
  return (
    <div className="space-y-6">
      <SectionHeading>Summative ELPAC Performance Levels</SectionHeading>

      <p className="text-sm text-muted-foreground">
        The Summative ELPAC reports an overall performance level from 1 to 4.
        Each level describes the student&apos;s overall English language
        proficiency and maps to the CA ELD Standards proficiency continuum.
      </p>

      <div className="space-y-4">
        <Card className="border-l-4 border-l-red-400 dark:border-l-red-500">
          <CardContent className="pt-5 md:pt-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-800 dark:bg-red-900/30 dark:text-red-300">
                1
              </span>
              <div>
                <h3 className="font-bold text-foreground">
                  Level 1 — Minimally Developed
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students at this level have minimally developed oral (listening
                  and speaking) and written (reading and writing) English skills.
                  They tend to understand and use only very familiar English
                  words, short phrases, and formulaic expressions.
                </p>
                <div className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                    ELD Standards Alignment: Lower Emerging
                  </p>
                  <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/70">
                    These students require substantial linguistic support and
                    scaffolding in all content areas. Focus on developing
                    receptive language skills and basic communicative competence.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400 dark:border-l-orange-500">
          <CardContent className="pt-5 md:pt-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                2
              </span>
              <div>
                <h3 className="font-bold text-foreground">
                  Level 2 — Somewhat Developed
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students at this level demonstrate somewhat developed oral and
                  written English skills. They can use English to meet some
                  immediate communication needs but often struggle with more
                  abstract, complex academic language.
                </p>
                <div className="mt-3 rounded-lg bg-orange-50 p-3 dark:bg-orange-900/10">
                  <p className="text-xs font-semibold text-orange-800 dark:text-orange-300">
                    ELD Standards Alignment: Upper Emerging / Lower Expanding
                  </p>
                  <p className="mt-1 text-xs text-orange-700/80 dark:text-orange-300/70">
                    These students benefit from moderate scaffolding, including
                    sentence frames, graphic organizers, and pre-taught
                    vocabulary. They are building foundational academic language.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-400 dark:border-l-yellow-500">
          <CardContent className="pt-5 md:pt-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-lg font-bold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                3
              </span>
              <div>
                <h3 className="font-bold text-foreground">
                  Level 3 — Moderately Developed
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students at this level demonstrate moderately developed oral
                  and written English skills. They can use English to learn
                  academic content in most areas with some linguistic support.
                  They show increasing independence with academic language.
                </p>
                <div className="mt-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/10">
                  <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                    ELD Standards Alignment: Upper Expanding / Lower Bridging
                  </p>
                  <p className="mt-1 text-xs text-yellow-700/80 dark:text-yellow-300/70">
                    These students are approaching reclassification readiness.
                    They benefit from light scaffolding and continued academic
                    vocabulary development. Focus on complex sentence structures
                    and extended discourse.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400 dark:border-l-green-500">
          <CardContent className="pt-5 md:pt-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                4
              </span>
              <div>
                <h3 className="font-bold text-foreground">
                  Level 4 — Well Developed
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students at this level demonstrate well-developed oral and
                  written English skills. They can use English to learn and
                  communicate in meaningful ways that are comparable to those
                  of native English speakers. They show strong command of
                  academic language.
                </p>
                <div className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/10">
                  <p className="text-xs font-semibold text-green-800 dark:text-green-300">
                    ELD Standards Alignment: Upper Bridging
                  </p>
                  <p className="mt-1 text-xs text-green-700/80 dark:text-green-300/70">
                    Students scoring at Level 4 meet one of the four required
                    criteria for reclassification as RFEP. They may still
                    benefit from some linguistic support for highly technical
                    or specialized academic content.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SectionHeading className="pt-2">Domain Performance Levels</SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            In addition to the overall performance level (1–4), each domain
            receives a performance level of 1–3:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-eld-almond-silk/40 dark:border-gray-700">
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Level
                  </th>
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Label
                  </th>
                  <th className="pb-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      1
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Beginning
                  </td>
                  <td className="py-3">
                    English skills in this domain are beginning to develop.
                    Student shows limited ability to understand or produce
                    language in this area.
                  </td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      2
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Somewhat/Moderately Developed
                  </td>
                  <td className="py-3">
                    English skills in this domain are developing. Student can
                    understand and produce some academic language but
                    inconsistently.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      3
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Well Developed
                  </td>
                  <td className="py-3">
                    English skills in this domain are well developed. Student
                    demonstrates strong ability to understand and produce
                    academic language consistently.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <InfoBanner variant="info">
            Domain-level scores help teachers identify specific areas of
            strength and need for each student. A student might be &quot;Well
            Developed&quot; in Speaking but &quot;Beginning&quot; in Writing,
            indicating a need for targeted writing instruction.
          </InfoBanner>
        </CardContent>
      </Card>

      <SectionHeading className="pt-2">
        Understanding Scale Scores
      </SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            Scale scores are the numeric scores that underlie the performance
            levels. They provide a more precise measure of a student&apos;s
            English proficiency and enable year-over-year comparisons:
          </p>
          <ul className="space-y-2 ml-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  Overall Scale Score:
                </strong>{" "}
                Ranges from approximately 1150 to 1900+ depending on the grade
                span. Each performance level has a defined scale score range.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  Domain Scale Scores:
                </strong>{" "}
                Each domain also has a scale score that maps to the 1–3 domain
                performance levels. Domain scores help identify specific
                instructional needs.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">Year-over-Year Growth:</strong>{" "}
                Because scale scores are on a continuous scale, they can be used
                to measure growth from one year to the next, even if the
                performance level remains the same.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Administration & Logistics Tab                                     */
/* ------------------------------------------------------------------ */

function AdminTab() {
  return (
    <div className="space-y-6">
      <SectionHeading>Test Administration Requirements</SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="Test Examiner Qualifications"
          icon={Users}
          defaultOpen
        >
          <div className="space-y-3">
            <p>
              ELPAC test examiners must meet specific requirements:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Credentialed Staff:
                  </strong>{" "}
                  Must hold a valid California teaching credential, pupil
                  personnel services credential, or administrative credential
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Annual Training:
                  </strong>{" "}
                  Must complete the ELPAC examiner training annually, which
                  includes calibration scoring and administration procedures
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Speaking Domain Training:
                  </strong>{" "}
                  Examiners administering the one-on-one Speaking domain must
                  complete additional calibration scoring training to ensure
                  reliable scoring
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Paraprofessionals:
                  </strong>{" "}
                  Classified staff (paraprofessionals) may administer the ELPAC
                  under the direct supervision of a certificated employee, per
                  Education Code Section 313
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Testing Environment & Setup"
          icon={Shield}
        >
          <div className="space-y-3">
            <p>
              The testing environment must meet specific standards:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Group Testing:</strong>{" "}
                Quiet, well-lit room with adequate spacing between students;
                working computers with headphones for grades 3–12
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  One-on-One Testing:
                </strong>{" "}
                Private or semi-private space free from distractions; audio
                recording capability if required by district
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Technology:</strong>{" "}
                Computers must meet minimum system requirements; the Secure
                Browser must be installed for computer-based testing
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Test Security:
                </strong>{" "}
                All test materials must be kept secure; test content must not
                be reproduced, discussed, or shared
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Accommodations & Accessibility Resources"
          icon={Shield}
        >
          <div className="space-y-3">
            <p>
              The ELPAC provides a tiered system of accessibility resources:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
                <h4 className="font-semibold text-foreground">
                  Universal Tools (Available to All Students)
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 text-sm">
                  <span>&bull; Breaks</span>
                  <span>&bull; Scratch paper</span>
                  <span>&bull; Highlighter (computer)</span>
                  <span>&bull; Zoom/magnification (computer)</span>
                  <span>&bull; Mark for review (computer)</span>
                  <span>&bull; Strikethrough (computer)</span>
                  <span>&bull; Line reader (computer)</span>
                </div>
              </div>

              <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
                <h4 className="font-semibold text-foreground">
                  Designated Supports (For Students with Documented Need)
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 text-sm">
                  <span>&bull; Extended testing time</span>
                  <span>&bull; Separate testing room</span>
                  <span>&bull; Specialized lighting/acoustics</span>
                  <span>&bull; Simplified test directions</span>
                  <span>&bull; Supervised breaks</span>
                  <span>&bull; Adaptive/assistive technology</span>
                </div>
              </div>

              <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
                <h4 className="font-semibold text-foreground">
                  Accommodations (For Students with IEP/504 Plans)
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 text-sm">
                  <span>&bull; Braille</span>
                  <span>&bull; Large print</span>
                  <span>&bull; Speech-to-text</span>
                  <span>&bull; Scribe</span>
                  <span>&bull; ASL (non-Listening items)</span>
                  <span>&bull; Closed captioning (non-Listening)</span>
                  <span>&bull; Alternate response options</span>
                  <span>&bull; Noise buffers</span>
                </div>
              </div>
            </div>

            <InfoBanner variant="warning">
              Accommodations must be documented in the student&apos;s IEP or
              504 plan AND entered into TOMS before testing begins. Test
              coordinators should verify that all accommodations are properly
              recorded.
            </InfoBanner>
          </div>
        </Collapsible>

        <Collapsible title="TOMS (Test Operations Management System)" icon={ListChecks}>
          <div className="space-y-3">
            <p>
              TOMS is the online system used by LEAs to manage ELPAC
              administration. Key functions include:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Student Registration:</strong>{" "}
                Enrolling students for testing and assigning them to test
                sessions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Accessibility Resources:
                </strong>{" "}
                Recording designated supports and accommodations for each student
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Test Management:</strong>{" "}
                Tracking test completion status, managing make-up testing, and
                handling appeals
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Score Retrieval:</strong>{" "}
                Accessing student-level score data after scoring is complete
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Reporting:</strong>{" "}
                Generating aggregate reports for schools, districts, and
                demographic groups
              </li>
            </ul>
          </div>
        </Collapsible>
      </div>

      <SectionHeading className="pt-2">
        Reclassification Using ELPAC Data
      </SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            The Summative ELPAC is the primary data source for reclassification
            decisions. The complete reclassification process requires four
            criteria to be met:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/30 p-4 dark:border-green-800/40 dark:bg-green-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-sm font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                1
              </span>
              <div>
                <strong className="text-green-800 dark:text-green-300">
                  ELPAC Score
                </strong>
                <p className="mt-0.5 text-xs text-green-700/80 dark:text-green-300/70">
                  Overall performance level of 4 (Well Developed) on the
                  Summative ELPAC
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/30 p-4 dark:border-green-800/40 dark:bg-green-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-sm font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                2
              </span>
              <div>
                <strong className="text-green-800 dark:text-green-300">
                  Teacher Evaluation
                </strong>
                <p className="mt-0.5 text-xs text-green-700/80 dark:text-green-300/70">
                  Teacher assessment of academic performance, including
                  English language arts, using objective measures
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/30 p-4 dark:border-green-800/40 dark:bg-green-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-sm font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                3
              </span>
              <div>
                <strong className="text-green-800 dark:text-green-300">
                  Parent Consultation
                </strong>
                <p className="mt-0.5 text-xs text-green-700/80 dark:text-green-300/70">
                  Parent/guardian opinion and consultation (parents must be
                  notified and given opportunity to participate)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/30 p-4 dark:border-green-800/40 dark:bg-green-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-sm font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                4
              </span>
              <div>
                <strong className="text-green-800 dark:text-green-300">
                  Academic Comparison
                </strong>
                <p className="mt-0.5 text-xs text-green-700/80 dark:text-green-300/70">
                  Performance on CAASPP/SBAC or equivalent assessment compared
                  with English proficient peers
                </p>
              </div>
            </div>
          </div>

          <InfoBanner variant="success">
            When all four criteria are met, the student is reclassified as
            Reclassified Fluent English Proficient (RFEP). The district then
            monitors the student&apos;s academic progress for four years to
            ensure they continue to succeed without ELD support.
          </InfoBanner>
        </CardContent>
      </Card>

      <SectionHeading className="pt-2">
        Frequently Asked Questions
      </SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="Can a parent refuse ELPAC testing?"
          icon={HelpCircle}
          defaultOpen
        >
          <p>
            No. Under state law (Education Code Section 313), the ELPAC is a
            required state assessment. Parents cannot opt their children out of
            the ELPAC. If a student&apos;s Home Language Survey indicates a
            language other than English, the student must take the Initial ELPAC.
            Once classified as an EL, the student must take the Summative ELPAC
            annually until reclassified.
          </p>
        </Collapsible>

        <Collapsible
          title="What happens if a student misses the testing window?"
          icon={HelpCircle}
        >
          <p>
            Districts should make every reasonable effort to test all ELs during
            the February 1 – May 31 window. If a student is absent, the
            district must provide make-up testing opportunities. If a student
            does not complete the ELPAC within the testing window, the student
            retains their current EL classification and cannot be considered for
            reclassification that year. The student&apos;s participation status
            is reported to CDE and factors into the school&apos;s and
            district&apos;s accountability data.
          </p>
        </Collapsible>

        <Collapsible
          title="How do ELPAC scores relate to the CA Dashboard?"
          icon={HelpCircle}
        >
          <p>
            ELPAC results feed into the California School Dashboard&apos;s
            English Learner Progress Indicator (ELPI). The ELPI measures the
            percentage of ELs making progress toward English proficiency,
            as well as the reclassification rate. Schools and districts are
            evaluated on this indicator as part of California&apos;s
            accountability system. Low performance on the ELPI may trigger
            differentiated assistance from the county office of education.
          </p>
        </Collapsible>

        <Collapsible
          title="Can ELPAC scores be used for grading?"
          icon={HelpCircle}
        >
          <p>
            ELPAC scores should not be used as a direct factor in determining
            a student&apos;s course grade. The ELPAC measures English language
            proficiency, not content knowledge or academic performance. However,
            ELPAC data can and should inform instructional decisions, including
            how to differentiate instruction and scaffold assignments for
            English Learners at different proficiency levels.
          </p>
        </Collapsible>

        <Collapsible
          title="What resources are available for ELPAC preparation?"
          icon={HelpCircle}
        >
          <div className="space-y-3">
            <p>
              The CDE and ETS provide several free resources:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Practice Tests:</strong>{" "}
                Full-length practice tests for all grade spans, available on the
                ELPAC website
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Training Tests:</strong>{" "}
                Interactive training tests that familiarize students with the
                computer-based format and question types
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Examiner Training Materials:
                </strong>{" "}
                Manuals, scoring guides, calibration videos, and
                administration guides
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Parent Guides:
                </strong>{" "}
                Multilingual parent information guides explaining the ELPAC,
                score reports, and how to support ELs at home
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="What is the difference between ELPAC and CELDT?"
          icon={HelpCircle}
        >
          <div className="space-y-3">
            <p>
              The ELPAC replaced the California English Language Development
              Test (CELDT) beginning in 2017–18. Key differences include:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Standards Alignment:</strong>{" "}
                ELPAC is aligned with the 2012 CA ELD Standards; CELDT was
                aligned with the older 1999 standards
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Two Assessments:</strong>{" "}
                ELPAC separates the initial identification (Initial ELPAC) and
                annual progress monitoring (Summative ELPAC) into distinct
                assessments; CELDT served both purposes with one test
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">Computer-Based:</strong>{" "}
                ELPAC is primarily computer-based for grades 3–12; CELDT was
                entirely paper-based
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Academic Focus:
                </strong>{" "}
                ELPAC places greater emphasis on academic language across
                content areas, reflecting the demands of the CA ELD Standards
              </li>
            </ul>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ELPAC Page Component                                          */
/* ------------------------------------------------------------------ */

export default function ElpacPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/eld-guide"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to ELD Guide
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="scaffold-heading">ELPAC Assessment Guide</h1>
        <p className="scaffold-description mt-1">
          Complete guide to the English Language Proficiency Assessments for
          California — test structure, domains, scoring, administration, and
          reclassification.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-eld-almond-silk/40 bg-white p-5 md:flex-row md:items-center md:gap-6 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
          <ClipboardCheck className="h-7 w-7 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            English Language Proficiency Assessments for California
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The ELPAC is California&apos;s required state assessment for
            measuring English language proficiency of students whose primary
            language is not English. It consists of the Initial ELPAC (for
            identification) and the Summative ELPAC (for annual progress
            monitoring).
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col items-center rounded-xl border border-eld-almond-silk/40 bg-white p-4 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-xs text-muted-foreground">Test Domains</p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-eld-almond-silk/40 bg-white p-4 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-2xl font-bold text-foreground">6</p>
          <p className="text-xs text-muted-foreground">Grade Spans</p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-eld-almond-silk/40 bg-white p-4 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-xs text-muted-foreground">Performance Levels</p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-eld-almond-silk/40 bg-white p-4 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-2xl font-bold text-foreground">Feb–May</p>
          <p className="text-xs text-muted-foreground">Testing Window</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="min-w-max">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domains">Test Domains</TabsTrigger>
            <TabsTrigger value="scoring">Scoring &amp; Levels</TabsTrigger>
            <TabsTrigger value="admin">Administration</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <AssessmentOverviewTab />
        </TabsContent>
        <TabsContent value="domains">
          <DomainsTab />
        </TabsContent>
        <TabsContent value="scoring">
          <ScoringTab />
        </TabsContent>
        <TabsContent value="admin">
          <AdminTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
