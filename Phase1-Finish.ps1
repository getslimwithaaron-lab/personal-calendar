Set-Location "C:\Users\unici\Desktop\personal-calendar"

# 1. Fix nlp.ts
Set-Content -Encoding UTF8 "lib\utils\nlp.ts" @'
import * as chrono from 'chrono-node'
import { addMinutes } from 'date-fns'

export interface ParsedEvent {
  title: string
  start: Date
  end: Date
  isAllDay: boolean
}

export function parseNaturalLanguage(input: string): ParsedEvent | null {
  const parsed = chrono.parse(input, new Date(), { forwardDate: true })
  if (!parsed.length || !parsed[0]) return null
  const result = parsed[0]
  const start = result.start.date()
  const end = result.end?.date() ?? addMinutes(start, 60)
  const title = input.replace(result.text, '').replace(/\s+/g, ' ').trim()
  const isAllDay = !result.start.isCertain('hour') && !result.start.isCertain('minute')
  return { title: title || input, start, end, isAllDay }
}

export function detectRecurrence(input: string): string | null {
  const lower = input.toLowerCase()
  if (/every day|daily/.test(lower)) return 'FREQ=DAILY'
  if (/every monday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=MO'
  if (/every tuesday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=TU'
  if (/every wednesday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=WE'
  if (/every thursday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=TH'
  if (/every friday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=FR'
  if (/every saturday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=SA'
  if (/every sunday/.test(lower)) return 'FREQ=WEEKLY;BYDAY=SU'
  if (/every week|weekly/.test(lower)) return 'FREQ=WEEKLY'
  if (/every month|monthly/.test(lower)) return 'FREQ=MONTHLY'
  return null
}
'@
Write-Host "nlp.ts fixed"

# 2. Fix auth route
Set-Content -Encoding UTF8 "app\api\auth\[...nextauth]\route.ts" @'
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
'@
Write-Host "auth route fixed"

# 3. API stubs
Set-Content -Encoding UTF8 "app\api\events\route.ts" @'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ events: [] }) }
'@
Set-Content -Encoding UTF8 "app\api\weather\route.ts" @'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ data: null }) }
'@
Set-Content -Encoding UTF8 "app\api\tasks\route.ts" @'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ tasks: [] }) }
'@
Set-Content -Encoding UTF8 "app\api\calendars\google\route.ts" @'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ calendars: [] }) }
'@
Set-Content -Encoding UTF8 "app\api\calendars\outlook\route.ts" @'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ calendars: [] }) }
'@
Write-Host "API stubs written"

# 4. TypeScript check
Write-Host "Running TypeScript check..."
$tscOut = & npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "TypeScript: CLEAN"
} else {
  Write-Host "TypeScript errors found:"
  $tscOut | ForEach-Object { Write-Host "  $_" }
}

# 5. Git
if (-not (Test-Path ".git")) { git init; Write-Host "git init done" }
git add -A
git commit -m "Phase 1: scaffold Next.js 14, Supabase SSR, auth stubs, full folder structure"
Write-Host "Git commit done"

# 6. GitHub via gh CLI
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
  Write-Host "Creating GitHub repo..."
  gh repo create getslimwithaaron-lab/personal-calendar --private --source=. --remote=origin --push
  Write-Host "Pushed to GitHub"
} else {
  Write-Host "gh CLI not installed - will handle GitHub via browser"
}

Write-Host "DONE"
