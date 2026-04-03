// hooks/useOutlookCalendar.ts
// Client hook — fetch Outlook events across all active connections

'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent } from '@/types'

interface UseOutlookCalendarOptions {
  timeMin: Date
  timeMax: Date
  enabled?: boolean
}

interface UseOutlookCalendarResult {
  events: CalendarEvent[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useOutlookCalendar({
  timeMin,
  timeMax,
  enabled = true,
}: UseOutlookCalendarOptions): UseOutlookCalendarResult {
  const [events, setEvents]     = useState<CalendarEvent[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
      })
      const res = await fetch(`/api/calendars/outlook/events?${params}`)
      if (!res.ok) throw new Error(`Outlook fetch failed: ${res.status}`)
      const data = await res.json() as { events: CalendarEvent[] }
      setEvents(data.events)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      console.error('[useOutlookCalendar]', msg)
    } finally {
      setLoading(false)
    }
  }, [timeMin, timeMax, enabled])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  return { events, isLoading, error, refetch: fetchEvents }
}
