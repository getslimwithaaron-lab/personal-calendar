// hooks/useCalendarEvents.ts
// Unified hook — fetches merged events from the server-side unified endpoint

'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent } from '@/types'

interface UseCalendarEventsOptions {
  from: Date
  to: Date
  enabled?: boolean
}

interface UseCalendarEventsResult {
  events: CalendarEvent[]
  isLoading: boolean
  errors: string[]
  refetch: () => void
}

export function useCalendarEvents({
  from,
  to,
  enabled = true,
}: UseCalendarEventsOptions): UseCalendarEventsResult {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const fetchEvents = useCallback(async () => {
    if (!enabled) {
      setEvents([])
      return
    }
    setLoading(true)
    setErrors([])
    try {
      const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
      })
      const res = await fetch(`/api/events?${params}`)
      if (!res.ok) {
        const errText = await res.text().catch(() => `Status ${res.status}`)
        setErrors([errText])
        return
      }
      const data = await res.json() as { events: CalendarEvent[] }
      setEvents(
        data.events.map(e => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        })),
      )
    } catch (err) {
      setErrors([String(err)])
    } finally {
      setLoading(false)
    }
  }, [from.toISOString(), to.toISOString(), enabled])

  const refetch = useCallback(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  return { events, isLoading, errors, refetch }
}
