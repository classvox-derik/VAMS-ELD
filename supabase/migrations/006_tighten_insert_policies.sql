-- Tighten INSERT RLS policies that currently use WITH CHECK (true).
-- Each teacher should only be able to insert rows tagged with their own user ID.
-- Service-role operations (server-side) bypass RLS and are unaffected.

-- ── assignments ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Teachers can insert assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can insert their own assignments" ON public.assignments;

CREATE POLICY "Teachers can insert their own assignments"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = teacher_id::text);

-- ── differentiated_assignments ─────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can insert differentiated assignments" ON public.differentiated_assignments;
DROP POLICY IF EXISTS "Teachers can insert their own differentiated assignments" ON public.differentiated_assignments;

CREATE POLICY "Teachers can insert their own differentiated assignments"
  ON public.differentiated_assignments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = teacher_id::text);

-- ── usage_analytics ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can insert analytics" ON public.usage_analytics;
DROP POLICY IF EXISTS "Teachers can insert their own analytics" ON public.usage_analytics;

CREATE POLICY "Teachers can insert their own analytics"
  ON public.usage_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = teacher_id::text);

-- ── scaffold_templates ─────────────────────────────────────────────
-- Default templates are seeded via service-role (bypasses RLS).
-- User-created templates must have created_by set to their own auth UID.
DROP POLICY IF EXISTS "Authenticated users can insert scaffold templates" ON public.scaffold_templates;
DROP POLICY IF EXISTS "Teachers can insert their own scaffold templates" ON public.scaffold_templates;

CREATE POLICY "Teachers can insert their own scaffold templates"
  ON public.scaffold_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);
