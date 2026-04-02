# Build State — Calendar App

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress

## Current Status
PHASE: Phase 3 — Google Calendar OAuth + read/write (Aaron approves)
LAST SESSION: 2026-04-01 — Phase 2 complete, committed, pushed
NEXT ACTION: Aaron runs schema SQL in Supabase dashboard, then begin Phase 3

## Phase Completion Tracker

| # | Phase | Status |
|---|-------|--------|
| 1 | Scaffold (Next.js, Supabase, GitHub, Vercel) | ✅ Complete |
| 2 | Auth + user (Supabase Auth, NextAuth, protected routes) | ✅ Complete |
| 3 | Google Calendar OAuth + read/write | Not started - Aaron approves |
| 4 | Outlook OAuth + Microsoft Graph read/write | Not started - Aaron approves |
| 5 | Event merge layer (normalize Google + Outlook) | Not started |
| 6 | Supabase Realtime push sync | Not started |
| 7 | App shell + layout (sidebar, topbar, nav, theme) | Not started |
| 8 | Week view (7-col grid, swipe, split-column mode) | Not started |
| 9 | Day view (hour timeline, now bar, auto-scroll) | Not started |
| 10 | Month view (grid, dot indicators, tap to jump) | Not started |
| 11 | Agenda view (scrollable list, date headers) | Not started |
| 12 | Drag to reschedule (use Claude Code) | Not started |
| 13 | Natural language event creation (use Claude Code) | Not started |
| 14 | Event detail drawer (Framer Motion, edit, delete) | Not started |
| 15 | Event templates (save, quick-create, manage) | Not started |
| 16 | Ideal week frames (background layer, settings) | Not started |
| 17 | Task sidebar (add, drag to timebox) (use Claude Code) | Not started |
| 18 | Weather inline (Open-Meteo, cache, day cell display) | Not started |
| 19 | Focus + blocked event types | Not started |
| 20 | Settings panel (theme, hours, colors) | Not started |
| 21 | Touch optimization pass (64px targets, scroll) | Not started |
| 22 | Progressive Web App (manifest, service worker) | Not started |
| 23 | QA + polish (end-to-end, edge cases, timezone) | Not started - Aaron tests |

## Environment Variables Needed (.env.local)
NEXTAUTH_SECRET=✅ set
NEXTAUTH_URL=✅ http://localhost:3000
GOOGLE_CLIENT_ID=⚠️ empty — needed for Phase 3
GOOGLE_CLIENT_SECRET=⚠️ empty — needed for Phase 3
AZURE_AD_CLIENT_ID=⚠️ empty — needed for Phase 4
AZURE_AD_CLIENT_SECRET=⚠️ empty — needed for Phase 4
AZURE_AD_TENANT_ID=✅ common
NEXT_PUBLIC_SUPABASE_URL=✅ set
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅ set
SUPABASE_SERVICE_ROLE_KEY=✅ set

## Phase 2 — What Was Built
- lib/auth.ts — NextAuth v5 full config: Google + Microsoft providers, Supabase user upsert on
  sign-in, JWT stores supabaseUserId/accessToken/refreshToken/provider/expiresAt
- middleware.ts — Protects all routes; unauthenticated → /login, logged in → /week
- types/next-auth.d.ts — TypeScript augmentation for Session + JWT
- app/login/page.tsx — Touch-optimized login page (72px buttons, Google + Microsoft)
- app/layout.tsx — Root layout with SessionProvider
- app/(dashboard)/layout.tsx — Server-side auth check on every dashboard render
- supabase/migrations/20260401000000_initial_schema.sql — Full 8-table schema + RLS + indexes
- .env.local — Fixed BOM character that broke Supabase CLI

## Pending Manual Step (Aaron)
⚠️ Schema SQL not yet confirmed applied to Supabase.
If not done: open https://supabase.com/dashboard/project/mivtjdbjztnvtjixhwmh/sql/new
Paste + run: supabase/migrations/20260401000000_initial_schema.sql

## Known Issues / Blockers
- GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET empty — Phase 3 blocked until Aaron creates
  Google Cloud Console OAuth credentials (walkthrough included in Phase 3 session)
- Schema may need manual apply in Supabase SQL editor (see Pending Manual Step above)

## Session Log
| Date | What was done |
|------|--------------|
| 2026-04-01 | Phase 1 confirmed complete (scaffold existed from prior work) |
| 2026-04-01 | Phase 2 complete — auth, middleware, login page, schema, committed + pushed |
