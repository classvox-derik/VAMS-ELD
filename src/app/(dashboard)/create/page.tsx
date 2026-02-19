"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignmentInputTabs } from "@/components/assignments/assignment-input-tabs";
import { AssignmentDetailsForm } from "@/components/assignments/assignment-details-form";
import { StudentScaffoldSelection } from "@/components/assignments/student-scaffold-selection";
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
                  ? "bg-eld-space-indigo text-white shadow-theme-xs"
                  : step.number < form.currentStep
                  ? "bg-eld-space-indigo/10 text-eld-space-indigo cursor-pointer hover:bg-eld-space-indigo/20 dark:bg-eld-dusty-grape/20 dark:text-eld-seashell"
                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
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
                  "h-0.5 w-8 sm:w-12",
                  step.number < form.currentStep ? "bg-eld-space-indigo dark:bg-eld-dusty-grape" : "bg-gray-200 dark:bg-gray-700"
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

      {/* Step 3: Select Student & Scaffolds */}
      {form.currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step 3: Select Student & Scaffolds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentScaffoldSelection
              assignmentTitle={form.title}
              content={form.content}
              subject={form.subject}
              sourceType={form.sourceType}
              gradeLevel={form.gradeLevel}
              contentLength={form.content.length}
              onBack={form.prevStep}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
