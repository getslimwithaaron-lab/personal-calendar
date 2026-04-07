# Build State — FamilyCal (Personal Calendar App)

## How To Use This File
- READ THIS FIRST at the start of every session
- UPDATE THIS at the end of every session
- This is the single source of truth for build progress
- .env.local is NOT in git — credentials are listed below for handoff
- A Google Doc mirror lives at: https://docs.google.com/document/d/1eGLkfWTaU7MMvu6-fxu0sAUGz2lSXsqE2nGBbOOWd4c/edit
- **Keep BUILD_STATE.md and the Google Doc in sync — update both every time**

## Current Status
PHASE: Phase 25 — QA + bugfixes (OAuth fixed, UI redesigned, invite fixed, landing page premium)
LAST SESSION: 2026-04-06
NEXT ACTION: Switch Stripe to live keys, test Stripe checkout with logged-in user, Google verification (needs privacy policy + terms pages)

## Virgo Industries Architecture Rule
**Each Virgo Industries product MUST stay in a separate codebase and separate database.**
- FamilyCal = personal-calendar repo + Supabase project mivtjdbjztnvtjixhwmh
- DTC sites = separate repos + separate databases
- Studio platform = planned as a separate build with its own repo and database
- Never mix product data or codebases across projects

## What Is Working
- All 24 build phases are code-complete and TypeScript-clean
- `npm run build` succeeds with zero errors
- Code is merged to `main` and pushed to GitHub (repo is PUBLIC)
- Deployed to Vercel at https://personal-calendar-gules.vercel.app
- Supabase Phase 24 migration applied (users columns + invites table)
- Google OAuth configured (test mode — getslimwithaaron@gmail.com)
- Google OAuth redirect URI added for both localhost AND Vercel URL
- Azure OAuth configured (open to all Microsoft accounts)
- Azure OAuth redirect URI added for both localhost AND Vercel URL
- Self-service signup page at /signup with email/password + Google/Microsoft OAuth
- Credentials auth provider (bcryptjs password hashing)
- Family member invite system (owner invites 1 member by email, accept page at /invite/[token])
- Stripe billing integration wired ($4.99/mo or $39/yr, webhook handler)
- 3-step onboarding wizard at /onboarding
- PWA install prompt banner on all pages
- Admin dashboard at /admin (restricted to getslimwithaaron@gmail.com)
- 14 floating widgets: Grocery, Meal Planner, Chore Chart, Contacts, Countdown, Expense, Birthday, Recipe Box, Notes, To-Do, Weather, Mini Calendar, Alert History, and a base FloatingWidget component
- Widget manager + widget panel for drag/position/resize
- Family alert system (send alerts, overlay display, alert history)
- QuickAdd (NLP event creation) wired into AppShell
- TaskSidebar wired into AppShell
- Exit fullscreen button on settings page + Alt+F4 keyboard shortcut
- Launch scripts for kiosk mode (launch-calendar.bat, .ps1, .vbs)
- Startup automation: launch-calendar.vbs runs on Windows startup via Task Scheduler
- App designed for 42" portrait touch screen
- Domain: avirgoindustries.com (Namecheap — active, DNS configured)

## What Has NOT Been Tested Yet
- Nobody has signed in with Google or Microsoft on Vercel yet — OAuth flows untested live
- No real calendar events have been fetched — API integration untested against live data
- Signup flow untested end-to-end (needs Supabase migration — DONE, but flow not tested)
- Stripe payments untested (no Stripe account/keys configured yet)
- PWA install not tested on real mobile device
- Supabase Realtime subscriptions untested with live data

---

## Phase Completion Tracker

| # | Phase | Status |
|---|-------|--------|
| 1 | Scaffold (Next.js, Supabase, GitHub, Vercel) | Done |
| 2 | Auth + user (Supabase Auth, NextAuth, protected routes) | Done |
| 3 | Google Calendar OAuth + read/write | Done |
| 4 | Outlook OAuth + Microsoft Graph read/write | Done |
| 5 | Event merge layer (normalize Google + Outlook) | Done |
| 6 | Supabase Realtime push sync | Done |
| 7 | App shell + layout (sidebar, topbar, nav, theme) | Done |
| 8 | Week view (7-col grid, swipe, split-column mode) | Done |
| 9 | Day view (hour timeline, now bar, auto-scroll) | Done |
| 10 | Month view (grid, dot indicators, tap to jump) | Done |
| 11 | Agenda view (scrollable list, date headers) | Done |
| 12 | Drag to reschedule | Done |
| 13 | Natural language event creation (chrono-node) | Done |
| 14 | Event detail drawer (Framer Motion, edit, delete) | Done |
| 15 | Event templates (save, quick-create, manage) | Done |
| 16 | Ideal week frames (background layer, settings) | Done |
| 17 | Task sidebar (add, drag to timebox) | Done |
| 18 | Weather inline (Open-Meteo, cache, day cell display) | Done |
| 19 | Focus + blocked event types | Done |
| 20 | Settings panel (theme, hours, colors, exit fullscreen) | Done |
| 21 | Touch optimization pass (64px targets, scroll) | Done |
| 22 | Progressive Web App (manifest, service worker) | Done |
| 23 | QA + polish | Not started — Aaron tests |
| 24 | Shareable product (landing, signup, billing, invites, onboarding, admin, PWA prompt) | Done (code) — needs Stripe keys + domain |

### Widgets Built (14 total)
| Widget | API Route | Component |
|--------|-----------|-----------|
| Grocery List | /api/grocery | GroceryWidget.tsx |
| Meal Planner | /api/meals | MealPlannerWidget.tsx |
| Chore Chart | /api/chores | ChoreChartWidget.tsx |
| Contacts | /api/contacts | ContactsWidget.tsx |
| Countdown | /api/countdowns | CountdownWidget.tsx |
| Expense Tracker | /api/expenses | ExpenseWidget.tsx |
| Birthday Tracker | /api/birthdays | BirthdayWidget.tsx |
| Recipe Box | /api/recipes | RecipeBoxWidget.tsx |
| Notes | /api/notes | NotesWidget.tsx |
| To-Do | /api/tasks | ToDoWidget.tsx |
| Weather | /api/weather | WeatherWidget.tsx |
| Mini Calendar | (client-only) | MiniCalendarWidget.tsx |
| Alert History | /api/alerts | AlertHistoryWidget.tsx |
| Floating Base | (wrapper) | FloatingWidget.tsx |

### Family Alert System
- Send alerts from /alert page
- AlertOverlay component shows alerts on top of everything
- Alert API at /api/alerts
- Supabase table: family_alerts (with RLS)

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
STRIPE_SECRET_KEY=(see COWORK_SESSION_CONTEXT.md in Google Drive — sandbox key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=(see COWORK_SESSION_CONTEXT.md in Google Drive — sandbox key)
STRIPE_WEBHOOK_SECRET=(set in Vercel — see Google Doc for value)
STRIPE_PRICE_MONTHLY=price_1TJ5ivFm59Mf34ouBQbBG9rq
STRIPE_PRICE_YEARLY=price_1TJ5ixFm59Mf34ouxW8kyPpH
EMAILOCTOPUS_API_KEY=(set in Vercel — see Google Doc for value)
EMAILOCTOPUS_LIST_ID=5d2d38b0-3177-11f1-ba01-d75c2ed7b89d
```

### Stripe
- Dashboard: https://dashboard.stripe.com
- Login: Google — getslimwithaaron@gmail.com
- Stripe Account: Virgo Industries (shared across all Virgo Industries apps)
- Mode: Sandbox (test keys configured and working)
- Products created: Family Calendar Monthly ($4.99/mo), Family Calendar Annual ($39/yr)
- Price IDs: price_1TJ5ivFm59Mf34ouBQbBG9rq (monthly), price_1TJ5ixFm59Mf34ouxW8kyPpH (yearly)
- 14-day free trial configured in checkout
- Webhook endpoint: https://personal-calendar-gules.vercel.app/api/billing/webhook
- Webhook secret: (set in Vercel — see Google Doc)
- Status: Sandbox keys configured, products created, webhook active, signup tested — switch to live keys when ready

### EmailOctopus
- Website: emailoctopus.com
- Login: getslimwithaaron@gmail.com
- Password: AvirgoDTCP420!
- Plan: Free — 3 form limit, 2500 subscribers max
- List: "Family Calendar App" (ID: 5d2d38b0-3177-11f1-ba01-d75c2ed7b89d)
- API Key: (set in Vercel — name: FamilyCalApp, see Google Doc for value)
- Status: Integrated — signup adds users to list, invite adds invitees to list

### Namecheap
- Website: namecheap.com
- Username: AvirgoDTC1
- Password: AvirgoDTCP0420!
- Email: getslimwithaaron@gmail.com
- Domains: avirgoindustries.com (ACTIVE, connected to Vercel), plus 21 exact-match domains
- Status: Domains active, DNS configured, avirgoindustries.com connected to Vercel

### Vercel Environment Variables (Production)
All env vars are set in Vercel including:
- NEXTAUTH_URL = https://www.avirgoindustries.com (must use www — site redirects to www)
- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET set correctly (2026-04-06)
- Google OAuth redirect URIs: localhost, vercel app, avirgoindustries.com, AND www.avirgoindustries.com
- Google OAuth LOGIN CONFIRMED WORKING (2026-04-06)
- Stripe keys (test mode), webhook secret, price IDs
- EmailOctopus API key and list ID
- All Supabase, Google, Azure credentials

### Google Cloud Console
- Console URL: https://console.cloud.google.com/apis/credentials?project=personal-calendar-app-492105
- Project name: Personal Calendar App
- Project ID: personal-calendar-app-492105
- OAuth Client ID: 650675069252-7mk633cnopcjuclf68222l2hcb4dt6rp.apps.googleusercontent.com
- OAuth Client Secret: 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
- Redirect URIs: http://localhost:3000/api/auth/callback/google AND https://personal-calendar-gules.vercel.app/api/auth/callback/google AND https://avirgoindustries.com/api/auth/callback/google (NEEDS TO BE ADDED MANUALLY IN GOOGLE CLOUD CONSOLE)
- Google Calendar API: Enabled
- Publishing status: Testing (only test users can sign in)
- Test users: getslimwithaaron@gmail.com
- To add more test users: Console > Google Auth Platform > Audience > + Add users

### Azure Portal (Microsoft Entra ID)
- Portal URL: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/5196fb4b-61fc-4c53-b839-bc135ac30f60
- App name: Personal Calendar App
- Application (client) ID: 5196fb4b-61fc-4c53-b839-bc135ac30f60
- Directory (tenant) ID: 9e71d637-c1ec-4456-b22a-ac1bdb328c77
- Client secret value: kuS8Q~EBuXd.ZwGvfZbHncB4zMgbBOVOCXPUhdhb
- Client secret expiry: 4/1/2028
- Supported account types: Any Entra ID Tenant + Personal Microsoft accounts
- Redirect URIs: http://localhost:3000/api/auth/callback/azure-ad AND https://personal-calendar-gules.vercel.app/api/auth/callback/azure-ad
- API permissions: Calendars.ReadWrite, offline_access, User.Read

### Supabase
- Dashboard URL: https://supabase.com/dashboard/project/mivtjdbjztnvtjixhwmh
- Project ref: mivtjdbjztnvtjixhwmh
- DB password: CalApp2026!xK9#mPqR
- Tables (10): users, calendar_connections, calendar_sets, local_events, event_templates, tasks, ideal_week_frames, app_settings, family_alerts, invites
- Phase 24 migration applied: password_hash, role, family_id, subscription_status, trial_ends_at, stripe_customer_id, stripe_subscription_id columns on users; invites table created
- RLS: enabled on all tables

### GitHub
- Repo: https://github.com/getslimwithaaron-lab/personal-calendar (PUBLIC)
- Branch: main (all code merged and pushed)

### Vercel
- Project URL: https://personal-calendar-gules.vercel.app
- Dashboard: https://vercel.com/getslimwithaaron-1303s-projects/personal-calendar
- Plan: Hobby (free)
- Connected to GitHub repo (auto-deploys on push to main)

---

## Tech Stack
- **Framework**: Next.js 16.2.2, React 19.2.4
- **Auth**: NextAuth 5.0.0-beta.30 (JWT strategy, Google + Microsoft + Credentials providers)
- **Styling**: Tailwind CSS 4 (via @tailwindcss/postcss)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Calendar APIs**: Google Calendar API v3, Microsoft Graph v1.0
- **Payments**: Stripe (billing API + webhook handler built, not yet configured)
- **Password Hashing**: bcryptjs
- **Date/Time**: date-fns 4.1.0, date-fns-tz 3.2.0
- **NLP**: chrono-node 2.9.0
- **Animation**: framer-motion 12.38.0
- **Gestures**: @use-gesture/react 10.3.1
- **Weather**: Open-Meteo (free, no API key needed)

## Project File Structure (key files)
```
C:\Users\unici\Desktop\personal-calendar\
├── app/
│   ├── layout.tsx                    # Root layout (Geist font, SessionProvider, PWA prompt)
│   ├── page.tsx                      # Landing page (client, redirects to /week if logged in)
│   ├── globals.css                   # Tailwind + touch optimization + portrait display
│   ├── login/page.tsx                # Google + Microsoft sign-in buttons
│   ├── signup/page.tsx               # Self-service signup (email/password + OAuth)
│   ├── onboarding/page.tsx           # 3-step wizard (calendar, invite, done)
│   ├── admin/page.tsx                # Admin dashboard (Aaron only)
│   ├── alert/page.tsx                # Send family alerts
│   ├── invite/[token]/page.tsx       # Accept family invite
│   ├── settings/
│   │   ├── layout.tsx                # Auth gate + AppShell wrapper
│   │   └── page.tsx                  # Theme, hours, toggles, sign out, exit fullscreen
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Auth gate + AppShell wrapper
│   │   ├── week/page.tsx             # 7-col time grid
│   │   ├── day/page.tsx              # Single-col time grid
│   │   ├── month/page.tsx            # Calendar grid with event previews
│   │   └── agenda/page.tsx           # 30-day scrollable event list
│   └── api/
│       ├── auth/[...nextauth]/       # NextAuth route handler
│       ├── signup/route.ts           # Self-service signup
│       ├── invite/route.ts           # Send invite
│       ├── invite/accept/route.ts    # Accept invite
│       ├── billing/route.ts          # Stripe checkout + subscription status
│       ├── billing/webhook/route.ts  # Stripe webhook handler
│       ├── admin/route.ts            # Admin stats (Aaron only)
│       ├── events/route.ts           # Unified merged events
│       ├── calendars/google/         # connect, disconnect, events
│       ├── calendars/outlook/        # connect, disconnect, events
│       ├── alerts/route.ts           # Family alerts CRUD
│       ├── grocery/route.ts          # Grocery list CRUD
│       ├── meals/route.ts            # Meal planner CRUD
│       ├── chores/route.ts           # Chore chart CRUD
│       ├── contacts/route.ts         # Contacts CRUD
│       ├── countdowns/route.ts       # Countdown CRUD
│       ├── expenses/route.ts         # Expense tracker CRUD
│       ├── birthdays/route.ts        # Birthday tracker CRUD
│       ├── recipes/route.ts          # Recipe box CRUD
│       ├── notes/route.ts            # Notes CRUD
│       ├── tasks/route.ts            # Tasks CRUD
│       ├── templates/route.ts        # Event templates CRUD
│       ├── ideal-week/route.ts       # Ideal week CRUD
│       ├── settings/route.ts         # App settings GET + PATCH
│       ├── weather/route.ts          # Open-Meteo proxy
│       └── widget-layouts/route.ts   # Widget positions/sizes
├── components/
│   ├── AppShell.tsx                  # Main layout (sidebar, topbar, widgets, alerts)
│   ├── CalendarProvider.tsx          # React context for date state + selected event
│   ├── Sidebar.tsx                   # Nav links
│   ├── Topbar.tsx                    # Date display + prev/next/today
│   ├── TimeGrid.tsx                  # Shared hour grid for week + day
│   ├── EventDrawer.tsx               # Framer Motion slide panel
│   ├── DraggableEvent.tsx            # Pointer drag to reschedule
│   ├── QuickAdd.tsx                  # NLP event creation input
│   ├── TaskSidebar.tsx               # Task list with add/toggle/delete
│   ├── IdealWeekOverlay.tsx          # Background time block layer
│   ├── WidgetManager.tsx             # Widget rendering + layout manager
│   ├── WidgetPanel.tsx               # Widget selector panel
│   ├── AlertOverlay.tsx              # Family alert display overlay
│   ├── PWAInstallPrompt.tsx          # "Add to home screen" banner
│   ├── ServiceWorkerRegister.tsx     # SW registration
│   └── widgets/                     # 14 widget components (see table above)
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
│   ├── useAlerts.ts                  # Family alerts
│   ├── useNotes.ts                   # Notes CRUD
│   └── useWidgetData.ts              # Widget data fetcher
├── lib/
│   ├── auth.ts                       # NextAuth config (Google + Microsoft + Credentials)
│   ├── authCredentials.ts            # Credentials provider (bcrypt password check)
│   ├── google/calendar.ts            # Google Calendar CRUD
│   ├── google/token.ts               # Google token refresh
│   ├── outlook/calendar.ts           # Outlook Calendar CRUD
│   ├── outlook/token.ts              # Microsoft token refresh
│   ├── events/merge.ts               # Sort, deduplicate, filter, groupByDate
│   ├── events/nlp.ts                 # chrono-node NLP parser
│   ├── events/reschedule.ts          # Client-side reschedule helper
│   ├── events/eventTypes.ts          # Focus/blocked styling
│   ├── supabase/client.ts            # Browser Supabase client
│   ├── supabase/server.ts            # Server Supabase client
│   ├── supabase/admin.ts             # Admin Supabase client (service role)
│   └── supabase/realtime.ts          # Channel subscription helpers
├── middleware.ts                     # Passthrough (auth at layout level)
├── launch-calendar.bat              # Kiosk mode launcher (Windows)
├── launch-calendar.ps1              # Kiosk mode launcher (PowerShell)
├── launch-calendar.vbs              # Kiosk mode launcher (VBScript)
├── public/
│   ├── manifest.json                 # PWA manifest (portrait)
│   ├── sw.js                         # Service worker
│   └── icons/icon-192.svg            # App icon
└── supabase/migrations/
    ├── 20260401000000_initial_schema.sql       # 8 original tables
    ├── 20260403000000_notes_and_assignee.sql   # Notes + assignee columns
    ├── 20260403100000_widgets_full.sql         # Widget tables
    ├── 20260403200000_family_alerts.sql        # Family alerts table
    └── 20260403300000_phase24_schema.sql       # Users billing cols + invites table
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
1. Install Chrome, Node.js, Git on the second PC
2. `git clone https://github.com/getslimwithaaron-lab/personal-calendar.git C:\calendar`
3. Copy .env.local (full contents above) into C:\calendar\.env.local
4. `npm install && npm run build && npm run start`
5. Open localhost:3000 in Chrome, install as PWA, press F11 for fullscreen

## Known Issues / Blockers
- **Google OAuth redirect URIs**: All 4 added (localhost, vercel, avirgoindustries.com, www.avirgoindustries.com). Login working.
- **Google OAuth in Testing mode**: Only test users can sign in. To open to everyone, publish the app on the Audience page (may require Google verification).
- **Supabase migration DONE**: bg_color column added to widget_layouts, orphan account deleted.
- **Azure client secret expires 4/1/2028**.
- **Stripe in sandbox mode**: Products, prices, and webhook created. Signup tested. Need to switch to live keys when ready to accept real payments.
- **Custom domain**: avirgoindustries.com is connected to Vercel (confirmed in deploy aliases).
- **DraggableEvent not swapped in**: TimeGrid still uses simpler EventBlock.
- **IdealWeekOverlay not rendered**: Component exists but not integrated into week view.

## Architecture Rules (AGENTS.md)
- This is Next.js 16 — APIs and conventions may differ from training data
- Read relevant docs in `node_modules/next/dist/docs/` before writing code
- Heed deprecation notices (middleware is deprecated, use proxy)
- **Virgo Industries rule: Each product gets its own codebase and database. Never mix.**

## Future Plans
- **Studio Platform**: Planned as a completely separate build with its own repo and database (per Virgo Industries architecture rule). Not part of the FamilyCal codebase.

## Session Log
| Date | What was done |
|------|--------------|
| 2026-04-01 | Phases 1-2 complete — scaffold, auth, middleware, login, schema |
| 2026-04-02 | Phases 3-7 complete — Google/Outlook OAuth, merge layer, realtime, app shell |
| 2026-04-03 | Phases 8-22 complete — All views, drag, NLP, drawer, templates, tasks, weather, settings, touch, PWA |
| 2026-04-03 | Widgets built — 14 floating widgets with APIs, widget manager, widget panel |
| 2026-04-03 | Family alert system — alerts API, overlay, alert page |
| 2026-04-03 | Launch scripts — bat, ps1, vbs for kiosk mode |
| 2026-04-03 | Exit fullscreen button + Alt+F4 shortcut added to settings/AppShell |
| 2026-04-03 | Phase 24 planned in BUILD_STATE.md |
| 2026-04-03 | Phase 24 Step 1 — Deployed to Vercel, env vars set, OAuth redirect URIs updated |
| 2026-04-03 | Phase 24 Steps 2-8 — Landing page, signup, invites, Stripe billing, onboarding, PWA prompt, admin dashboard |
| 2026-04-03 | GitHub repo made public (required for Vercel Hobby plan deploys) |
| 2026-04-04 | Supabase Phase 24 migration applied — users columns + invites table confirmed |
| 2026-04-04 | BUILD_STATE.md comprehensively rewritten with all features, widgets, credentials |
| 2026-04-05 | BUILD_STATE.md updated with Stripe, domain, EmailOctopus, Namecheap, Virgo Industries architecture rule, studio platform plan |
| 2026-04-05 | Google Doc rewritten to match BUILD_STATE.md |
| 2026-04-06 | EmailOctopus integrated — created "Family Calendar App" list, new API key, lib/emailoctopus.ts, signup + invite routes wired |
| 2026-04-06 | Stripe sandbox configured — products created (Monthly $4.99, Annual $39), prices, webhook, test keys added to env + Vercel |
| 2026-04-06 | Billing route updated to use Stripe price IDs with 14-day free trial |
| 2026-04-06 | Signup flow tested end-to-end — API returns success, user created in Supabase |
| 2026-04-06 | All env vars added to Vercel (Stripe keys, webhook secret, price IDs, EmailOctopus API key + list ID) |
| 2026-04-06 | avirgoindustries.com confirmed connected to Vercel (visible in deploy aliases) |
| 2026-04-06 | Google OAuth fix: re-added GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to Vercel, updated NEXTAUTH_URL to https://avirgoindustries.com |
| 2026-04-06 | Invite auth fix: changed session.user.id to session.supabaseUserId in invite route (was causing Unauthorized errors) |
| 2026-04-06 | UI redesign: calendar is now a floating widget on a full-screen canvas alongside all other widgets. Desktop = free-floating, mobile = swipeable screens |
| 2026-04-06 | Widget color customization: 12-color palette picker in every widget header menu, saves per-widget per-user to Supabase |
| 2026-04-06 | Landing page redesigned: premium dark theme, "Your family. One screen." headline, app mockup, feature cards, pricing with "Best value" badge, Virgo Industries footer |
| 2026-04-06 | Sidebar removed from dashboard — replaced with in-widget view tabs (Week/Day/Month/Agenda) inside the Calendar widget |
| 2026-04-06 | Migration script at scripts/apply-migration.mjs — adds bg_color column + deletes orphan account (needs manual run) |
