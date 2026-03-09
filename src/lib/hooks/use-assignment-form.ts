"use client";

import { useState, useCallback } from "react";
import type { DocImage } from "@/types";

export type AssignmentStep = 1 | 2 | 3;
export type SourceType = "text" | "upload" | "google_doc";

interface AssignmentFormState {
  // Step 1: Content
  content: string;
  sourceType: SourceType;
  fileName?: string;
  /** Google Doc ID when source is google_doc (for format-preserving export) */
  sourceDocId?: string;
  /** Inline images extracted from Google Docs */
  images?: DocImage[];

  // Step 2: Details
  title: string;
  subject: string;
  gradeLevel: number | undefined;

  // Step 3: Selection (Phase 4)
  assignmentId?: string;
  selectedStudentId?: string;
  selectedScaffoldIds: string[];

  // UI state
  currentStep: AssignmentStep;
  isGenerating: boolean;
}

const initialState: AssignmentFormState = {
  content: "",
  sourceType: "text",
  fileName: undefined,
  sourceDocId: undefined,
  images: undefined,
  title: "",
  subject: "",
  gradeLevel: undefined,
  assignmentId: undefined,
  selectedStudentId: undefined,
  selectedScaffoldIds: [],
  currentStep: 1,
  isGenerating: false,
};

export function useAssignmentForm() {
  const [state, setState] = useState<AssignmentFormState>(initialState);

  const updateContent = useCallback((content: string, sourceType: SourceType, fileName?: string, sourceDocId?: string, images?: DocImage[]) => {
    setState((prev) => ({
      ...prev,
      content,
      sourceType,
      fileName,
      // Only keep sourceDocId and images when source is google_doc
      sourceDocId: sourceType === "google_doc" ? sourceDocId : undefined,
      images: sourceType === "google_doc" ? images : undefined,
    }));
  }, []);

  const updateDetails = useCallback((details: { title: string; subject: string; gradeLevel?: number }) => {
    setState((prev) => ({
      ...prev,
      title: details.title,
      subject: details.subject,
      gradeLevel: details.gradeLevel,
    }));
  }, []);

  const setAssignmentId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, assignmentId: id }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3) as AssignmentStep,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1) as AssignmentStep,
    }));
  }, []);

  const goToStep = useCallback((step: AssignmentStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const canProceedToStep2 = state.content.length >= 50;
  const canProceedToStep3 = state.title.length >= 3;

  return {
    ...state,
    updateContent,
    updateDetails,
    setAssignmentId,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    canProceedToStep2,
    canProceedToStep3,
  };
}
