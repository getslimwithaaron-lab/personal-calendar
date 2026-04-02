// hooks/useGoogleCalendar.ts
// Client-side hook — fetches events from all active Google connections

'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent } from '@/types'

interface UseGoogleCalendarOptions {
  connectionIds: string[]
  from: Date
  to: Date
  enabled?: boolean
}

export function useGoogleCalendar({ connectionIds, from, to, enabled = true }: UseGoogleCalendarOptions) {
  const [events, setEvents]     = useState<CalendarEvent[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    if (!enabled || connectionIds.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled(
        connectionIds.map(async (id) => {
          const params = new URLSearchParams({
            connectionId: id,
            from: from.toISOString(),
            to:   to.toISOString(),
          })
          const res = await fetch(`/api/calendars/google/events?${params}`)
          if (!res.ok) throw new Error(`Failed for connection ${id}`)
          const data = await res.json() as { events: CalendarEvent[] }
          return data.events.map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
        })
      )
      const allEvents = results
        .filter((r): r is PromiseFulfilledResult<CalendarEvent[]> => r.status === 'fulfilled')
        .flatMap(r => r.value)
      setEvents(allEvents)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [connectionIds.join(','), from.toISOString(), to.toISOString(), enabled])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { events, isLoading, error, refetch: fetchAll }
}
