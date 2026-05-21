-- Migration: Add ELPAC domain scores and prior year data to students table
-- Run this in the Supabase SQL editor before running the update script

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS elpac_score          INTEGER,
  ADD COLUMN IF NOT EXISTS elpac_listening      TEXT,
  ADD COLUMN IF NOT EXISTS elpac_speaking       TEXT,
  ADD COLUMN IF NOT EXISTS elpac_reading        TEXT,
  ADD COLUMN IF NOT EXISTS elpac_writing        TEXT,
  ADD COLUMN IF NOT EXISTS prior_yr1_grade      TEXT,
  ADD COLUMN IF NOT EXISTS prior_yr1_score      INTEGER,
  ADD COLUMN IF NOT EXISTS prior_yr1_level      INTEGER,
  ADD COLUMN IF NOT EXISTS prior_yr2_grade      TEXT,
  ADD COLUMN IF NOT EXISTS prior_yr2_score      INTEGER,
  ADD COLUMN IF NOT EXISTS prior_yr2_level      INTEGER,
  ADD COLUMN IF NOT EXISTS elpac_test_date      TEXT;

-- Create an exec_sql helper so the update script can self-migrate
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;