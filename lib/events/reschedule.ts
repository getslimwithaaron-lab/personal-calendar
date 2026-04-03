// lib/events/reschedule.ts
// Client-side helper to reschedule an event via the correct provider API

import { CalendarEvent } from '@/types'

export async function rescheduleEvent(
  event: CalendarEvent,
  newStart: Date,
  newEnd: Date,
): Promise<boolean> {
  const provider = event.source
  if (provider === 'local') return false // local events not yet supported for drag

  const endpoint =
    provider === 'google'
      ? '/api/calendars/google/events'
      : '/api/calendars/outlook/events'

  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      connectionId: event.connectionId,
      eventId: event.externalId,
      updates: {
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
      },
    }),
  })

  return res.ok
}
