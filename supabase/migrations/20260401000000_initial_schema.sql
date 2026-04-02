-- ============================================================
-- Phase 2 Migration — Full schema for Personal Calendar App
-- ============================================================

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  name       TEXT,
  timezone   TEXT NOT NULL DEFAULT 'America/Denver',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── calendar_connections ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_connections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  account_email TEXT NOT NULL,
  access_token  TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry  TIMESTAMPTZ NOT NULL,
  calendar_id   TEXT NOT NULL DEFAULT 'primary',
  calendar_name TEXT,
  color         TEXT NOT NULL DEFAULT '#378ADD',
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── calendar_sets ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_sets (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES users(id) ON DELETE CASCADE,
  name                   TEXT NOT NULL,
  included_connection_ids UUID[] NOT NULL DEFAULT '{}',
  is_default             BOOLEAN DEFAULT FALSE,
  sort_order             INTEGER DEFAULT 0
);

-- ── event_templates (declared before local_events for FK reference) ───────────
CREATE TABLE IF NOT EXISTS event_templates (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES users(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  default_duration_min INTEGER DEFAULT 60,
  color                TEXT,
  notes                TEXT,
  location             TEXT,
  recurrence_rule      TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── local_events ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS local_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ NOT NULL,
  all_day         BOOLEAN DEFAULT FALSE,
  color           TEXT,
  event_type      TEXT DEFAULT 'standard' CHECK (event_type IN ('standard','focus','blocked')),
  notes           TEXT,
  location        TEXT,
  recurrence_rule TEXT,
  template_id     UUID REFERENCES event_templates(id) ON DELETE SET NULL,
  external_id     TEXT,
  source          TEXT NOT NULL CHECK (source IN ('google','outlook','local')),
  connection_id   UUID REFERENCES calendar_connections(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── tasks ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  due_date         DATE,
  scheduled_start  TIMESTAMPTZ,
  scheduled_end    TIMESTAMPTZ,
  completed        BOOLEAN DEFAULT FALSE,
  completed_at     TIMESTAMPTZ,
  color            TEXT,
  sort_order       INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── ideal_week_frames ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ideal_week_frames (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  color       TEXT NOT NULL DEFAULT '#EAF3DE',
  label       TEXT,
  active      BOOLEAN DEFAULT TRUE
);

-- ── app_settings ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme                 TEXT DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  first_day_of_week     INTEGER DEFAULT 0,
  default_view          TEXT DEFAULT 'week',
  working_hours_start   TIME DEFAULT '08:00',
  working_hours_end     TIME DEFAULT '18:00',
  show_weather          BOOLEAN DEFAULT TRUE,
  show_ideal_week       BOOLEAN DEFAULT TRUE,
  active_calendar_set_id UUID REFERENCES calendar_sets(id) ON DELETE SET NULL,
  weather_lat           NUMERIC DEFAULT 39.6133,
  weather_lng           NUMERIC DEFAULT -104.9873,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security — each user sees only their own rows ───────────────────
ALTER TABLE users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideal_week_frames    ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings         ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ──────────────────────────────────────────────────────────────
-- NOTE: These policies use auth.uid() which is Supabase Auth's user ID.
-- Our app uses JWT session auth (NextAuth), so we bypass RLS server-side
-- using the service role key. RLS still protects the anon/client key.

CREATE POLICY "users_own" ON users
  FOR ALL USING (id = auth.uid());

CREATE POLICY "connections_own" ON calendar_connections
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "sets_own" ON calendar_sets
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "events_own" ON local_events
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "templates_own" ON event_templates
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "tasks_own" ON tasks
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "frames_own" ON ideal_week_frames
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "settings_own" ON app_settings
  FOR ALL USING (user_id = auth.uid());

-- ── Realtime — full row diff on calendar_connections ─────────────────────────
ALTER TABLE calendar_connections REPLICA IDENTITY FULL;
ALTER TABLE local_events         REPLICA IDENTITY FULL;
ALTER TABLE tasks                REPLICA IDENTITY FULL;

-- ── Index helpers ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_connections_user ON calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_time  ON local_events(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_tasks_user        ON tasks(user_id, due_date);
