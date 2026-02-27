-- Usage analytics table for tracking AI generation usage
-- Gemini free tier: 250 RPD / 10 RPM (resets midnight Pacific)

CREATE TABLE IF NOT EXISTS usage_analytics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid NOT NULL,
  action_type text NOT NULL,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Fast lookup: global daily scaffold count
CREATE INDEX idx_usage_action_created
  ON usage_analytics (action_type, created_at);

-- Fast lookup: per-user daily scaffold count
CREATE INDEX idx_usage_teacher_action_created
  ON usage_analytics (teacher_id, action_type, created_at);
