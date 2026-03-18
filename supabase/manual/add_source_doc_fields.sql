-- Run this in the Supabase SQL Editor to add source_doc_id and scaffold_actions columns.
-- These columns enable format-preserving Google Docs export.
-- After running this, update BASE_COLUMNS in src/lib/queries/differentiated-assignments.ts
-- to include "source_doc_id" and "scaffold_actions".

ALTER TABLE differentiated_assignments
  ADD COLUMN IF NOT EXISTS source_doc_id text,
  ADD COLUMN IF NOT EXISTS scaffold_actions jsonb;
