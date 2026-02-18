"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignmentInputTabs } from "@/components/assignments/assignment-input-tabs";
import { AssignmentDetailsForm } from "@/components/assignments/assignment-details-form";
import { useAssignmentForm } from "@/lib/hooks/use-assignment-form";
import { cn } from "@/lib/utils";
import type { AssignmentDetailsFormValues } from "@/lib/validations";

const steps = [
  { number: 1, label: "Input Assignment" },
  { number: 2, label: "Assignment Details" },
  { number: 3, label: "Select & Generate" },
];

export default function CreateAssignmentPage() {
  const form = useAssignmentForm();

  const handleContentChange = useCallback(
    (content: string, sourceType: "text" | "upload" | "google_doc", fileName?: string) => {
      form.updateContent(content, sourceType, fileName);
    },
    [form]
  );

  function handleStep1Continue() {
    if (!form.canProceedToStep2) {
      toast.error("Assignment must be at least 50 characters.");
      return;
    }
    form.nextStep();
  }

  function handleStep2Submit(data: AssignmentDetailsFormValues) {
    form.updateDetails({
      title: data.title,
      subject: data.subject ?? "",
      gradeLevel: data.grade_level,
    });
    form.nextStep();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Create Assignment</h1>
        <p className="scaffold-description mt-1">
          Input your assignment, add details, then select scaffolds to apply.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (step.number < form.currentStep) {
                  form.goToStep(step.number as 1 | 2 | 3);
                }
              }}
              disabled={step.number > form.currentStep}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                step.number === form.currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.number < form.currentStep
                  ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.number < form.currentStep ? (
                <Check className="h-3 w-3" />
              ) : (
                <span>{step.number}</span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 sm:w-12",
                  step.number < form.currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Input */}
      {form.currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 1: Input Your Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AssignmentInputTabs
              content={form.content}
              sourceType={form.sourceType}
              onContentChange={handleContentChange}
            />
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleStep1Continue}
                disabled={!form.canProceedToStep2}
                className="gap-2"
              >
                Continue to Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Details */}
      {form.currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 2: Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <AssignmentDetailsForm
              defaultValues={{
                title: form.title,
                subject: form.subject,
                gradeLevel: form.gradeLevel,
              }}
              onSubmit={handleStep2Submit}
              onBack={form.prevStep}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Selection (Phase 4) */}
      {form.currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step 3: Select Student & Scaffolds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                Student & scaffold selection coming in Phase 4
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Assignment: &quot;{form.title}&quot; ({form.content.length.toLocaleString()} chars)
              </p>
              <Button
                variant="outline"
                onClick={form.prevStep}
                className="mt-4"
              >
                Back to Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
