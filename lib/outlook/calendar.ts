// lib/outlook/calendar.ts
// Fetch, create, update, delete Outlook calendar events via Microsoft Graph

import { CalendarEvent } from '@/types'

const BASE = 'https://graph.microsoft.com/v1.0'

// Windows timezone name → IANA mapping
const WIN_TO_IANA: Record<string, string> = {
  'Mountain Standard Time': 'America/Denver',
  'Pacific Standard Time':  'America/Los_Angeles',
  'Central Standard Time':  'America/Chicago',
  'Eastern Standard Time':  'America/New_York',
  'UTC':                    'UTC',
}

function resolveTimezone(winTz: string | undefined): string {
  if (!winTz) return 'America/Denver'
  return WIN_TO_IANA[winTz] ?? winTz
}

// ── Map raw Graph event → unified CalendarEvent ───────────────────────────────
export function mapOutlookEvent(
  raw: Record<string, unknown>,
  connectionId: string,
  color: string
): CalendarEvent {
  const start    = raw.start    as Record<string, string> | undefined
  const end      = raw.end      as Record<string, string> | undefined
  const body     = raw.body     as Record<string, string> | undefined
  const loc      = raw.location as Record<string, string> | undefined
  const isAllDay = Boolean(raw.isAllDay)

  return {
    id:             raw.id as string,
    externalId:     raw.id as string,
    source:         'outlook',
    connectionId,
    title:          (raw.subject as string) ?? '(No title)',
    start:          new Date(start?.dateTime ?? ''),
    end:            new Date(end?.dateTime   ?? ''),
    allDay:         isAllDay,
    color,
    eventType:      'standard',
    notes:          body?.content   ?? undefined,
    location:       loc?.displayName ?? undefined,
    recurrenceRule: undefined,
    timezone:       resolveTimezone(start?.timeZone),
  }
}

// ── List events for a date range ──────────────────────────────────────────────
export async function listOutlookEvents(
  accessToken: string,
  timeMin: Date,
  timeMax: Date,
  connectionId: string,
  color: string
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    startDateTime: timeMin.toISOString(),
    endDateTime:   timeMax.toISOString(),
    $top:          '500',
    $select:       'id,subject,start,end,isAllDay,body,location,recurrence',
  })

  const res = await fetch(`${BASE}/me/calendarView?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'outlook.timezone="UTC"',
    },
  })
  if (!res.ok) throw new Error(`Outlook list events failed: ${res.status}`)
  const data = await res.json() as { value?: Record<string, unknown>[] }
  return (data.value ?? []).map(e => mapOutlookEvent(e, connectionId, color))
}

// ── Create an event ───────────────────────────────────────────────────────────
export async function createOutlookEvent(
  accessToken: string,
  event: {
    title: string; start: Date; end: Date
    allDay?: boolean; notes?: string; location?: string; timezone?: string
  }
): Promise<string> {
  const tz = event.timezone ?? 'America/Denver'
  const body: Record<string, unknown> = {
    subject:  event.title,
    isAllDay: event.allDay ?? false,
    start: { dateTime: event.start.toISOString(), timeZone: tz },
    end:   { dateTime: event.end.toISOString(),   timeZone: tz },
  }
  if (event.notes)    body.body     = { contentType: 'text', content: event.notes }
  if (event.location) body.location = { displayName: event.location }

  const res = await fetch(`${BASE}/me/events`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Outlook create event failed: ${res.status}`)
  const data = await res.json() as { id: string }
  return data.id
}

// ── Update an event ───────────────────────────────────────────────────────────
export async function updateOutlookEvent(
  accessToken: string,
  eventId: string,
  patch: {
    title?: string; start?: Date; end?: Date
    notes?: string; location?: string; timezone?: string
  }
): Promise<void> {
  const tz = patch.timezone ?? 'America/Denver'
  const body: Record<string, unknown> = {}
  if (patch.title)    body.subject  = patch.title
  if (patch.notes)    body.body     = { contentType: 'text', content: patch.notes }
  if (patch.location) body.location = { displayName: patch.location }
  if (patch.start)    body.start    = { dateTime: patch.start.toISOString(), timeZone: tz }
  if (patch.end)      body.end      = { dateTime: patch.end.toISOString(),   timeZone: tz }

  const res = await fetch(`${BASE}/me/events/${eventId}`, {
    method:  'PATCH',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Outlook update event failed: ${res.status}`)
}

// ── Delete an event ───────────────────────────────────────────────────────────
export async function deleteOutlookEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const res = await fetch(`${BASE}/me/events/${eventId}`, {
    method:  'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok && res.status !== 404) throw new Error(`Outlook delete event failed: ${res.status}`)
}
