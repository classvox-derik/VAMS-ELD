-- Add source_doc_id and scaffold_actions columns
-- for format-preserving Google Docs export (clone + smart insertions)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'differentiated_assignments' AND column_name = 'source_doc_id'
  ) THEN
    ALTER TABLE differentiated_assignments ADD COLUMN source_doc_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'differentiated_assignments' AND column_name = 'scaffold_actions'
  ) THEN
    ALTER TABLE differentiated_assignments ADD COLUMN scaffold_actions jsonb;
  END IF;
END
$$;
