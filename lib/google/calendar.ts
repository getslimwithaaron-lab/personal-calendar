// lib/google/calendar.ts
// Fetch, create, update, delete Google Calendar events

import { CalendarEvent } from '@/types'
import { refreshGoogleToken } from './token'

const BASE = 'https://www.googleapis.com/calendar/v3'

// ── Map a raw Google event object to our unified CalendarEvent ────────────────
export function mapGoogleEvent(
  raw: Record<string, unknown>,
  connectionId: string,
  color: string
): CalendarEvent {
  const start = raw.start as Record<string, string>
  const end   = raw.end   as Record<string, string>
  const allDay = Boolean(start?.date && !start?.dateTime)

  return {
    id:             raw.id as string,
    externalId:     raw.id as string,
    source:         'google',
    connectionId,
    title:          (raw.summary as string) ?? '(No title)',
    start:          new Date(start?.dateTime ?? start?.date ?? ''),
    end:            new Date(end?.dateTime   ?? end?.date   ?? ''),
    allDay,
    color,
    eventType:      'standard',
    notes:          (raw.description as string) ?? undefined,
    location:       ((raw.location as Record<string, string>)?.displayName
                     ?? raw.location as string) ?? undefined,
    recurrenceRule: Array.isArray(raw.recurrence)
                     ? (raw.recurrence as string[]).join('\n')
                     : undefined,
    timezone:       start?.timeZone ?? 'America/Denver',
  }
}

// ── List events for a date range ──────────────────────────────────────────────
export async function listGoogleEvents(
  accessToken: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date,
  connectionId: string,
  color: string
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin:      timeMin.toISOString(),
    timeMax:      timeMax.toISOString(),
    singleEvents: 'true',
    orderBy:      'startTime',
    maxResults:   '500',
  })

  const res = await fetch(`${BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Google list events failed: ${res.status}`)

  const data = await res.json() as { items?: Record<string, unknown>[] }
  return (data.items ?? []).map(e => mapGoogleEvent(e, connectionId, color))
}

// ── Create an event ───────────────────────────────────────────────────────────
export async function createGoogleEvent(
  accessToken: string,
  calendarId: string,
  event: {
    title: string
    start: Date
    end: Date
    allDay?: boolean
    notes?: string
    location?: string
    recurrenceRule?: string
    timezone?: string
  }
): Promise<string> {
  const tz = event.timezone ?? 'America/Denver'
  const body: Record<string, unknown> = {
    summary:     event.title,
    description: event.notes,
    location:    event.location,
    start: event.allDay
      ? { date: event.start.toISOString().split('T')[0] }
      : { dateTime: event.start.toISOString(), timeZone: tz },
    end: event.allDay
      ? { date: event.end.toISOString().split('T')[0] }
      : { dateTime: event.end.toISOString(), timeZone: tz },
  }
  if (event.recurrenceRule) {
    body.recurrence = event.recurrenceRule.split('\n').filter(Boolean)
  }

  const res = await fetch(`${BASE}/calendars/${encodeURIComponent(calendarId)}/events`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Google create event failed: ${res.status}`)
  const data = await res.json() as { id: string }
  return data.id
}

// ── Update an event ───────────────────────────────────────────────────────────
export async function updateGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  patch: {
    title?: string
    start?: Date
    end?: Date
    notes?: string
    location?: string
    timezone?: string
  }
): Promise<void> {
  const tz = patch.timezone ?? 'America/Denver'
  const body: Record<string, unknown> = {}
  if (patch.title)    body.summary     = patch.title
  if (patch.notes)    body.description = patch.notes
  if (patch.location) body.location    = patch.location
  if (patch.start)    body.start = { dateTime: patch.start.toISOString(), timeZone: tz }
  if (patch.end)      body.end   = { dateTime: patch.end.toISOString(),   timeZone: tz }

  const res = await fetch(
    `${BASE}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    }
  )
  if (!res.ok) throw new Error(`Google update event failed: ${res.status}`)
}

// ── Delete an event ───────────────────────────────────────────────────────────
export async function deleteGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string
): Promise<void> {
  const res = await fetch(
    `${BASE}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok && res.status !== 410) throw new Error(`Google delete event failed: ${res.status}`)
}

export { refreshGoogleToken }
