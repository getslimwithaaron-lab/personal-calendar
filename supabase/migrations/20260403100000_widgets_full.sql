-- ============================================================
-- Widget system tables + 8 new feature tables
-- ============================================================

-- ── widget_layouts (persisted position/size per widget per user) ──────────────
CREATE TABLE IF NOT EXISTS widget_layouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  widget_key  TEXT NOT NULL,
  x           INTEGER NOT NULL DEFAULT 100,
  y           INTEGER NOT NULL DEFAULT 100,
  w           INTEGER NOT NULL DEFAULT 380,
  h           INTEGER NOT NULL DEFAULT 320,
  collapsed   BOOLEAN DEFAULT FALSE,
  visible     BOOLEAN DEFAULT TRUE,
  z_index     INTEGER DEFAULT 1,
  UNIQUE(user_id, widget_key)
);

-- ── grocery_items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grocery_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  checked     BOOLEAN DEFAULT FALSE,
  category    TEXT DEFAULT 'other',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── meal_plans ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal        TEXT NOT NULL DEFAULT '',
  week_start  DATE NOT NULL,
  UNIQUE(user_id, day_of_week, week_start)
);

-- ── recipes ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recipes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  ingredients  TEXT[] NOT NULL DEFAULT '{}',
  instructions TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── chores ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  assignee    TEXT NOT NULL DEFAULT 'aaron',
  due_date    DATE,
  completed   BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  recurring   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── birthdays ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS birthdays (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  month       INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  day         INTEGER NOT NULL CHECK (day BETWEEN 1 AND 31),
  year        INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── countdowns ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS countdowns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  target_date DATE NOT NULL,
  color       TEXT DEFAULT '#3b82f6',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── expenses ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  category    TEXT DEFAULT 'other',
  paid_by     TEXT DEFAULT 'aaron',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── family_contacts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS family_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  role        TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE widget_layouts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthdays        ENABLE ROW LEVEL SECURITY;
ALTER TABLE countdowns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_contacts  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wl_own" ON widget_layouts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "gi_own" ON grocery_items FOR ALL USING (user_id = auth.uid());
CREATE POLICY "mp_own" ON meal_plans FOR ALL USING (user_id = auth.uid());
CREATE POLICY "rc_own" ON recipes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "ch_own" ON chores FOR ALL USING (user_id = auth.uid());
CREATE POLICY "bd_own" ON birthdays FOR ALL USING (user_id = auth.uid());
CREATE POLICY "cd_own" ON countdowns FOR ALL USING (user_id = auth.uid());
CREATE POLICY "ex_own" ON expenses FOR ALL USING (user_id = auth.uid());
CREATE POLICY "fc_own" ON family_contacts FOR ALL USING (user_id = auth.uid());

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_wl_user ON widget_layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_gi_user ON grocery_items(user_id);
CREATE INDEX IF NOT EXISTS idx_mp_user ON meal_plans(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_ch_user ON chores(user_id);
CREATE INDEX IF NOT EXISTS idx_ex_user ON expenses(user_id, expense_date);
