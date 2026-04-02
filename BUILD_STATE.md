# Build State — Calendar App

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress

## Current Status
PHASE: Phase 4 — Outlook OAuth + Microsoft Graph (Aaron approves before starting)
LAST SESSION: 2026-04-02 — Phase 3 complete, committed, pushed
NEXT ACTION: Begin Phase 4 OR skip to Phase 5 (event merge layer) if Outlook not needed yet

## Phase Completion Tracker

| # | Phase | Status |
|---|-------|--------|
| 1 | Scaffold (Next.js, Supabase, GitHub, Vercel) | ✅ Complete |
| 2 | Auth + user (Supabase Auth, NextAuth, protected routes) | ✅ Complete |
| 3 | Google Calendar OAuth + read/write | ✅ Complete |
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

## Environment Variables (.env.local)
NEXTAUTH_SECRET=✅ set
NEXTAUTH_URL=✅ http://localhost:3000
GOOGLE_CLIENT_ID=✅ 650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=✅ set (GOCSPX-...)
AZURE_AD_CLIENT_ID=⚠️ empty — needed for Phase 4
AZURE_AD_CLIENT_SECRET=⚠️ empty — needed for Phase 4
AZURE_AD_TENANT_ID=✅ common
NEXT_PUBLIC_SUPABASE_URL=✅ set
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅ set
SUPABASE_SERVICE_ROLE_KEY=✅ set

## Google Cloud Console (Phase 3)
Project: Personal Calendar App (personal-calendar-app-492105)
Client ID: 650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com
Redirect URI: http://localhost:3000/api/auth/callback/google ✅
Google Calendar API: Enabled ✅
OAuth consent: Configured ✅
Old secret (****qm8x): DISABLE this in Google console — new one is active
New secret (****1tOX): Active ✅

## Phase 3 — What Was Built
- lib/google/token.ts — Token refresh logic, auto-refresh if expiring within 5 min
- lib/google/calendar.ts — List/create/update/delete Google Calendar events, event mapper
- app/api/calendars/google/connect/route.ts — POST: saves connection to Supabase
- app/api/calendars/google/events/route.ts — GET/POST/PATCH/DELETE events via Google API
- app/api/calendars/google/disconnect/route.ts — DELETE: removes connection from Supabase
- hooks/useGoogleCalendar.ts — Client hook to fetch events across multiple connections

## Known Issues / Blockers
- Old Google OAuth secret (****qm8x) should be disabled in Google Cloud Console
  Go to: https://console.cloud.google.com/auth/clients/650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com?project=personal-calendar-app-492105
  Click Disable next to the old secret
- Phase 4 (Outlook) requires Azure app registration — Aaron approves before starting

## Session Log
| Date | What was done |
|------|--------------|
| 2026-04-01 | Phase 1 confirmed complete |
| 2026-04-01 | Phase 2 complete — auth, middleware, login page, schema |
| 2026-04-02 | Supabase schema applied (all 8 tables confirmed in dashboard) |
| 2026-04-02 | Google Cloud project created, Calendar API enabled, OAuth configured |
| 2026-04-02 | Phase 3 complete — Google credentials, token refresh, event CRUD, hook |
