-- ============================================================
-- Family Alerts table
-- ============================================================

CREATE TABLE IF NOT EXISTS family_alerts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_name  TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  message      TEXT NOT NULL,
  dismissed    BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE family_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_own" ON family_alerts
  FOR ALL USING (user_id = auth.uid());

-- Enable Realtime full row diffs for instant push
ALTER TABLE family_alerts REPLICA IDENTITY FULL;

CREATE INDEX IF NOT EXISTS idx_alerts_user ON family_alerts(user_id, created_at DESC);
