// Database table types matching the Supabase schema

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  google_refresh_token?: string;
  preferences: {
    theme: "light" | "dark";
    defaultView: "grid" | "list";
  };
  created_at: string;
  last_login?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  el_level: ELLevel;
  primary_language: string;
  custom_scaffolds: string[];
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ScaffoldTemplate {
  id: string;
  name: string;
  description: string;
  category: ScaffoldCategory;
  el_level_target: ELLevel[];
  ai_prompt_template: string;
  example_html?: string;
  is_default: boolean;
  created_by?: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  teacher_id: string;
  title: string;
  subject?: string;
  grade_level?: number;
  original_content: string;
  source_type: "text" | "upload" | "google_doc" | "google_slides";
  source_url?: string;
  file_url?: string;
  created_at: string;
}

export interface DifferentiatedAssignment {
  id: string;
  assignment_id: string;
  student_id?: string;
  el_level?: ELLevel;
  scaffolds_applied: string[];
  output_html: string;
  google_doc_id?: string;
  google_doc_url?: string;
  pdf_url?: string;
  teacher_notes?: string;
  created_at: string;
}

export interface UsageAnalytic {
  id: string;
  teacher_id: string;
  action_type: "scaffold_generated" | "student_viewed" | "assignment_created" | "google_doc_created";
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Enums and union types

export type ELLevel = "Emerging" | "Expanding" | "Bridging";

export const EL_LEVELS: ELLevel[] = ["Emerging", "Expanding", "Bridging"];

export type ScaffoldCategory =
  | "color_coding"
  | "chunking"
  | "sentence_frames"
  | "word_banks"
  | "visual_organizers";

export const SCAFFOLD_CATEGORIES: ScaffoldCategory[] = [
  "color_coding",
  "chunking",
  "sentence_frames",
  "word_banks",
  "visual_organizers",
];

export const GRADES = [5, 6, 7, 8] as const;
export type Grade = (typeof GRADES)[number];

export const SUBJECTS = ["ELA", "Math", "Science", "Social Studies", "Other"] as const;
export type Subject = (typeof SUBJECTS)[number];

// Navigation types

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
}

// Dashboard types

export interface DashboardStats {
  studentsByLevel: Record<ELLevel, number>;
  todayAIUsage: number;
  dailyAILimit: number;
  recentAssignments: Assignment[];
}
