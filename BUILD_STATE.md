# Build State — Calendar App

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress

## Current Status
PHASE: Phase 5 — Event merge layer
LAST SESSION: 2026-04-02 — Phase 4 code complete, TypeScript clean, committed
NEXT ACTION: Begin Phase 5 — normalize Google + Outlook events into unified CalendarEvent array

## Phase Completion Tracker

| # | Phase | Status |
|---|-------|--------|
| 1 | Scaffold (Next.js, Supabase, GitHub, Vercel) | ✅ Complete |
| 2 | Auth + user (Supabase Auth, NextAuth, protected routes) | ✅ Complete |
| 3 | Google Calendar OAuth + read/write | ✅ Complete |
| 4 | Outlook OAuth + Microsoft Graph read/write | ✅ Complete — Azure portal needed |
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
GOOGLE_CLIENT_ID=✅ set
GOOGLE_CLIENT_SECRET=✅ set
AZURE_AD_CLIENT_ID=⚠️ empty — Aaron must add after Azure portal setup
AZURE_AD_CLIENT_SECRET=⚠️ empty — Aaron must add after Azure portal setup
AZURE_AD_TENANT_ID=✅ common
NEXT_PUBLIC_SUPABASE_URL=✅ set
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅ set
SUPABASE_SERVICE_ROLE_KEY=✅ set

## Azure Portal Setup (Aaron must complete before Outlook works)
1. Go to https://portal.azure.com
2. Azure Active Directory > App registrations > New registration
3. Name: "Personal Calendar App"
4. Supported account types: Accounts in any organizational directory AND personal Microsoft accounts
5. Redirect URI: Web > http://localhost:3000/api/auth/callback/azure-ad
6. After creation: API permissions > Add > Microsoft Graph > Delegated:
   - Calendars.ReadWrite
   - offline_access
   - User.Read
   - Grant admin consent
7. Certificates & secrets > New client secret > copy value immediately
8. Copy Application (client) ID and secret into .env.local as AZURE_AD_CLIENT_ID and AZURE_AD_CLIENT_SECRET

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
- Azure portal registration not yet done — Outlook auth won't work until AZURE_AD_CLIENT_ID and AZURE_AD_CLIENT_SECRET are in .env.local
- See Azure Portal Setup section above for exact steps

## Session Log
| Date | What was done |
|------|--------------|
| 2026-04-01 | Phase 1 confirmed complete |
| 2026-04-01 | Phase 2 complete — auth, middleware, login page, schema |
| 2026-04-02 | Supabase schema applied (all 8 tables confirmed in dashboard) |
| 2026-04-02 | Google Cloud project created, Calendar API enabled, OAuth configured |
| 2026-04-02 | Phase 3 complete — Google credentials, token refresh, event CRUD, hook |
| 2026-04-02 | Phase 4 complete — Outlook token refresh, Graph CRUD, 3 API routes, hook |
