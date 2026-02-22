import { z } from "zod";

export const elLevelSchema = z.enum(["Emerging", "Expanding", "Bridging"]);

export const studentSchema = z.object({
  ssid: z.string().min(1, "SSID is required").max(20).optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  grade: z.number().int().min(5, "Grade must be 5-8").max(8, "Grade must be 5-8"),
  homeroom: z.string().max(50).optional(),
  el_level: elLevelSchema,
  overall_level: z.number().int().min(1).max(4).optional(),
  oral_language_level: z.number().int().min(1).max(4).optional(),
  written_language_level: z.number().int().min(1).max(4).optional(),
  primary_language: z.string().min(2, "Language is required").max(50),
  notes: z.string().optional(),
});

export const assignmentDetailsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  subject: z.string().optional(),
  grade_level: z.number().int().min(5).max(8).optional(),
});

export const assignmentContentSchema = z.object({
  content: z.string().min(50, "Assignment must be at least 50 characters").max(50000),
  source_type: z.enum(["text", "upload", "google_doc", "google_slides"]),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
export type AssignmentDetailsFormValues = z.infer<typeof assignmentDetailsSchema>;
export type AssignmentContentFormValues = z.infer<typeof assignmentContentSchema>;
