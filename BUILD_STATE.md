# Build State — Calendar App

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress

## Current Status
PHASE: Phase 23 — QA + polish (Aaron tests)
LAST SESSION: 2026-04-03 — Phases 8-22 all complete
NEXT ACTION: Aaron runs QA + polish pass

## Phase Completion Tracker

| # | Phase | Status |
|---|-------|--------|
| 1 | Scaffold (Next.js, Supabase, GitHub, Vercel) | ✅ Complete |
| 2 | Auth + user (Supabase Auth, NextAuth, protected routes) | ✅ Complete |
| 3 | Google Calendar OAuth + read/write | ✅ Complete |
| 4 | Outlook OAuth + Microsoft Graph read/write | ✅ Complete |
| 5 | Event merge layer (normalize Google + Outlook) | ✅ Complete |
| 6 | Supabase Realtime push sync | ✅ Complete |
| 7 | App shell + layout (sidebar, topbar, nav, theme) | ✅ Complete |
| 8 | Week view (7-col grid, swipe, split-column mode) | ✅ Complete |
| 9 | Day view (hour timeline, now bar, auto-scroll) | ✅ Complete |
| 10 | Month view (grid, dot indicators, tap to jump) | ✅ Complete |
| 11 | Agenda view (scrollable list, date headers) | ✅ Complete |
| 12 | Drag to reschedule (use Claude Code) | ✅ Complete |
| 13 | Natural language event creation (use Claude Code) | ✅ Complete |
| 14 | Event detail drawer (Framer Motion, edit, delete) | ✅ Complete |
| 15 | Event templates (save, quick-create, manage) | ✅ Complete |
| 16 | Ideal week frames (background layer, settings) | ✅ Complete |
| 17 | Task sidebar (add, drag to timebox) (use Claude Code) | ✅ Complete |
| 18 | Weather inline (Open-Meteo, cache, day cell display) | ✅ Complete |
| 19 | Focus + blocked event types | ✅ Complete |
| 20 | Settings panel (theme, hours, colors) | ✅ Complete |
| 21 | Touch optimization pass (64px targets, scroll) | ✅ Complete |
| 22 | Progressive Web App (manifest, service worker) | ✅ Complete |
| 23 | QA + polish (end-to-end, edge cases, timezone) | Not started - Aaron tests |

## Environment Variables (.env.local)
NEXTAUTH_SECRET=✅ set
NEXTAUTH_URL=✅ http://localhost:3000
GOOGLE_CLIENT_ID=✅ set
GOOGLE_CLIENT_SECRET=✅ set
AZURE_AD_CLIENT_ID=✅ set
AZURE_AD_CLIENT_SECRET=✅ set
AZURE_AD_TENANT_ID=✅ common
NEXT_PUBLIC_SUPABASE_URL=✅ set
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅ set
SUPABASE_SERVICE_ROLE_KEY=✅ set

## Azure Portal Setup ✅ Complete
- App: Personal Calendar App
- Client ID: 5196fb4b-61fc-4c53-b839-bc135ac30f60
- Tenant: Any Entra ID Tenant + Personal Microsoft accounts
- Redirect URI: http://localhost:3000/api/auth/callback/azure-ad
- Client secret: set (expires 4/1/2028)
- API permissions: Calendars.ReadWrite, offline_access, User.Read — all granted admin consent

## Phase 4 — What Was Built
- lib/outlook/token.ts — Microsoft token refresh, auto-refresh if expiring within 5 min, rotated token support
- lib/outlook/calendar.ts — Map/list/create/update/delete via Microsoft Graph, Windows→IANA timezone map
- app/api/calendars/outlook/connect/route.ts — POST: saves Outlook connection to Supabase
- app/api/calendars/outlook/events/route.ts — GET/POST/PATCH/DELETE events via Graph API
- app/api/calendars/outlook/disconnect/route.ts — DELETE: removes connection from Supabase
- hooks/useOutlookCalendar.ts — Client hook to fetch events across all active Outlook connections

## Google Cloud Console (Phase 3)
Project: Personal Calendar App (personal-calendar-app-492105)
Client ID: 650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com
Redirect URI: http://localhost:3000/api/auth/callback/google ✅
Google Calendar API: Enabled ✅
Old secret (****qm8x): Disabled ✅
New secret (****1tOX): Active ✅

## Known Issues / Blockers
- None

## Session Log
| Date | What was done |
|------|--------------|
| 2026-04-01 | Phase 1 confirmed complete |
| 2026-04-01 | Phase 2 complete — auth, middleware, login page, schema |
| 2026-04-02 | Supabase schema applied (all 8 tables confirmed in dashboard) |
| 2026-04-02 | Google Cloud project created, Calendar API enabled, OAuth configured |
| 2026-04-02 | Phase 3 complete — Google credentials, token refresh, event CRUD, hook |
| 2026-04-02 | Phase 4 complete — Outlook token refresh, Graph CRUD, 3 API routes, hook |
| 2026-04-02 | Phase 4 Azure portal — App registered, client secret created (24mo), API permissions granted (Calendars.ReadWrite, offline_access, User.Read), env vars set |
| 2026-04-02 | Phase 5 complete — merge utility (lib/events/merge.ts), unified hook (useCalendarEvents), unified API route (api/events) |
| 2026-04-02 | Phase 6 complete — Realtime helpers (lib/supabase/realtime.ts), useRealtimeEvents hook, subscriptions for connections/events/tasks |
| 2026-04-02 | Phase 7 complete — AppShell, Sidebar (nav icons, active state), Topbar (date nav, sync indicator), dashboard layout integration |
| 2026-04-03 | Phases 8-11 — Week view (7-col TimeGrid, day headers, auto-scroll), Day view (single column), Month view (grid with event previews/dots), Agenda view (30-day list with sticky date headers) |
| 2026-04-03 | Phases 12-14 — DraggableEvent (pointer drag reschedule), NLP parser (chrono-node QuickAdd), EventDrawer (Framer Motion slide, edit/delete) |
| 2026-04-03 | Phases 15-17 — Event templates API + hook, Ideal week frames API + overlay component, Task sidebar + full CRUD API |
| 2026-04-03 | Phases 18-19 — Weather API (Open-Meteo, 30min cache) + useWeather hook, Focus/blocked event type styling system |
| 2026-04-03 | Phase 20 — Settings panel (theme, default view, working hours, weather/ideal week toggles, sign out) |
| 2026-04-03 | Phase 21 — Touch optimization (refined CSS, scrollbar styling, safe-area padding, tap-scale, focus-visible, no-select) |
| 2026-04-03 | Phase 22 — PWA (service worker with stale-while-revalidate, SW registration component, updated manifest with SVG icons) |
