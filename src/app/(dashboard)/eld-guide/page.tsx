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
  Scale,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ScrollText,
  Users,
  Clock,
  Target,
  Info,
  Shield,
  Landmark,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Collapsible Section Component                                      */
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

/* ------------------------------------------------------------------ */
/*  Info Banner                                                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-eld-almond-silk/40 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-eld-almond-silk/30 dark:bg-eld-dusty-grape/30">
        <Icon className="h-5 w-5 text-eld-space-indigo dark:text-eld-almond-silk" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Heading                                                    */
/* ------------------------------------------------------------------ */

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
/*  Overview Tab                                                       */
/* ------------------------------------------------------------------ */

function OverviewTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            What is English Language Development (ELD)?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            English Language Development (ELD) is specialized instruction
            designed to help English Learners (ELs) acquire English language
            proficiency in listening, speaking, reading, and writing. In
            California, ELD instruction is a legal requirement for all
            identified English Learners and is governed by the California
            Department of Education (CDE).
          </p>
          <p>
            California adopted the{" "}
            <strong className="text-foreground">
              California English Language Development Standards
            </strong>{" "}
            in 2012 (updated in 2014), which are designed to be used alongside
            the California Common Core State Standards for English Language Arts
            (CA CCSS for ELA/Literacy). These standards define three
            proficiency levels:{" "}
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
              Emerging
            </span>
            ,{" "}
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              Expanding
            </span>
            , and{" "}
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Bridging
            </span>
            .
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="ELs in California (approx.)"
          value="1.1M+"
        />
        <StatCard
          icon={ScrollText}
          label="Languages Represented"
          value="60+"
        />
        <StatCard
          icon={GraduationCap}
          label="CA ELD Proficiency Levels"
          value="3"
        />
        <StatCard
          icon={ClipboardCheck}
          label="ELPAC Test Domains"
          value="4"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Two Types of ELD Instruction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl border border-eld-almond-silk/40 p-4 dark:border-gray-700/60">
            <h3 className="font-semibold text-foreground">
              Designated ELD (dELD)
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              A protected time during the regular school day when teachers
              provide lessons focused specifically on the CA ELD Standards.
              During Designated ELD, ELs are grouped by English proficiency
              level and receive targeted instruction to advance their English
              language skills. This is a <strong>legal requirement</strong> for
              all English Learners in California.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Minimum 30 minutes daily for elementary, recommended 45+ minutes
                for secondary
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Students grouped by proficiency level (Emerging, Expanding,
                Bridging)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Instruction focuses on language forms, functions, and fluency
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Must be aligned to the CA ELD Standards
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-eld-almond-silk/40 p-4 dark:border-gray-700/60">
            <h3 className="font-semibold text-foreground">
              Integrated ELD (iELD)
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              ELD instruction that occurs throughout the school day across all
              content areas. All teachers of English Learners are responsible
              for incorporating ELD standards into their content-area
              instruction. This ensures ELs can access grade-level content while
              continuing to develop English proficiency.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Occurs in all content areas (Math, Science, Social Studies, etc.)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Teachers use scaffolding strategies to make content accessible
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                ELs participate in mainstream instruction with support
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Uses CA ELD Standards Part I in tandem with content standards
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            California ELD Standards Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The CA ELD Standards are organized into two parts:
          </p>

          <div className="space-y-3">
            <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
              <h4 className="font-semibold text-foreground">
                Part I: Interacting in Meaningful Ways
              </h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <strong>A. Collaborative</strong> &mdash; Exchanging
                  information and ideas, interacting via written English,
                  offering opinions and negotiating
                </li>
                <li>
                  <strong>B. Interpretive</strong> &mdash; Listening actively,
                  reading closely, evaluating language choices, analyzing how
                  writers use language
                </li>
                <li>
                  <strong>C. Productive</strong> &mdash; Supporting opinions,
                  writing literary and informational texts, presenting
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
              <h4 className="font-semibold text-foreground">
                Part II: Learning About How English Works
              </h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <strong>A. Structuring Cohesive Texts</strong> &mdash;
                  Understanding text structure, cohesion
                </li>
                <li>
                  <strong>B. Expanding &amp; Enriching Ideas</strong> &mdash;
                  Using verbs, nouns, modifying to add details
                </li>
                <li>
                  <strong>C. Connecting &amp; Condensing Ideas</strong> &mdash;
                  Connecting and condensing ideas using a variety of linguistic
                  resources
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            ELD Proficiency Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50/50 p-4 dark:border-red-500 dark:bg-red-900/10">
            <h4 className="font-semibold text-red-800 dark:text-red-300">
              Emerging
            </h4>
            <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/70">
              Students at this level typically progress very quickly,
              learning to use English for immediate communicative needs and
              beginning to understand and use academic vocabulary and other
              features of academic language. They may demonstrate understanding
              of content topics with substantial linguistic support. They often
              use short phrases, simple sentences, and formulaic expressions.
            </p>
          </div>

          <div className="rounded-xl border-l-4 border-orange-400 bg-orange-50/50 p-4 dark:border-orange-500 dark:bg-orange-900/10">
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">
              Expanding
            </h4>
            <p className="mt-1 text-sm text-orange-700/80 dark:text-orange-300/70">
              Students at this level are challenged to increase their
              English language skills in more contexts and apply a greater
              variety of linguistic features. They can use a growing number of
              general academic and domain-specific words, varied sentence
              structures, and more complex grammar. They demonstrate increased
              ability to participate in classroom discussions on a wider range of
              topics.
            </p>
          </div>

          <div className="rounded-xl border-l-4 border-green-400 bg-green-50/50 p-4 dark:border-green-500 dark:bg-green-900/10">
            <h4 className="font-semibold text-green-800 dark:text-green-300">
              Bridging
            </h4>
            <p className="mt-1 text-sm text-green-700/80 dark:text-green-300/70">
              Students at this level continue to learn and apply a range of
              high-level English language skills in a wide variety of contexts,
              including comprehension and production of highly technical texts.
              They can participate fully in grade-level academic tasks and
              demonstrate academic English proficiency comparable to that of
              native English speakers, although they may still benefit from some
              linguistic support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Legal Requirements Tab                                             */
/* ------------------------------------------------------------------ */

function LegalTab() {
  return (
    <div className="space-y-6">
      <InfoBanner variant="warning">
        <strong>Disclaimer:</strong> This page is for informational purposes
        only and should not be considered legal advice. Always consult the
        official CDE resources and your district&apos;s legal counsel for
        authoritative guidance.
      </InfoBanner>

      <SectionHeading>Federal Legislation</SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="Title III of the Every Student Succeeds Act (ESSA)"
          icon={Landmark}
          defaultOpen
        >
          <div className="space-y-3">
            <p>
              Title III of ESSA (2015) is the primary federal law governing the
              education of English Learners. It requires states and districts to:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Identify and assess all potential English Learners within 30
                days of enrollment
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Provide language instruction educational programs (LIEPs) for
                all identified ELs
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Notify parents of EL identification within 30 days of the start
                of the school year (or within two weeks for students identified
                during the year)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Annually assess English proficiency using state-approved
                assessments (ELPAC in California)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Establish standardized reclassification criteria
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Monitor reclassified students (RFEPs) for four years after
                reclassification
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Lau v. Nichols (1974) — Supreme Court Decision"
          icon={Scale}
        >
          <div className="space-y-3">
            <p>
              This landmark U.S. Supreme Court case established that school
              districts must take affirmative steps to address the language
              barriers of English Learners. The Court held that simply providing
              the same facilities, textbooks, teachers, and curriculum to
              students who do not understand English effectively denies them a
              meaningful education.
            </p>
            <p>
              <strong className="text-foreground">Key ruling:</strong>{" "}
              &quot;There is no equality of treatment merely by providing
              students with the same facilities, textbooks, teachers, and
              curriculum; for students who do not understand English are
              effectively foreclosed from any meaningful education.&quot;
            </p>
            <p>
              This decision forms the legal foundation for all ELD programs
              nationwide and is the basis upon which California&apos;s ELD
              requirements are built.
            </p>
          </div>
        </Collapsible>

        <Collapsible
          title="Castañeda v. Pickard (1981) — Three-Part Test"
          icon={Scale}
        >
          <div className="space-y-3">
            <p>
              The Fifth Circuit Court of Appeals established a three-part test
              that EL programs must meet:
            </p>
            <ol className="list-decimal ml-5 space-y-2">
              <li>
                <strong className="text-foreground">
                  Theory-based program:
                </strong>{" "}
                The program must be based on a sound educational theory or
                recognized as a legitimate experimental strategy.
              </li>
              <li>
                <strong className="text-foreground">
                  Adequate implementation:
                </strong>{" "}
                The program must be reasonably calculated to implement
                effectively the educational theory adopted, including adequate
                resources, materials, and qualified staff.
              </li>
              <li>
                <strong className="text-foreground">
                  Program effectiveness:
                </strong>{" "}
                After a trial period, the program must produce results
                indicating that language barriers are being overcome. If not,
                the program must be modified.
              </li>
            </ol>
          </div>
        </Collapsible>

        <Collapsible title="Equal Educational Opportunities Act (EEOA) of 1974" icon={Shield}>
          <div className="space-y-3">
            <p>
              The EEOA prohibits states from denying equal educational
              opportunities to individuals based on race, color, sex, or
              national origin. Section 1703(f) specifically requires educational
              agencies to take &quot;appropriate action to overcome language
              barriers that impede equal participation by its students in its
              instructional programs.&quot;
            </p>
          </div>
        </Collapsible>
      </div>

      <SectionHeading className="pt-2">
        California State Legislation
      </SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="Proposition 58 — California Education for a Global Economy Initiative (2016)"
          icon={ScrollText}
          defaultOpen
        >
          <div className="space-y-3">
            <p>
              Proposition 58, also known as the{" "}
              <strong className="text-foreground">
                California Ed.G.E. (Education for a Global Economy) Initiative
              </strong>
              , was approved by voters in November 2016 and replaced the
              restrictive English-only provisions of Proposition 227 (1998).
            </p>
            <p>Key provisions include:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Schools may establish dual-language immersion programs,
                transitional/developmental bilingual programs, or other language
                acquisition programs
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Parents may request specific language programs for their children
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                If 20+ parents at a school (or 30+ parents in a district)
                request a language acquisition program, the school/district must
                respond
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                EL students must be provided Designated and Integrated ELD
                regardless of program type
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="California Education Code § 300–340 — English Language Education"
          icon={FileText}
        >
          <div className="space-y-3">
            <p>
              These sections of the California Education Code establish the
              framework for educating English Learners:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 text-center font-bold text-eld-space-indigo dark:text-eld-almond-silk">§</span>
                <strong className="text-foreground">EC § 305:</strong> Defines
                language acquisition programs, including Structured English
                Immersion (SEI), dual-language immersion, and transitional
                bilingual programs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 text-center font-bold text-eld-space-indigo dark:text-eld-almond-silk">§</span>
                <strong className="text-foreground">EC § 306:</strong>{" "}
                Establishes requirements for EL programs, including that they
                must be designed using evidence-based approaches and must lead to
                grade-level proficiency
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 text-center font-bold text-eld-space-indigo dark:text-eld-almond-silk">§</span>
                <strong className="text-foreground">EC § 310:</strong> Defines
                parent and community engagement requirements, including the
                parent notification and language program request process
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 text-center font-bold text-eld-space-indigo dark:text-eld-almond-silk">§</span>
                <strong className="text-foreground">EC § 313:</strong>{" "}
                Establishes the English Language Proficiency Assessment for
                California (ELPAC) as the state assessment for ELs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 text-center font-bold text-eld-space-indigo dark:text-eld-almond-silk">§</span>
                <strong className="text-foreground">EC § 313.3:</strong>{" "}
                Defines the reclassification criteria that must be met before an
                EL can be reclassified as Fluent English Proficient (RFEP)
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="AB 2735 — English Learner Roadmap Implementation (2018)"
          icon={ScrollText}
        >
          <div className="space-y-3">
            <p>
              Assembly Bill 2735 aligned the California Education Code with the
              English Learner Roadmap Policy adopted by the State Board of
              Education in 2017. Key provisions:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Requires districts to provide effective EL programs based on the
                EL Roadmap principles
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Emphasizes asset-based pedagogy that values students&apos; home
                languages and cultures
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Supports the development of programs that lead to bilingualism
                and biliteracy
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="SB 463 — English Learner Reclassification (2019)"
          icon={ScrollText}
        >
          <div className="space-y-3">
            <p>
              Senate Bill 463 updated reclassification criteria and process
              requirements:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Established standardized statewide criteria for reclassification
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Requires comparison of EL performance to that of English-only
                peers on academic assessments
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Mandates teacher evaluation of student&apos;s English
                proficiency for reclassification
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Requires parent consultation during the reclassification process
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="California English Learner Roadmap Policy (2017)"
          icon={Target}
        >
          <div className="space-y-3">
            <p>
              The EL Roadmap, adopted by the State Board of Education, serves as
              the guiding policy document for all California districts. It is
              built on four interrelated principles:
            </p>
            <ol className="list-decimal ml-5 space-y-3">
              <li>
                <strong className="text-foreground">
                  Assets-Oriented and Needs-Responsive
                </strong>
                <p className="mt-0.5">
                  ELs&apos; home languages and cultures are valuable assets.
                  Programs should value and build on these resources while
                  addressing students&apos; linguistic and academic needs.
                </p>
              </li>
              <li>
                <strong className="text-foreground">
                  Intellectual Quality of Instruction and Meaningful Access
                </strong>
                <p className="mt-0.5">
                  ELs should engage in intellectually rich, standards-based
                  instruction with appropriate scaffolds and supports across all
                  content areas.
                </p>
              </li>
              <li>
                <strong className="text-foreground">
                  System Conditions That Support Effectiveness
                </strong>
                <p className="mt-0.5">
                  Leadership, adequate resources, professional development,
                  appropriate assessments, and family engagement create
                  conditions for effective EL programs.
                </p>
              </li>
              <li>
                <strong className="text-foreground">
                  Alignment and Articulation Within and Across Systems
                </strong>
                <p className="mt-0.5">
                  EL services should be aligned and articulated across grade
                  levels, programs, and educational systems from preschool
                  through higher education.
                </p>
              </li>
            </ol>
          </div>
        </Collapsible>
      </div>

      <SectionHeading className="pt-2">
        Key Legal Requirements for Schools
      </SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-eld-almond-silk/40 dark:border-gray-700">
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Requirement
                  </th>
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Timeline
                  </th>
                  <th className="pb-3 text-left font-semibold text-foreground">
                    Authority
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Administer Home Language Survey (HLS)
                  </td>
                  <td className="py-3 pr-4">At enrollment</td>
                  <td className="py-3">EC § 52164.1</td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Assess potential ELs with Initial ELPAC
                  </td>
                  <td className="py-3 pr-4">Within 30 days of enrollment</td>
                  <td className="py-3">EC § 313, 5 CCR § 11511</td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Notify parents of EL identification
                  </td>
                  <td className="py-3 pr-4">
                    Within 30 days of school year start
                  </td>
                  <td className="py-3">ESSA Title III, EC § 313.2</td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Provide Designated ELD instruction daily
                  </td>
                  <td className="py-3 pr-4">Daily / ongoing</td>
                  <td className="py-3">EC § 305–306</td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Provide Integrated ELD in all content
                  </td>
                  <td className="py-3 pr-4">Daily / ongoing</td>
                  <td className="py-3">EC § 305–306</td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Administer Summative ELPAC annually
                  </td>
                  <td className="py-3 pr-4">Feb 1 – May 31</td>
                  <td className="py-3">EC § 313</td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4">
                    Evaluate ELs for reclassification annually
                  </td>
                  <td className="py-3 pr-4">Annually</td>
                  <td className="py-3">EC § 313.3</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">
                    Monitor RFEPs for academic progress
                  </td>
                  <td className="py-3 pr-4">4 years post-reclassification</td>
                  <td className="py-3">ESSA Title III</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rules & Compliance Tab                                             */
/* ------------------------------------------------------------------ */

function RulesTab() {
  return (
    <div className="space-y-6">
      <SectionHeading>ELD Program Compliance Requirements</SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="EL Identification & Assessment Process"
          icon={ClipboardCheck}
          defaultOpen
        >
          <div className="space-y-3">
            <p>California follows a specific process for identifying English Learners:</p>
            <ol className="list-decimal ml-5 space-y-3">
              <li>
                <strong className="text-foreground">
                  Home Language Survey (HLS):
                </strong>{" "}
                Upon enrollment, parents/guardians complete the HLS. If any of
                the first three questions indicate a language other than English,
                the student must be assessed.
              </li>
              <li>
                <strong className="text-foreground">
                  Initial ELPAC Administration:
                </strong>{" "}
                Students flagged by the HLS must take the Initial ELPAC within
                30 calendar days of enrollment. The Initial ELPAC determines if
                the student is an English Learner (EL) or an Initially Fluent
                English Proficient (IFEP) student.
              </li>
              <li>
                <strong className="text-foreground">
                  Classification:
                </strong>{" "}
                Based on the Initial ELPAC results, students are classified as
                EL or IFEP. EL students are placed in an appropriate language
                acquisition program.
              </li>
              <li>
                <strong className="text-foreground">
                  Annual Assessment:
                </strong>{" "}
                EL students take the Summative ELPAC each year until they meet
                reclassification criteria.
              </li>
            </ol>
          </div>
        </Collapsible>

        <Collapsible
          title="Reclassification Criteria (RFEP)"
          icon={GraduationCap}
        >
          <div className="space-y-3">
            <p>
              For an English Learner to be reclassified as Fluent English
              Proficient (RFEP), California requires all four of these criteria
              to be met:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800/40 dark:bg-green-900/10">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                  1
                </span>
                <div>
                  <strong className="text-green-800 dark:text-green-300">
                    ELPAC Overall Score:
                  </strong>
                  <p className="text-green-700/80 dark:text-green-300/70">
                    Overall performance level of 4 on the Summative ELPAC
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800/40 dark:bg-green-900/10">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                  2
                </span>
                <div>
                  <strong className="text-green-800 dark:text-green-300">
                    Teacher Evaluation:
                  </strong>
                  <p className="text-green-700/80 dark:text-green-300/70">
                    Teacher evaluation of the student&apos;s academic
                    performance, including English language arts, using an
                    objective assessment instrument (curriculum-based measures)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800/40 dark:bg-green-900/10">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                  3
                </span>
                <div>
                  <strong className="text-green-800 dark:text-green-300">
                    Parent Consultation:
                  </strong>
                  <p className="text-green-700/80 dark:text-green-300/70">
                    Parent/guardian opinion and consultation as part of the
                    reclassification process
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800/40 dark:bg-green-900/10">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                  4
                </span>
                <div>
                  <strong className="text-green-800 dark:text-green-300">
                    Academic Performance:
                  </strong>
                  <p className="text-green-700/80 dark:text-green-300/70">
                    Comparison of student performance on an objective assessment
                    of basic skills (e.g., CAASPP/SBAC) with that of English
                    proficient students of the same age
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Collapsible>

        <Collapsible
          title="Teacher Qualifications & Authorization"
          icon={Users}
        >
          <div className="space-y-3">
            <p>
              California requires specific authorizations for teachers working
              with English Learners:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    EL Authorization:
                  </strong>{" "}
                  All teachers of ELs must hold a valid EL Authorization (or
                  equivalent, such as CLAD, BCLAD, or SB 2042 credential with
                  embedded EL authorization)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Bilingual Authorization:
                  </strong>{" "}
                  Teachers in bilingual programs must hold a Bilingual
                  Authorization in the target language
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Professional Development:
                  </strong>{" "}
                  Districts must provide ongoing professional development in
                  ELD instructional strategies for all teachers
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Instructional Time Requirements"
          icon={Clock}
        >
          <div className="space-y-3">
            <p>
              While California does not mandate an exact number of minutes for
              Designated ELD at every grade level, the following are CDE
              recommendations and common district practices:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-eld-almond-silk/40 dark:border-gray-700">
                    <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                      Grade Level
                    </th>
                    <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                      Recommended dELD
                    </th>
                    <th className="pb-3 text-left font-semibold text-foreground">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4">TK–K</td>
                    <td className="py-3 pr-4">20–30 min/day</td>
                    <td className="py-3">
                      Focus on oral language development
                    </td>
                  </tr>
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4">Grades 1–3</td>
                    <td className="py-3 pr-4">30–45 min/day</td>
                    <td className="py-3">
                      Includes literacy-focused ELD
                    </td>
                  </tr>
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4">Grades 4–5</td>
                    <td className="py-3 pr-4">30–45 min/day</td>
                    <td className="py-3">
                      Increased academic language focus
                    </td>
                  </tr>
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4">Grades 6–8</td>
                    <td className="py-3 pr-4">45–55 min/day</td>
                    <td className="py-3">
                      Often a full class period; may be a dedicated ELD course
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Grades 9–12</td>
                    <td className="py-3 pr-4">
                      1 full period/day
                    </td>
                    <td className="py-3">
                      ELD course for credit; Newcomers may need additional
                      support
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Collapsible>

        <Collapsible
          title="Parent Notification & Engagement Requirements"
          icon={FileText}
        >
          <div className="space-y-3">
            <p>
              Schools must comply with specific parent notification and
              engagement requirements:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Initial Notification:
                </strong>{" "}
                Parents must be informed of their child&apos;s EL status,
                proficiency level, program placement, and exit criteria within
                30 days of the start of the school year
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Annual Notification:
                </strong>{" "}
                Parents must receive annual ELPAC results and updated program
                information
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Language Access:
                </strong>{" "}
                All required notices must be provided in the parents&apos;
                primary language (when 15%+ of students speak that language)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">ELAC/DELAC:</strong> Schools
                with 21+ ELs must establish an English Learner Advisory
                Committee (ELAC); districts with 51+ ELs must have a District
                ELAC (DELAC)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Program Waiver Rights:
                </strong>{" "}
                Parents have the right to request specific language acquisition
                programs under Prop 58
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Long-Term English Learners (LTELs)"
          icon={AlertCircle}
        >
          <div className="space-y-3">
            <InfoBanner variant="warning">
              LTELs are one of the most critical equity issues in California&apos;s
              EL programs. Districts must monitor and address the needs of these
              students.
            </InfoBanner>
            <p>
              A Long-Term English Learner (LTEL) is defined as a student who has
              been classified as an EL for{" "}
              <strong className="text-foreground">six or more years</strong> and
              has not made expected progress toward English proficiency. An
              &quot;At-Risk&quot; LTEL is an EL enrolled for{" "}
              <strong className="text-foreground">four to five years</strong>{" "}
              who is not meeting proficiency benchmarks.
            </p>
            <p>California law (AB 2193, EC § 313.1) requires districts to:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Identify and track LTELs and At-Risk LTELs
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Notify parents annually of LTEL or At-Risk status
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Provide information about the student&apos;s language
                acquisition program options
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Include LTEL data in the district&apos;s LCAP (Local Control
                Accountability Plan)
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible title="Funding & Resource Allocation" icon={Landmark}>
          <div className="space-y-3">
            <p>
              Schools receive additional funding for EL students through multiple
              channels:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">LCFF Supplemental/Concentration Grants:</strong>{" "}
                  Additional funding based on the number of EL, foster youth,
                  and low-income students in the district
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Title III Federal Funds:</strong>{" "}
                  Federal funds specifically for English Learner programs,
                  professional development, and parent engagement
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Title I Funds:</strong>{" "}
                  May be used to support EL students who are also economically
                  disadvantaged
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ELPAC Tab                                                          */
/* ------------------------------------------------------------------ */

function ElpacTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            What is the ELPAC?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The <strong className="text-foreground">English Language Proficiency
            Assessments for California (ELPAC)</strong> is California&apos;s
            required state assessment for English language proficiency. It
            replaced the California English Language Development Test (CELDT) in
            2018. The ELPAC is aligned with the 2012 California ELD Standards
            and is administered by the California Department of Education (CDE)
            in partnership with Educational Testing Service (ETS).
          </p>
          <p>
            The ELPAC is composed of two separate assessments:
          </p>
        </CardContent>
      </Card>

      {/* Two ELPAC Types */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-base">Initial ELPAC</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Administered to newly enrolled students whose Home Language Survey
              indicates a language other than English. Determines whether a
              student is an English Learner (EL) or Initially Fluent English
              Proficient (IFEP).
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  When:
                </span>
                <span>Within 30 calendar days of enrollment, year-round</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  Who:
                </span>
                <span>
                  New students with a non-English HLS, grades TK–12
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  Format:
                </span>
                <span>
                  Computer-based (grades 3–12) or paper-based (TK–2); one-on-one
                  speaking assessment for all grade spans
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  Result:
                </span>
                <span>EL or IFEP classification</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-base">Summative ELPAC</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Administered annually to all identified English Learners.
              Measures progress toward English proficiency and provides
              data for accountability, reclassification decisions, and program
              evaluation.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                  When:
                </span>
                <span>February 1 – May 31, annually</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                  Who:
                </span>
                <span>
                  All identified English Learners, grades TK–12
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                  Format:
                </span>
                <span>
                  Computer-based (grades 3–12) or paper-based (TK–2); includes
                  both group-administered and one-on-one components
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                  Result:
                </span>
                <span>Performance levels 1–4; used for reclassification</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SectionHeading>ELPAC Test Domains</SectionHeading>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            domain: "Listening",
            description:
              "Comprehending spoken English in academic and social contexts. Includes understanding main ideas, details, and inferences from oral presentations, conversations, and lectures.",
            examples:
              "Listen to a short lecture and answer comprehension questions; identify the main idea of a conversation between students",
            color: "blue",
          },
          {
            domain: "Speaking",
            description:
              "Producing spoken English in academic and social contexts. Assessed one-on-one with a trained examiner. Evaluates pronunciation, grammar, vocabulary, and fluency.",
            examples:
              "Describe a picture or sequence of events; summarize a short passage; present an argument or opinion on a topic",
            color: "green",
          },
          {
            domain: "Reading",
            description:
              "Comprehending written English texts, including literary and informational passages. Assesses vocabulary knowledge, text analysis, and reading comprehension.",
            examples:
              "Read a passage and answer multiple-choice questions; identify vocabulary in context; analyze text structure",
            color: "amber",
          },
          {
            domain: "Writing",
            description:
              "Producing written English for various academic purposes. Assesses organization, grammar, vocabulary usage, and the ability to convey ideas clearly in writing.",
            examples:
              "Write a short opinion essay; describe a process or event; summarize information from a passage or chart",
            color: "purple",
          },
        ].map((item) => {
          const colorMap: Record<string, string> = {
            blue: "border-blue-200 bg-blue-50/50 dark:border-blue-800/40 dark:bg-blue-900/10",
            green:
              "border-green-200 bg-green-50/50 dark:border-green-800/40 dark:bg-green-900/10",
            amber:
              "border-amber-200 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-900/10",
            purple:
              "border-purple-200 bg-purple-50/50 dark:border-purple-800/40 dark:bg-purple-900/10",
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
              className={`rounded-xl border p-4 ${colorMap[item.color]}`}
            >
              <h3 className={`font-semibold ${textMap[item.color]}`}>
                {item.domain}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/80">
                <strong className="text-muted-foreground">
                  Sample tasks:
                </strong>{" "}
                {item.examples}
              </p>
            </div>
          );
        })}
      </div>

      <SectionHeading>ELPAC Performance Levels</SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            The Summative ELPAC reports results using four overall performance
            levels. Each domain (Listening, Speaking, Reading, Writing) also
            receives a score of 1–3 (Beginning, Somewhat/Moderately Developed,
            Well Developed).
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800/40 dark:bg-red-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-200 text-sm font-bold text-red-800 dark:bg-red-800 dark:text-red-200">
                1
              </span>
              <div>
                <strong className="text-red-800 dark:text-red-300">
                  Level 1 — Minimally Developed
                </strong>
                <p className="mt-0.5 text-sm text-red-700/80 dark:text-red-300/70">
                  English proficiency is at the early stages. Student
                  demonstrates minimal understanding and use of English in
                  listening, speaking, reading, and writing. Corresponds roughly
                  to the lower range of the Emerging proficiency level.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50/50 p-3 dark:border-orange-800/40 dark:bg-orange-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-200 text-sm font-bold text-orange-800 dark:bg-orange-800 dark:text-orange-200">
                2
              </span>
              <div>
                <strong className="text-orange-800 dark:text-orange-300">
                  Level 2 — Somewhat Developed
                </strong>
                <p className="mt-0.5 text-sm text-orange-700/80 dark:text-orange-300/70">
                  Student demonstrates some understanding and use of English.
                  Can communicate basic ideas but struggles with more complex
                  academic language. Corresponds roughly to the upper Emerging /
                  lower Expanding range.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 dark:border-yellow-800/40 dark:bg-yellow-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-sm font-bold text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                3
              </span>
              <div>
                <strong className="text-yellow-800 dark:text-yellow-300">
                  Level 3 — Moderately Developed
                </strong>
                <p className="mt-0.5 text-sm text-yellow-700/80 dark:text-yellow-300/70">
                  Student demonstrates increasing understanding and use of
                  English in academic contexts. Can communicate ideas with some
                  detail and use a growing range of academic vocabulary.
                  Corresponds roughly to the Expanding / lower Bridging range.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800/40 dark:bg-green-900/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-sm font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                4
              </span>
              <div>
                <strong className="text-green-800 dark:text-green-300">
                  Level 4 — Well Developed
                </strong>
                <p className="mt-0.5 text-sm text-green-700/80 dark:text-green-300/70">
                  Student demonstrates strong understanding and use of English
                  in academic contexts. Proficiency is comparable to that of
                  native English speakers for the grade level. This is the level
                  required for reclassification consideration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SectionHeading>ELPAC Grade Spans</SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6">
          <p className="mb-4 text-sm text-muted-foreground">
            The ELPAC is organized into grade-span groupings. Each grade span
            has test items calibrated to the developmental and linguistic
            expectations for that age group:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-eld-almond-silk/40 dark:border-gray-700">
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Grade Span
                  </th>
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Grades
                  </th>
                  <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                    Test Format
                  </th>
                  <th className="pb-3 text-left font-semibold text-foreground">
                    Key Features
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Span 1
                  </td>
                  <td className="py-3 pr-4">TK–K</td>
                  <td className="py-3 pr-4">Paper-based, 1-on-1</td>
                  <td className="py-3">
                    Entirely one-on-one administration; focuses on oral language
                  </td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Span 2
                  </td>
                  <td className="py-3 pr-4">Grade 1</td>
                  <td className="py-3 pr-4">Paper-based, mixed</td>
                  <td className="py-3">
                    Mix of one-on-one and group tasks; beginning literacy
                    assessed
                  </td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Span 3
                  </td>
                  <td className="py-3 pr-4">Grade 2</td>
                  <td className="py-3 pr-4">Paper-based, mixed</td>
                  <td className="py-3">
                    Increased reading/writing demands; one-on-one speaking
                  </td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Span 4
                  </td>
                  <td className="py-3 pr-4">Grades 3–5</td>
                  <td className="py-3 pr-4">Computer-based + 1-on-1</td>
                  <td className="py-3">
                    Computer-based for Listening, Reading, Writing; one-on-one
                    Speaking
                  </td>
                </tr>
                <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Span 5
                  </td>
                  <td className="py-3 pr-4">Grades 6–8</td>
                  <td className="py-3 pr-4">Computer-based + 1-on-1</td>
                  <td className="py-3">
                    More complex academic texts and tasks; grade-appropriate
                    content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Span 6
                  </td>
                  <td className="py-3 pr-4">Grades 9–12</td>
                  <td className="py-3 pr-4">Computer-based + 1-on-1</td>
                  <td className="py-3">
                    Advanced academic language; college and career readiness
                    focus
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SectionHeading>ELPAC Scoring & Reporting</SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="How ELPAC Scores Are Calculated"
          icon={Target}
          defaultOpen
        >
          <div className="space-y-3">
            <p>The ELPAC produces several types of scores:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Scale Scores:</strong>{" "}
                  Numeric scores for each domain and overall. Scale scores allow
                  comparison across administrations and grade spans.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Overall Performance Level (1–4):
                  </strong>{" "}
                  Based on the combined scale scores across all four domains.
                  Level 4 is required for reclassification.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Domain Performance Levels (1–3):
                  </strong>{" "}
                  Each domain receives a level of Beginning (1),
                  Somewhat/Moderately Developed (2), or Well Developed (3).
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Score Reports & Data Access"
          icon={FileText}
        >
          <div className="space-y-3">
            <p>
              ELPAC results are communicated through several channels:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Student Score Reports (SSRs):
                  </strong>{" "}
                  Individual reports sent to parents/guardians showing overall
                  and domain scores, performance levels, and descriptors. Must
                  be provided in the parent&apos;s primary language when
                  available.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    TOMS (Test Operations Management System):
                  </strong>{" "}
                  Districts access detailed student-level data through the CDE&apos;s
                  TOMS platform for program evaluation and reclassification
                  decisions.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    DataQuest:
                  </strong>{" "}
                  Aggregate ELPAC data is available publicly through the CDE&apos;s
                  DataQuest tool for research and accountability purposes.
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="ELPAC Testing Accommodations & Accessibility"
          icon={Shield}
        >
          <div className="space-y-3">
            <p>
              The ELPAC provides accommodations and accessibility resources
              for students with disabilities and other special needs:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Universal Tools:
                </strong>{" "}
                Available to all students (e.g., scratch paper, highlighter
                tool, zoom/magnification)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Designated Supports:
                </strong>{" "}
                Available for students with documented needs (e.g., separate
                testing room, extended time, specialized lighting)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <strong className="text-foreground">
                  Accommodations:
                </strong>{" "}
                For students with IEPs or 504 plans (e.g., braille, speech-to-text,
                scribe, American Sign Language for non-listening items)
              </li>
            </ul>
            <InfoBanner variant="info">
              Accommodations must be documented in the student&apos;s IEP or 504
              plan and entered into TOMS prior to testing. Not all
              accommodations apply to all domains.
            </InfoBanner>
          </div>
        </Collapsible>

        <Collapsible title="ELPAC Test Preparation Tips for Educators" icon={BookOpen}>
          <div className="space-y-3">
            <p>
              While the ELPAC is designed to measure English proficiency rather
              than content knowledge, educators can support students by:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Familiarizing students with the test format using CDE-provided
                practice tests and training tests
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Building academic vocabulary across all content areas throughout
                the year
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Providing regular opportunities for academic speaking and
                discussion (Socratic seminars, partner talk, presentations)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Teaching text analysis and close reading strategies aligned with
                ELD standards
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Incorporating regular writing practice with focus on organization,
                grammar, and vocabulary
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Using scaffolding strategies that gradually release support as
                students gain proficiency
              </li>
            </ul>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guides & Resources Tab                                             */
/* ------------------------------------------------------------------ */

function GuidesTab() {
  return (
    <div className="space-y-6">
      <SectionHeading>Scaffolding Strategies for ELD</SectionHeading>

      <div className="space-y-3">
        <Collapsible
          title="Sentence Frames & Sentence Starters"
          icon={FileText}
          defaultOpen
        >
          <div className="space-y-3">
            <p>
              Sentence frames and starters are one of the most widely used ELD
              scaffolding strategies. They provide linguistic structures that
              support students in producing academic language.
            </p>
            <div className="space-y-3">
              <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
                <h4 className="font-semibold text-foreground">For Emerging Students</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>&bull; &quot;The main idea is ___.&quot;</li>
                  <li>&bull; &quot;I see/hear/notice ___.&quot;</li>
                  <li>&bull; &quot;This is about ___.&quot;</li>
                  <li>&bull; &quot;I agree/disagree because ___.&quot;</li>
                </ul>
              </div>
              <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
                <h4 className="font-semibold text-foreground">For Expanding Students</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>&bull; &quot;According to the text, ___ because ___.&quot;</li>
                  <li>&bull; &quot;One important detail is ___, which shows ___.&quot;</li>
                  <li>&bull; &quot;I would argue that ___ because ___.&quot;</li>
                  <li>&bull; &quot;The author&apos;s purpose is to ___ by ___.&quot;</li>
                </ul>
              </div>
              <div className="rounded-lg bg-eld-almond-silk/15 p-4 dark:bg-white/[0.03]">
                <h4 className="font-semibold text-foreground">For Bridging Students</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>&bull; &quot;While some may argue ___, the evidence suggests ___.&quot;</li>
                  <li>&bull; &quot;The significance of ___ can be understood through ___.&quot;</li>
                  <li>&bull; &quot;This connects to the broader theme of ___ in that ___.&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        </Collapsible>

        <Collapsible
          title="Graphic Organizers"
          icon={BookOpen}
        >
          <div className="space-y-3">
            <p>
              Graphic organizers help ELs visually organize information and
              understand relationships between concepts. Effective types include:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Venn Diagrams:</strong>{" "}
                  Compare and contrast concepts, characters, or events
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">T-Charts:</strong>{" "}
                  Organize pros/cons, cause/effect, or fact/opinion
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Flow Charts:</strong>{" "}
                  Sequence events, processes, or steps in a procedure
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Concept Maps:</strong>{" "}
                  Show relationships between key concepts and vocabulary
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Frayer Models:
                  </strong>{" "}
                  Deep vocabulary development (definition, characteristics,
                  examples, non-examples)
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Vocabulary Development Strategies"
          icon={BookOpen}
        >
          <div className="space-y-3">
            <p>
              Building academic vocabulary is central to ELD. Research-based
              strategies include:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Tiered Vocabulary Instruction:
                  </strong>{" "}
                  Focus on Tier 2 (general academic) and Tier 3 (domain-specific)
                  vocabulary with explicit instruction and multiple exposures
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Word Walls:
                  </strong>{" "}
                  Display high-frequency academic words with student-friendly
                  definitions, visuals, and home-language translations
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Cognate Charts:
                  </strong>{" "}
                  Leverage Spanish-English cognates (and other languages) to
                  build vocabulary connections
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Total Physical Response (TPR):
                  </strong>{" "}
                  Connect vocabulary to physical movements for kinesthetic
                  learning, especially effective for Emerging-level students
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">
                    Personal Dictionaries/Word Journals:
                  </strong>{" "}
                  Students maintain personal vocabulary logs with definitions,
                  drawings, sentences, and translations
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Collaborative Learning Structures"
          icon={Users}
        >
          <div className="space-y-3">
            <p>
              Collaborative structures provide ELs with opportunities for
              meaningful interaction and language practice:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Think-Pair-Share:</strong>{" "}
                  Students think individually, discuss with a partner, then
                  share with the group. Provides processing time and a low-stakes
                  speaking opportunity.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Numbered Heads Together:</strong>{" "}
                  Small groups discuss and prepare answers, then one member is
                  randomly selected to share, ensuring accountability.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Literature Circles:</strong>{" "}
                  Students take assigned roles (discussion director, vocabulary
                  enricher, summarizer) to discuss a shared text.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Gallery Walks:</strong>{" "}
                  Students circulate to view and discuss posted work, providing
                  opportunities for reading, writing, and speaking.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <div>
                  <strong className="text-foreground">Reciprocal Teaching:</strong>{" "}
                  Students take turns leading discussions using four strategies:
                  predicting, questioning, clarifying, and summarizing.
                </div>
              </li>
            </ul>
          </div>
        </Collapsible>

        <Collapsible
          title="Differentiation by Proficiency Level"
          icon={Target}
        >
          <div className="space-y-3">
            <p>
              Effective ELD instruction differentiates based on student
              proficiency levels. Here is a guide for differentiating common
              classroom tasks:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-eld-almond-silk/40 dark:border-gray-700">
                    <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                      Strategy
                    </th>
                    <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Emerging
                      </span>
                    </th>
                    <th className="pb-3 pr-4 text-left font-semibold text-foreground">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        Expanding
                      </span>
                    </th>
                    <th className="pb-3 text-left font-semibold text-foreground">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Bridging
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      Reading
                    </td>
                    <td className="py-3 pr-4">
                      Adapted text with visuals; teacher read-aloud; partner
                      reading
                    </td>
                    <td className="py-3 pr-4">
                      Grade-level text with glossary; guided reading groups
                    </td>
                    <td className="py-3">
                      Grade-level text with minimal support; independent close
                      reading
                    </td>
                  </tr>
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      Writing
                    </td>
                    <td className="py-3 pr-4">
                      Sentence frames; word banks; labeled drawings; cloze
                      paragraphs
                    </td>
                    <td className="py-3 pr-4">
                      Paragraph frames; sentence starters; model texts; graphic
                      organizers
                    </td>
                    <td className="py-3">
                      Essay prompts with rubric; peer revision; mentor texts
                    </td>
                  </tr>
                  <tr className="border-b border-eld-almond-silk/20 dark:border-gray-800">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      Speaking
                    </td>
                    <td className="py-3 pr-4">
                      Repetition; choral response; simple partner talk with
                      frames
                    </td>
                    <td className="py-3 pr-4">
                      Small group discussions; structured academic conversations
                    </td>
                    <td className="py-3">
                      Socratic seminars; formal presentations; debates
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-foreground">
                      Assessment
                    </td>
                    <td className="py-3 pr-4">
                      Picture-based; oral responses; matching; drawing
                    </td>
                    <td className="py-3 pr-4">
                      Short constructed response; modified rubrics; graphic
                      organizer-based
                    </td>
                    <td className="py-3">
                      Grade-level assessments with minor accommodations
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Collapsible>
      </div>

      <SectionHeading className="pt-2">
        Newcomer Student Support
      </SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Newcomer students (those who have been in U.S. schools for fewer
            than 12 months) require additional support beyond standard ELD
            instruction:
          </p>
          <ul className="space-y-2 ml-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  Newcomer Programs:
                </strong>{" "}
                Some districts offer dedicated newcomer programs or academies
                that provide intensive English instruction and acculturation
                support for the first 1–2 years
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  Primary Language Support:
                </strong>{" "}
                Use of the student&apos;s home language (through bilingual aides,
                translated materials, or bilingual instruction) to support
                content understanding while English develops
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  Survival English:
                </strong>{" "}
                Immediate focus on essential vocabulary and phrases for navigating
                school and daily life
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  Social-Emotional Support:
                </strong>{" "}
                Addressing the cultural adjustment, potential trauma, and
                social isolation that newcomer students may experience
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div>
                <strong className="text-foreground">
                  SLIFE Considerations:
                </strong>{" "}
                Students with Limited or Interrupted Formal Education (SLIFE)
                may need additional academic foundations alongside English
                language instruction
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <SectionHeading className="pt-2">
        Official California ELD Resources
      </SectionHeading>

      <Card>
        <CardContent className="pt-5 md:pt-6">
          <div className="space-y-3">
            {[
              {
                title: "CA ELD Standards",
                description:
                  "The full California ELD Standards document, including proficiency level descriptors and standard progressions.",
                source: "California Department of Education",
              },
              {
                title: "ELA/ELD Framework",
                description:
                  "The comprehensive California ELA/ELD Framework with guidance on curriculum, instruction, and assessment for both ELA and ELD.",
                source: "California Department of Education",
              },
              {
                title: "English Learner Roadmap Policy",
                description:
                  "The State Board of Education policy document guiding EL programs with four key principles for serving English Learners.",
                source: "California State Board of Education",
              },
              {
                title: "ELPAC Practice & Training Tests",
                description:
                  "Free practice and training tests from CDE/ETS for all grade spans. Helps students become familiar with the test format.",
                source: "CDE / Educational Testing Service",
              },
              {
                title: "EL Roadmap Toolkits",
                description:
                  "Implementation toolkits for districts and schools to put the EL Roadmap principles into practice across all content areas.",
                source: "Californians Together / SEAL",
              },
              {
                title: "Improving Education for Multilingual and English Learner Students: Research to Practice",
                description:
                  "CDE research publication providing evidence-based guidance on effective instructional practices for English Learners.",
                source: "California Department of Education",
              },
            ].map((resource) => (
              <div
                key={resource.title}
                className="flex items-start gap-3 rounded-lg border border-eld-almond-silk/30 p-3 dark:border-gray-700/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-eld-almond-silk/20 dark:bg-eld-dusty-grape/20">
                  <FileText className="h-4 w-4 text-eld-space-indigo dark:text-eld-almond-silk" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {resource.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {resource.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Source: {resource.source}
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
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function ELDGuidePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="scaffold-heading">California ELD Guide</h1>
        <p className="scaffold-description mt-1">
          Comprehensive resource for English Language Development standards,
          legal requirements, ELPAC assessment, and instructional strategies
          in California.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-eld-almond-silk/40 bg-white p-5 md:flex-row md:items-center md:gap-6 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-eld-almond-silk/30 dark:bg-eld-dusty-grape/30">
          <BookOpen className="h-7 w-7 text-eld-space-indigo dark:text-eld-almond-silk" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Everything You Need to Know About ELD in California
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This guide covers California ELD Standards, federal and state
            legal requirements, ELPAC assessment details, reclassification
            criteria, instructional strategies, and resources for educators
            working with English Learners.
          </p>
        </div>
      </div>

      {/* ELPAC Dedicated Page Link */}
      <Link
        href="/eld-guide/elpac"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-purple-200/60 bg-purple-50/50 p-4 md:p-5 transition-colors hover:bg-purple-100/50 dark:border-purple-800/30 dark:bg-purple-900/10 dark:hover:bg-purple-900/20"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <ClipboardCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200">
              ELPAC Assessment Guide
            </h3>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/70">
              In-depth guide to the Initial &amp; Summative ELPAC — test
              domains, scoring, performance levels, administration, and
              reclassification.
            </p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-purple-400 transition-transform group-hover:translate-x-1 dark:text-purple-500" />
      </Link>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="min-w-max">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="legal">Legal &amp; Legislation</TabsTrigger>
            <TabsTrigger value="rules">Rules &amp; Compliance</TabsTrigger>
            <TabsTrigger value="elpac">ELPAC</TabsTrigger>
            <TabsTrigger value="guides">Guides &amp; Resources</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="legal">
          <LegalTab />
        </TabsContent>
        <TabsContent value="rules">
          <RulesTab />
        </TabsContent>
        <TabsContent value="elpac">
          <ElpacTab />
        </TabsContent>
        <TabsContent value="guides">
          <GuidesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
