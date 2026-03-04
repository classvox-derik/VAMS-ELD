-- Persists Google OAuth refresh tokens so users don't have to re-link
-- after clearing browser cookies.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

CREATE TABLE IF NOT EXISTS google_tokens (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  google_email  TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS is enabled in 005_enable_rls.sql.
-- The app uses the service-role key for server-side operations (bypasses RLS).
