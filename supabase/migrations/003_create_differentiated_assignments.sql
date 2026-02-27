-- 003: Add missing library columns to differentiated_assignments
-- The table already exists but is missing columns needed for persistent library storage.

-- Add columns that don't exist yet (IF NOT EXISTS prevents errors if already present)
DO $$
BEGIN
  -- teacher_id: ties every entry to the authenticated teacher
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'teacher_id') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN teacher_id uuid;
  END IF;

  -- student_name: denormalized name (supports batch labels like "3 Emerging students")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'student_name') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN student_name text;
  END IF;

  -- assignment_title
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'assignment_title') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN assignment_title text NOT NULL DEFAULT 'Untitled';
  END IF;

  -- original_content: the raw assignment text for "Original Assignment" toggle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'original_content') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN original_content text;
  END IF;

  -- word_bank: structured JSON array of {term, definition}
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'word_bank') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN word_bank jsonb;
  END IF;

  -- teacher_instructions: AI-generated guidance for the teacher
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'teacher_instructions') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN teacher_instructions text;
  END IF;

  -- is_demo: whether this was generated without a real Gemini API key
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'differentiated_assignments' AND column_name = 'is_demo') THEN
    ALTER TABLE differentiated_assignments ADD COLUMN is_demo boolean NOT NULL DEFAULT false;
  END IF;
END
$$;

-- Index for teacher library listing (most common query)
CREATE INDEX IF NOT EXISTS idx_diff_assignments_teacher_created
  ON differentiated_assignments (teacher_id, created_at DESC);

-- Index for looking up by assignment_id
CREATE INDEX IF NOT EXISTS idx_diff_assignments_assignment
  ON differentiated_assignments (assignment_id);
