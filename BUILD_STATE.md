# Build State — Personal Calendar App

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress
- .env.local is NOT in git — credentials are listed below for handoff

## Current Status
PHASE: Phase 23 — QA + polish (floating widgets + family alerts + auto-launch complete)
LAST SESSION: 2026-04-03
NEXT ACTION: QA on all devices — test OAuth sign-in, widgets, alerts from phone, reboot test for auto-launch

## What Is Working
- All 22 build phases are code-complete and TypeScript-clean
- `npm run build` succeeds with zero errors
- Code is merged to `main` and pushed to GitHub
- Google OAuth test user added (getslimwithaaron@gmail.com)
- Azure app open to all Microsoft accounts (no test user list needed)
- Responsive design works on all devices: phone, tablet, laptop, desktop, 42" portrait touch screen
- Sidebar: collapsible on desktop/tablet, bottom nav bar on mobile
- QuickAdd (NLP event creation) is wired into the UI below the topbar
- TaskSidebar is wired in — toggled via task icon in the topbar, overlay on mobile
- DraggableEvent is wired into TimeGrid — drag-to-reschedule works in week/day views
- IdealWeekOverlay renders background time blocks in week/day views (controlled by settings)
- Weather emoji + temps display in week day headers and day view header
- Calendar sync uses the unified `/api/events` endpoint that fetches all connected Google + Outlook calendars server-side
- All four views (week, day, month, agenda) are responsive with mobile-optimized layouts
- EventDrawer is full-screen on mobile, side panel on desktop
- **12 floating widgets** — each is an independent floating panel, draggable anywhere by finger, resizable from bottom-right corner, double-tap title bar to collapse:
  1. **Notes** — freeform text area, auto-saves to Supabase with 800ms debounce
  2. **To Do** — two-column layout (Aaron / Jessica), add tasks with assignee, overdue items in red, checkbox strikethrough
  3. **7-Day Forecast** — weather strip with emoji + high/low temps from Open-Meteo
  4. **Mini Calendar** — small month grid, clicking a day jumps to it in the main view
  5. **Grocery List** — shared list, check off items (checked moves to bottom), add by typing
  6. **Meal Planner** — pick dinner for each day of the week, today's meal shown prominently
  7. **Recipe Box** — store recipes with ingredients, one tap adds all ingredients to grocery list
  8. **Chore Chart** — assign chores to Aaron or Jessica, checkbox to complete, overdue shows red
  9. **Birthday Tracker** — add birthdays, shows upcoming in order with countdown in days
  10. **Event Countdown** — add any future event, shows big countdown in days, stack multiple
  11. **Expense Tracker** — add shared expenses, paid-by tags, running monthly total
  12. **Family Contacts** — quick contact cards, name + phone + role, tap to call
- Widget positions and sizes save to Supabase via `widget_layouts` table
- Widget menu button (bottom-right) to add/remove any widget
- All widget tap targets are 64px+ for touch screen
- z-order management — clicking a widget brings it to front
- **Family Alert system:**
  - `/alert` mobile page — send alerts from any phone browser (requires Google sign-in)
  - Quick preset alerts: "I'm on my way home", "Call me now", "Dinner is ready", etc.
  - Full-screen overlay on touch screen — big bold text, sender name + timestamp
  - Hold-to-dismiss (2 seconds) prevents accidental dismissal
  - Multiple alerts stack — shows one at a time, count badge
  - Supabase Realtime push — alert appears within 1 second of sending
  - Alert History floating widget shows all past alerts
  - `family_alerts` table with RLS + REPLICA IDENTITY FULL for Realtime
- **Startup automation:**
  - `launch-calendar.ps1` — PowerShell script starts dev server hidden, waits for ready, opens Chrome kiosk
  - `launch-calendar.bat` — thin wrapper that calls the PS1 (kept for compatibility)
  - `launch-calendar.vbs` — runs PS1 with zero visible windows
  - Desktop shortcut "Family Calendar" on `C:\Users\unici\Desktop` — single tap to launch
  - Startup shortcut in Windows startup folder — auto-launches on every boot/restart
  - Chrome opens in `--kiosk` mode (full screen, no address bar, no tabs, no buttons)
  - Duplicate detection — if server already running, skips to Chrome without starting a second copy
- **Windows auto-login:** NOT YET CONFIGURED — Aaron needs to run the PowerShell command in BUILD_STATE.md with his Windows password (requires Admin). Once done, the full reboot chain is: power on → Windows auto-login → startup shortcut → hidden server → Chrome kiosk → calendar app
- Redirect loop fixed: removed middleware.ts, moved / redirect to next.config.ts, fixed service worker caching

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
| 24 | Turn app into a shareable product for other families | Planned — not started |

---

## Phase 24 Plan — Turn App Into a Shareable Product

**Status:** Planned — not started

### Step 1 — Public Landing Page
Public marketing page at the root URL (`/`). Shows what the app does, screenshots, pricing, and a Sign Up button. Clean, professional design. Current authenticated users still redirect to `/week`.

### Step 2 — Self-Service Sign Up
Any family can go to the URL, enter their name and email, create a password, and they are in. No technical setup required on their end. Standard email + password auth alongside existing Google/Microsoft OAuth.

### Step 3 — Onboarding Flow
After sign up, walks the new user through: (1) connecting their Google or Outlook calendar, (2) setting up their first widget, (3) inviting a family member. Simple step-by-step wizard with big touch-friendly buttons.

### Step 4 — Billing with Stripe
- $4.99/month or $39/year
- 14-day free trial, no credit card required to start
- Cancel any time
- Stripe handles all payment processing
- App checks subscription status and gates access after trial expires

### Step 5 — Family Member Invites
Account owner can invite one other person by email. Invitee gets a link, clicks it, creates a password, and shares the same calendar and widgets. No technical knowledge needed.

### Step 6 — Admin Dashboard
Simple page where Aaron can see: number of families signed up, how many are on trial vs paid, and monthly revenue. Nothing fancy — just the key metrics.

### Step 7 — Deploy to Vercel with a Real Domain
App lives at a clean URL (e.g. familydashboard.app or similar). SSL included automatically via Vercel. Production environment with proper env vars.

### Step 8 — PWA Install Prompt
When someone opens the app on their phone, prompt them to add it to their home screen so it feels like a real app install. Uses the `beforeinstallprompt` event.

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
│   ├── WidgetPanel.tsx                # Resizable widget container panel
│   ├── widgets/
│   │   ├── NotesWidget.tsx            # Freeform notes, auto-save to Supabase
│   │   ├── ToDoWidget.tsx             # Two-column task list (Aaron/Jessica)
│   │   ├── WeatherWidget.tsx          # 7-day forecast strip
│   │   └── MiniCalendarWidget.tsx     # Small month grid, click to navigate
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
│   ├── useWeather.ts                 # 7-day forecast
│   └── useNotes.ts                   # Notes CRUD with auto-save debounce
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
- Fully responsive: phones (320px+), tablets (768px+), laptops (1024px+), desktops (1280px+), 42" portrait touch screen
- Works in both portrait and landscape orientation automatically
- Base font: 16px (17px at 1280px+, 20px on large portrait displays)
- Sidebar: collapsible on desktop/tablet (icon-only or expanded), bottom nav bar on mobile
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

## Windows Auto-Login Setup (Aaron must do this manually)
Open PowerShell **as Administrator** and run:
```powershell
$path = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"
Set-ItemProperty -Path $path -Name "AutoAdminLogon" -Value "1"
Set-ItemProperty -Path $path -Name "DefaultUserName" -Value "unici"
Set-ItemProperty -Path $path -Name "DefaultDomainName" -Value "APDSW"
Set-ItemProperty -Path $path -Name "DefaultPassword" -Value "YOUR_PASSWORD_HERE"
```
Replace `YOUR_PASSWORD_HERE` with the actual Windows password. To undo: set `AutoAdminLogon` to `"0"`.

## Known Issues / Blockers
- Google OAuth is in "Testing" mode — only test users listed in Google Cloud Console can sign in. To let anyone sign in, click "Publish app" on the Audience page (Google may require app verification).
- Azure client secret expires 4/1/2028 — will need to be rotated before then.
- OAuth flows are still untested end-to-end — first real sign-in + event fetch needs QA.
- Both Supabase migrations have been applied and verified:
  1. `20260403000000_notes_and_assignee.sql` — `notes` table + `assignee` column on `tasks` ✅
  2. `20260403100000_widgets_full.sql` — `widget_layouts` + 8 new tables ✅
  All 10 new tables confirmed in database: notes, widget_layouts, grocery_items, meal_plans, recipes, chores, birthdays, countdowns, expenses, family_contacts

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
| 2026-04-03 | Phase 23 fixes: Sidebar responsive (collapsible desktop + mobile bottom nav) |
| 2026-04-03 | Responsive CSS: breakpoints for phone/tablet/laptop/desktop/42" portrait |
| 2026-04-03 | Wired QuickAdd into AppShell below topbar |
| 2026-04-03 | Wired TaskSidebar into AppShell with topbar toggle button |
| 2026-04-03 | Swapped EventBlock for DraggableEvent in TimeGrid (drag-to-reschedule) |
| 2026-04-03 | Wired IdealWeekOverlay into TimeGrid for week + day views |
| 2026-04-03 | Wired Weather into week day headers + day view header |
| 2026-04-03 | Rewrote useCalendarEvents to use unified /api/events endpoint |
| 2026-04-03 | All views responsive: month uses dots on mobile, agenda/week compact |
| 2026-04-03 | Build verified — zero TypeScript errors, zero build errors |
| 2026-04-03 | Fixed 307 redirect loop: deleted middleware.ts, moved redirect to next.config.ts |
| 2026-04-03 | Fixed Tailwind CSS: changed @tailwind directives to @import "tailwindcss" for v4 |
| 2026-04-03 | Fixed service worker: sw.js no longer caches HTML pages (was causing redirect loop) |
| 2026-04-03 | Fixed hydration error: NowLine component now client-only with useEffect |
| 2026-04-03 | Widget panel: Notes, To Do (Aaron/Jessica columns), 7-Day Forecast, Mini Calendar |
| 2026-04-03 | Notes API: /api/notes GET + PUT, auto-save with 800ms debounce, Supabase persistence |
| 2026-04-03 | Tasks extended: assignee column (aaron/jessica), updated API + types + hook |
| 2026-04-03 | Widget panel drag-to-resize (120-600px), collapsible, 64px+ touch targets |
| 2026-04-03 | Migration file: supabase/migrations/20260403000000_notes_and_assignee.sql |
| 2026-04-03 | WHAT_THE_APP_DOES.md written — plain English feature guide |
| 2026-04-03 | Floating widget system: FloatingWidget shell (drag, resize, collapse, z-order) |
| 2026-04-03 | 12 widgets built: Notes, To Do, Weather, Mini Calendar, Grocery, Meals, Recipes, Chores, Birthdays, Countdowns, Expenses, Contacts |
| 2026-04-03 | WidgetManager with add/remove menu, layout persistence to Supabase |
| 2026-04-03 | 9 new API routes: widget-layouts, grocery, meals, recipes, chores, birthdays, countdowns, expenses, contacts |
| 2026-04-03 | Migration: 20260403100000_widgets_full.sql (9 tables, RLS, indexes) |
| 2026-04-03 | Generic CRUD hook factory (useWidgetData.ts) for all widget data |
| 2026-04-03 | Build verified — zero TypeScript errors, all 25 API routes registered |
| 2026-04-03 | Both Supabase migrations applied and verified — all 10 new tables confirmed in database |
| 2026-04-03 | Family Alert system: /api/alerts route, useAlerts hook with Supabase Realtime |
| 2026-04-03 | AlertOverlay: full-screen popup, hold-to-dismiss (2s), stacking, sender info |
| 2026-04-03 | /alert mobile page: Google sign-in, text input, 6 quick preset alerts |
| 2026-04-03 | AlertHistoryWidget added to floating widget system (widget #13) |
| 2026-04-03 | Migration 20260403200000_family_alerts.sql applied to Supabase |
| 2026-04-03 | Build verified — zero errors, /alert + /api/alerts routes confirmed |
| 2026-04-03 | Startup automation: launch-calendar.ps1, .bat, .vbs — hidden server + kiosk Chrome |
| 2026-04-03 | Desktop shortcut "Family Calendar" created, startup folder shortcut created |
| 2026-04-03 | End-to-end test passed: VBS→PS1→node hidden→server ready→Chrome kiosk→login page 200 |
| 2026-04-03 | Family Alert system verified complete: all 6 files, table in Supabase, wired into AppShell + WidgetManager |
| 2026-04-03 | Windows auto-login: not configured (requires user's password), instructions added to BUILD_STATE.md |
