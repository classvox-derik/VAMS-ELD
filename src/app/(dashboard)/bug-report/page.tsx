"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bug,
  Loader2,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  Monitor,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "UI / Display Issue",
  "Feature Not Working",
  "Data Error",
  "Performance Issue",
  "Login / Access Issue",
  "Assignment / Scaffold Error",
  "Student Management Issue",
  "PDF / Export Issue",
  "Other",
];

const SEVERITIES = [
  { value: "Low", description: "Minor annoyance, workaround exists" },
  { value: "Medium", description: "Disrupts workflow but site still usable" },
  { value: "High", description: "Key feature broken, no workaround" },
  { value: "Critical", description: "Site unusable or data loss" },
];

const SEVERITY_STYLES: Record<string, string> = {
  Low: "border-green-500 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300",
  Medium: "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300",
  High: "border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300",
  Critical: "border-red-500 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300",
};

function NativeSelect({
  id,
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-2 border-b border-border pb-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-medium">
        {label}
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

const emptyForm = {
  reporterName: "",
  reporterEmail: "",
  category: "",
  severity: "",
  affectedPage: "",
  description: "",
  stepsToReproduce: "",
  expectedBehavior: "",
  actualBehavior: "",
  browserDevice: "",
  additionalNotes: "",
};

export default function BugReportPage() {
  const [form, setForm] = useState(emptyForm);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  function set(field: keyof typeof emptyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function setVal(field: keyof typeof emptyForm) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit report.");
      setSent(true);
      toast.success("Bug report submitted!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  function handleReset() {
    setForm(emptyForm);
    setSent(false);
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="scaffold-heading">Report a Bug</h1>
          <p className="scaffold-description mt-1">Help us improve the platform.</p>
        </div>
        <div className="mx-auto max-w-xl">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Report Submitted!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thank you. Your report has been sent to the platform administrator.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Submit Another Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Report a Bug</h1>
        <p className="scaffold-description mt-1">
          Found a problem? All fields are optional — share as much or as little as you like.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Reporter Info ── */}
          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Name" htmlFor="reporterName" optional>
                  <Input
                    id="reporterName"
                    placeholder="e.g. Maria Garcia"
                    value={form.reporterName}
                    onChange={set("reporterName")}
                    disabled={isSending}
                  />
                </Field>
                <Field label="Email" htmlFor="reporterEmail" optional>
                  <Input
                    id="reporterEmail"
                    type="email"
                    placeholder="e.g. mgarcia@brightstarschools.org"
                    value={form.reporterEmail}
                    onChange={set("reporterEmail")}
                    disabled={isSending}
                  />
                </Field>
              </div>
              <p className="text-xs text-muted-foreground">
                Provide your email if you&apos;d like a follow-up from the administrator.
              </p>
            </CardContent>
          </Card>

          {/* ── Bug Classification ── */}
          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Bug Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Category" htmlFor="category" optional>
                  <NativeSelect
                    id="category"
                    value={form.category}
                    onChange={setVal("category")}
                    placeholder="Select a category…"
                    options={CATEGORIES}
                    disabled={isSending}
                  />
                </Field>
                <Field label="Affected Page / Section" htmlFor="affectedPage" optional>
                  <Input
                    id="affectedPage"
                    placeholder="e.g. Create Assignment, Students"
                    value={form.affectedPage}
                    onChange={set("affectedPage")}
                    disabled={isSending}
                  />
                </Field>
              </div>

              {/* Severity picker */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium">
                  Severity
                  <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SEVERITIES.map(({ value, description }) => (
                    <button
                      key={value}
                      type="button"
                      disabled={isSending}
                      onClick={() => setForm((prev) => ({ ...prev, severity: prev.severity === value ? "" : value }))}
                      className={[
                        "rounded-md border-2 px-3 py-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
                        form.severity === value
                          ? SEVERITY_STYLES[value]
                          : "border-border bg-background text-muted-foreground hover:border-muted-foreground",
                      ].join(" ")}
                    >
                      <p className="text-xs font-semibold">{value}</p>
                      <p className="mt-0.5 text-[11px] leading-tight opacity-80">{description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Bug Details ── */}
          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Bug className="h-4 w-4" />
                Bug Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Description" htmlFor="description" optional>
                <Textarea
                  id="description"
                  placeholder="Briefly describe the issue you encountered…"
                  value={form.description}
                  onChange={set("description")}
                  disabled={isSending}
                  rows={4}
                />
              </Field>

              <Field label="Steps to Reproduce" htmlFor="stepsToReproduce" optional>
                <Textarea
                  id="stepsToReproduce"
                  placeholder={"1. Go to...\n2. Click on...\n3. See error"}
                  value={form.stepsToReproduce}
                  onChange={set("stepsToReproduce")}
                  disabled={isSending}
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Expected Behavior" htmlFor="expectedBehavior" optional>
                  <Textarea
                    id="expectedBehavior"
                    placeholder="What should have happened?"
                    value={form.expectedBehavior}
                    onChange={set("expectedBehavior")}
                    disabled={isSending}
                    rows={3}
                  />
                </Field>
                <Field label="Actual Behavior" htmlFor="actualBehavior" optional>
                  <Textarea
                    id="actualBehavior"
                    placeholder="What actually happened?"
                    value={form.actualBehavior}
                    onChange={set("actualBehavior")}
                    disabled={isSending}
                    rows={3}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* ── Environment & Notes ── */}
          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Monitor className="h-4 w-4" />
                Environment &amp; Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Browser / Device" htmlFor="browserDevice" optional>
                <Input
                  id="browserDevice"
                  placeholder="e.g. Chrome 123 on Windows 11, iPhone 15 Safari"
                  value={form.browserDevice}
                  onChange={set("browserDevice")}
                  disabled={isSending}
                />
              </Field>
              <Field label="Additional Notes" htmlFor="additionalNotes" optional>
                <Textarea
                  id="additionalNotes"
                  placeholder="Anything else that might help us fix this…"
                  value={form.additionalNotes}
                  onChange={set("additionalNotes")}
                  disabled={isSending}
                  rows={3}
                />
              </Field>
            </CardContent>
          </Card>

          {/* ── Submit ── */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Reports are sent to{" "}
              <span className="font-medium">dvandiest@brightstarschools.org</span>
            </p>
            <Button type="submit" disabled={isSending} className="gap-2">
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
