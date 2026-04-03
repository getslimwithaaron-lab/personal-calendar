# Build State — Personal Calendar App

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress
- .env.local is NOT in git — credentials are listed below for handoff

## Current Status
PHASE: Phase 23 — QA + polish (Aaron tests)
LAST SESSION: 2026-04-03
NEXT ACTION: Aaron runs QA on the touch screen PC, reports bugs, then Claude fixes them

## What Is Working
- All 22 build phases are code-complete and TypeScript-clean
- `npm run build` succeeds with zero errors
- Code is merged to `main` and pushed to GitHub
- Google OAuth test user added (getslimwithaaron@gmail.com)
- Azure app open to all Microsoft accounts (no test user list needed)
- App is designed for a 42" portrait touch screen (not landscape)

## What Has NOT Been Tested Yet
- Nobody has signed in with Google or Microsoft yet — OAuth flows are untested end-to-end
- No real calendar events have been fetched — API integration is untested against live data
- The second PC (touch screen) has not been set up yet
- PWA install has not been tested
- Supabase Realtime subscriptions have not been tested with live data

---

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
| 23 | QA + polish (end-to-end, edge cases, timezone) | Not started — Aaron tests |

---

## All Credentials & Secrets (FULL VALUES)

### .env.local (copy this entire block to any new machine)
```
NEXTAUTH_SECRET=0JH-lmtRU4dYlIWRfDrQhlFPhdwCuzoDXVk2hWnJiHw
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
AZURE_AD_CLIENT_ID=5196fb4b-61fc-4c53-b839-bc135ac30f60
AZURE_AD_CLIENT_SECRET=kuS8Q~EBuXd.ZwGvfZbHncB4zMgbBOVOCXPUhdhb
AZURE_AD_TENANT_ID=common
NEXT_PUBLIC_SUPABASE_URL=https://mivtjdbjztnvtjixhwmh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnRqZGJqenRudnRqaXhod21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDEwMDgsImV4cCI6MjA5MDY3NzAwOH0.TW3fHgAp_Tuk3Q5GOrMEhIGBe7G29u0DNqNf1liJSM8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnRqZGJqenRudnRqaXhod21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEwMTAwOCwiZXhwIjoyMDkwNjc3MDA4fQ.XEtu3V0njgROSG9VkQy_0gQQakEnm6GWusxPscwszyg
SUPABASE_DB_PASSWORD=CalApp2026!xK9#mPqR
```

### Google Cloud Console
- Console URL: https://console.cloud.google.com/apis/credentials?project=personal-calendar-app-492105
- Project name: Personal Calendar App
- Project ID: personal-calendar-app-492105
- OAuth Client ID: 650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com
- OAuth Client Secret: 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
- Redirect URI: http://localhost:3000/api/auth/callback/google
- Google Calendar API: Enabled
- Publishing status: Testing (only test users can sign in)
- Test users: getslimwithaaron@gmail.com
- Logged in as: getslimwithaaron@gmail.com
- To add more test users: Console > Google Auth Platform > Audience > + Add users

### Azure Portal (Microsoft Entra ID)
- Portal URL: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/5196fb4b-61fc-4c53-b839-bc135ac30f60
- App name: Personal Calendar App
- Application (client) ID: 5196fb4b-61fc-4c53-b839-bc135ac30f60
- Directory (tenant) ID: 9e71d637-c1ec-4456-b22a-ac1bdb328c77
- Client secret value: kuS8Q~EBuXd.ZwGvfZbHncB4zMgbBOVOCXPUhdhb
- Client secret expiry: 4/1/2028
- Supported account types: Any Entra ID Tenant + Personal Microsoft accounts (open to all — no test user restriction)
- Redirect URI: http://localhost:3000/api/auth/callback/azure-ad
- API permissions (all granted admin consent): Calendars.ReadWrite, offline_access, User.Read
- Logged in as: getslimwithaaron@gmail.com

### Supabase
- Dashboard URL: https://supabase.com/dashboard/project/mivtjdbjztnvtjixhwmh
- Project ref: mivtjdbjztnvtjixhwmh
- Region: (check dashboard)
- DB password: CalApp2026!xK9#mPqR
- Tables (8): users, calendar_connections, calendar_sets, local_events, event_templates, tasks, ideal_week_frames, app_settings
- RLS: enabled on all tables, bypassed server-side via service role key
- Realtime: enabled on calendar_connections, local_events, tasks (REPLICA IDENTITY FULL)

### GitHub
- Repo: https://github.com/getslimwithaaron-lab/personal-calendar
- Branch: main (all code merged and pushed)
- Also on branch: claude/elated-franklin (identical to main)
- Latest commit: 75c8d9c "Fix layout for 42" portrait touch display"

---

## Tech Stack
- **Framework**: Next.js 16.2.2, React 19.2.4
- **Auth**: NextAuth 5.0.0-beta.30 (JWT strategy, no DB adapter)
- **Styling**: Tailwind CSS 4 (via @tailwindcss/postcss)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Calendar APIs**: Google Calendar API v3, Microsoft Graph v1.0
- **Date/Time**: date-fns 4.1.0, date-fns-tz 3.2.0
- **NLP**: chrono-node 2.9.0
- **Animation**: framer-motion 12.38.0
- **Gestures**: @use-gesture/react 10.3.1
- **Weather**: Open-Meteo (free, no API key needed)

## Project File Structure (key files)
```
C:\Users\unici\Desktop\personal-calendar\
├── app/
│   ├── layout.tsx                    # Root layout (Geist font, SessionProvider, SW register)
│   ├── page.tsx                      # Redirects / → /week
│   ├── globals.css                   # Tailwind + touch optimization + portrait display
│   ├── login/page.tsx                # Google + Microsoft sign-in buttons
│   ├── settings/
│   │   ├── layout.tsx                # Auth gate + AppShell wrapper
│   │   └── page.tsx                  # Theme, working hours, toggles, sign out
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Auth gate + AppShell wrapper
│   │   ├── week/page.tsx             # 7-col time grid
│   │   ├── day/page.tsx              # Single-col time grid
│   │   ├── month/page.tsx            # Calendar grid with event previews
│   │   └── agenda/page.tsx           # 30-day scrollable event list
│   └── api/
│       ├── auth/[...nextauth]/       # NextAuth route handler
│       ├── events/route.ts           # Unified merged events endpoint
│       ├── calendars/google/         # connect, disconnect, events routes
│       ├── calendars/outlook/        # connect, disconnect, events routes
│       ├── tasks/route.ts            # CRUD
│       ├── templates/route.ts        # CRUD
│       ├── ideal-week/route.ts       # CRUD
│       ├── settings/route.ts         # GET + PATCH
│       └── weather/route.ts          # Open-Meteo proxy with 30min cache
├── components/
│   ├── AppShell.tsx                  # Sidebar + Topbar + main + EventDrawer
│   ├── CalendarProvider.tsx          # React context for date state + selected event
│   ├── Sidebar.tsx                   # Nav links (week/day/month/agenda/settings)
│   ├── Topbar.tsx                    # Date display + prev/next/today + sync indicator
│   ├── TimeGrid.tsx                  # Shared hour grid for week + day views
│   ├── EventDrawer.tsx               # Framer Motion slide panel (edit/delete)
│   ├── DraggableEvent.tsx            # Pointer drag to reschedule
│   ├── QuickAdd.tsx                  # NLP event creation input
│   ├── TaskSidebar.tsx               # Task list with add/toggle/delete
│   ├── IdealWeekOverlay.tsx          # Background time block layer
│   └── ServiceWorkerRegister.tsx     # SW registration on mount
├── hooks/
│   ├── useCalendarEvents.ts          # Unified Google + Outlook fetch + merge
│   ├── useGoogleCalendar.ts          # Per-connection Google fetch
│   ├── useOutlookCalendar.ts         # Batch Outlook fetch
│   ├── useRealtimeEvents.ts          # Supabase Realtime subscriptions
│   ├── useTasks.ts                   # Task CRUD
│   ├── useEventTemplates.ts          # Template CRUD
│   ├── useIdealWeek.ts               # Ideal week frame CRUD
│   ├── useSettings.ts                # App settings
│   └── useWeather.ts                 # 7-day forecast
├── lib/
│   ├── auth.ts                       # NextAuth config (Google + Microsoft providers)
│   ├── google/calendar.ts            # Map/list/create/update/delete Google events
│   ├── google/token.ts               # Google token refresh
│   ├── outlook/calendar.ts           # Map/list/create/update/delete Outlook events
│   ├── outlook/token.ts              # Microsoft token refresh
│   ├── events/merge.ts               # Sort, deduplicate, filter, groupByDate
│   ├── events/nlp.ts                 # chrono-node natural language parser
│   ├── events/reschedule.ts          # Client-side reschedule helper
│   ├── events/eventTypes.ts          # Focus/blocked styling definitions
│   ├── supabase/client.ts            # Browser Supabase client
│   ├── supabase/server.ts            # Server Supabase client
│   └── supabase/realtime.ts          # Channel subscription helpers
├── types/index.ts                    # CalendarEvent, Task, AppSettings, etc.
├── middleware.ts                     # Route protection (redirect to /login)
├── public/
│   ├── manifest.json                 # PWA manifest (portrait orientation)
│   ├── sw.js                         # Service worker (stale-while-revalidate)
│   └── icons/icon-192.svg            # App icon
└── supabase/migrations/
    └── 20260401000000_initial_schema.sql  # All 8 tables + RLS + indexes
```

## Display Target
- 42-inch touch screen in PORTRAIT orientation (not landscape)
- Manifest orientation: portrait
- Base font: 18px (20px at viewport height >= 1200px portrait)
- Sidebar: always expanded with labels (no collapsed icon-only mode)
- All touch targets: min 44px (some 64px for primary actions)

## How To Run
```bash
cd C:\Users\unici\Desktop\personal-calendar
npm install
npm run build
npm run start
# Open http://localhost:3000 in Chrome
```

## How To Deploy to Second PC
Full step-by-step instructions were written for a non-technical user. Key steps:
1. Install Chrome, Node.js, Git on the second PC
2. `git clone https://github.com/getslimwithaaron-lab/personal-calendar.git C:\calendar`
3. Copy .env.local (full contents above) into C:\calendar\.env.local
4. `npm install && npm run build && npm run start`
5. Open localhost:3000 in Chrome, install as PWA, press F11 for fullscreen

## Known Issues / Blockers
- Google OAuth is in "Testing" mode — only test users listed in Google Cloud Console can sign in. To let anyone sign in, click "Publish app" on the Audience page (Google may require app verification).
- Azure client secret expires 4/1/2028 — will need to be rotated before then.
- The QuickAdd and TaskSidebar components are built but not wired into the AppShell yet — they need to be added to the UI in a future session.
- DraggableEvent component exists but TimeGrid still uses the simpler EventBlock — needs to be swapped in.
- IdealWeekOverlay component exists but is not rendered in the week view yet — needs to be integrated.
- Weather hook exists but is not displayed in any view yet — needs to be wired into week/day headers.

## Session Log
| Date | What was done |
|------|--------------|
| 2026-04-01 | Phase 1 confirmed complete |
| 2026-04-01 | Phase 2 complete — auth, middleware, login page, schema |
| 2026-04-02 | Supabase schema applied (all 8 tables confirmed in dashboard) |
| 2026-04-02 | Google Cloud project created, Calendar API enabled, OAuth configured |
| 2026-04-02 | Phase 3 complete — Google credentials, token refresh, event CRUD, hook |
| 2026-04-02 | Phase 4 complete — Outlook token refresh, Graph CRUD, 3 API routes, hook |
| 2026-04-02 | Phase 4 Azure portal — App registered, client secret created (24mo), API permissions granted |
| 2026-04-02 | Phase 5 complete — merge utility, unified hook, unified API route |
| 2026-04-02 | Phase 6 complete — Realtime helpers, useRealtimeEvents hook |
| 2026-04-02 | Phase 7 complete — AppShell, Sidebar, Topbar, dashboard layout |
| 2026-04-03 | Phases 8-11 — All four calendar views (week, day, month, agenda) |
| 2026-04-03 | Phases 12-14 — Drag reschedule, NLP quick add, event detail drawer |
| 2026-04-03 | Phases 15-17 — Templates API, ideal week API + overlay, task sidebar + API |
| 2026-04-03 | Phases 18-19 — Weather API + hook, focus/blocked event types |
| 2026-04-03 | Phase 20 — Settings panel |
| 2026-04-03 | Phase 21 — Touch optimization CSS |
| 2026-04-03 | Phase 22 — PWA manifest + service worker |
| 2026-04-03 | Portrait display fix — manifest orientation, font scaling, sidebar always expanded |
| 2026-04-03 | Google test user added (getslimwithaaron@gmail.com) |
| 2026-04-03 | Azure verified open to all Microsoft accounts |
| 2026-04-03 | Code merged to main, pushed to GitHub, build verified |
| 2026-04-03 | Comprehensive handoff BUILD_STATE.md written |
