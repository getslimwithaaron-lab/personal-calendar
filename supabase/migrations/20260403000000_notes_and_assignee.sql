-- ============================================================
-- Add notes table + assignee column on tasks
-- ============================================================

-- ── notes (freeform text, one per user) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  content    TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_own" ON notes
  FOR ALL USING (user_id = auth.uid());

-- ── Add assignee column to tasks ─────────────────────────────────────────────
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee TEXT DEFAULT 'aaron';
