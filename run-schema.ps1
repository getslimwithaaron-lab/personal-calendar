Set-Location "C:\Users\unici\Desktop\personal-calendar"

$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnRqZGJqenRudnRqaXhod21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEwMTAwOCwiZXhwIjoyMDkwNjc3MDA4fQ.XEtu3V0njgROSG9VkQy_0gQQakEnm6GWusxPscwszyg"
$supabaseUrl = "https://mivtjdbjztnvtjixhwmh.supabase.co"

$sql = @"
-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Denver',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event templates (referenced by local_events)
CREATE TABLE IF NOT EXISTS event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  default_duration_min INTEGER DEFAULT 60,
  color TEXT,
  notes TEXT,
  location TEXT,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar connections
CREATE TABLE IF NOT EXISTS calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  account_email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ NOT NULL,
  calendar_id TEXT NOT NULL DEFAULT 'primary',
  calendar_name TEXT,
  color TEXT NOT NULL DEFAULT '#378ADD',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar sets
CREATE TABLE IF NOT EXISTS calendar_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  included_connection_ids UUID[] NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);

-- Local events
CREATE TABLE IF NOT EXISTS local_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  color TEXT,
  event_type TEXT DEFAULT 'standard' CHECK (event_type IN ('standard','focus','blocked')),
  notes TEXT,
  location TEXT,
  recurrence_rule TEXT,
  template_id UUID REFERENCES event_templates(id) ON DELETE SET NULL,
  external_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('google','outlook','local')),
  connection_id UUID REFERENCES calendar_connections(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideal week frames
CREATE TABLE IF NOT EXISTS ideal_week_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color TEXT NOT NULL DEFAULT '#EAF3DE',
  label TEXT,
  active BOOLEAN DEFAULT TRUE
);

-- App settings
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  first_day_of_week INTEGER DEFAULT 0,
  default_view TEXT DEFAULT 'week',
  working_hours_start TIME DEFAULT '08:00',
  working_hours_end TIME DEFAULT '18:00',
  show_weather BOOLEAN DEFAULT TRUE,
  show_ideal_week BOOLEAN DEFAULT TRUE,
  active_calendar_set_id UUID REFERENCES calendar_sets(id) ON DELETE SET NULL,
  weather_lat NUMERIC DEFAULT 39.6133,
  weather_lng NUMERIC DEFAULT -104.9873,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: enable on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideal_week_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY IF NOT EXISTS "users_own" ON users FOR ALL USING (id = auth.uid());
CREATE POLICY IF NOT EXISTS "connections_own" ON calendar_connections FOR ALL USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "sets_own" ON calendar_sets FOR ALL USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "events_own" ON local_events FOR ALL USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "templates_own" ON event_templates FOR ALL USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "tasks_own" ON tasks FOR ALL USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "frames_own" ON ideal_week_frames FOR ALL USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "settings_own" ON app_settings FOR ALL USING (user_id = auth.uid());

-- Realtime: full replica identity for live sync
ALTER TABLE calendar_connections REPLICA IDENTITY FULL;
ALTER TABLE local_events REPLICA IDENTITY FULL;
ALTER TABLE tasks REPLICA IDENTITY FULL;
"@

$body = @{ query = $sql } | ConvertTo-Json -Depth 3
$headers = @{
  "Authorization" = "Bearer $serviceKey"
  "Content-Type"  = "application/json"
  "apikey"        = $serviceKey
}

Write-Host "Running schema against Supabase..."
try {
  $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body -ErrorAction Stop
  Write-Host "Schema applied via RPC"
} catch {
  Write-Host "RPC not available, trying direct query endpoint..."
  # Fall back: use pg endpoint via management API
  $response2 = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Headers $headers
  Write-Host "Status: $($response2.StatusCode)"
}

Write-Host "SCHEMA_DONE"
