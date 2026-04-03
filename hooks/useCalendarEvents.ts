// hooks/useCalendarEvents.ts
// Unified hook — merges Google + Outlook events into one sorted array

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { CalendarEvent } from '@/types'
import { mergeEvents } from '@/lib/events/merge'

interface UseCalendarEventsOptions {
  from: Date
  to: Date
  googleConnectionIds?: string[]
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
  googleConnectionIds = [],
  enabled = true,
}: UseCalendarEventsOptions): UseCalendarEventsResult {
  const [googleEvents, setGoogleEvents]   = useState<CalendarEvent[]>([])
  const [outlookEvents, setOutlookEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading]             = useState({ google: false, outlook: false })
  const [errors, setErrors]               = useState<string[]>([])

  // ── Fetch Google events (per-connection) ─────────────────────────────
  const fetchGoogle = useCallback(async () => {
    if (!enabled || googleConnectionIds.length === 0) {
      setGoogleEvents([])
      return
    }
    setLoading(prev => ({ ...prev, google: true }))
    try {
      const results = await Promise.allSettled(
        googleConnectionIds.map(async (id) => {
          const params = new URLSearchParams({
            connectionId: id,
            from: from.toISOString(),
            to: to.toISOString(),
          })
          const res = await fetch(`/api/calendars/google/events?${params}`)
          if (!res.ok) throw new Error(`Google connection ${id}: ${res.status}`)
          const data = await res.json() as { events: CalendarEvent[] }
          return data.events.map(e => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        }),
      )
      const fulfilled = results
        .filter((r): r is PromiseFulfilledResult<CalendarEvent[]> => r.status === 'fulfilled')
        .flatMap(r => r.value)
      const rejected = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => String(r.reason))
      setGoogleEvents(fulfilled)
      if (rejected.length) setErrors(prev => [...prev, ...rejected])
    } catch {
      setErrors(prev => [...prev, 'Google fetch failed'])
    } finally {
      setLoading(prev => ({ ...prev, google: false }))
    }
  }, [googleConnectionIds.join(','), from.toISOString(), to.toISOString(), enabled])

  // ── Fetch Outlook events (batch all connections server-side) ─────────
  const fetchOutlook = useCallback(async () => {
    if (!enabled) {
      setOutlookEvents([])
      return
    }
    setLoading(prev => ({ ...prev, outlook: true }))
    try {
      const params = new URLSearchParams({
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
      })
      const res = await fetch(`/api/calendars/outlook/events?${params}`)
      if (!res.ok) throw new Error(`Outlook fetch failed: ${res.status}`)
      const data = await res.json() as { events: CalendarEvent[] }
      setOutlookEvents(
        data.events.map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) })),
      )
    } catch {
      setErrors(prev => [...prev, 'Outlook fetch failed'])
    } finally {
      setLoading(prev => ({ ...prev, outlook: false }))
    }
  }, [from.toISOString(), to.toISOString(), enabled])

  // ── Trigger both fetches ─────────────────────────────────────────────
  const refetch = useCallback(() => {
    setErrors([])
    fetchGoogle()
    fetchOutlook()
  }, [fetchGoogle, fetchOutlook])

  useEffect(() => { refetch() }, [refetch])

  // ── Merge into one sorted, deduplicated array ────────────────────────
  const events = useMemo(
    () => mergeEvents(googleEvents, outlookEvents),
    [googleEvents, outlookEvents],
  )

  const isLoading = loading.google || loading.outlook

  return { events, isLoading, errors, refetch }
}
