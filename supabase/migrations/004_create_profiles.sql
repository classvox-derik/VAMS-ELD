-- Persists user profile (first/last name) so it survives logout,
-- browser-clear, and device switches.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

CREATE TABLE IF NOT EXISTS profiles (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name  TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Allow the service role full access (RLS is off by default for new tables,
-- and the app uses the service-role key for server-side operations).
