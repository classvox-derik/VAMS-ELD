-- Enable Row Level Security on tables exposed to PostgREST.
-- The app uses the service-role key for all server-side operations,
-- which bypasses RLS. These policies protect against direct client
-- (anon-key) access so each user can only touch their own rows.

-- ── google_tokens ──────────────────────────────────────────────────
ALTER TABLE public.google_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own Google tokens" ON public.google_tokens;
CREATE POLICY "Users can view their own Google tokens"
  ON public.google_tokens FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own Google tokens" ON public.google_tokens;
CREATE POLICY "Users can insert their own Google tokens"
  ON public.google_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own Google tokens" ON public.google_tokens;
CREATE POLICY "Users can update their own Google tokens"
  ON public.google_tokens FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own Google tokens" ON public.google_tokens;
CREATE POLICY "Users can delete their own Google tokens"
  ON public.google_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- ── profiles ───────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);
