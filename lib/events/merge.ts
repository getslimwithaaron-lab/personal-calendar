// lib/events/merge.ts
// Merge, deduplicate, and sort CalendarEvent arrays from multiple providers

import { CalendarEvent } from '@/types'

// Sort events by start time, then by all-day (all-day first)
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.slice().sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1
    return a.start.getTime() - b.start.getTime()
  })
}

// Deduplicate events that may appear in multiple connections
// Uses externalId + source as the unique key
export function deduplicateEvents(events: CalendarEvent[]): CalendarEvent[] {
  const seen = new Map<string, CalendarEvent>()
  for (const event of events) {
    const key = `${event.source}:${event.externalId}`
    if (!seen.has(key)) {
      seen.set(key, event)
    }
  }
  return Array.from(seen.values())
}

// Merge multiple CalendarEvent arrays into one sorted, deduplicated list
export function mergeEvents(...arrays: CalendarEvent[][]): CalendarEvent[] {
  const combined = arrays.flat()
  const unique = deduplicateEvents(combined)
  return sortEvents(unique)
}

// Filter events by date range (inclusive)
export function filterByRange(
  events: CalendarEvent[],
  from: Date,
  to: Date,
): CalendarEvent[] {
  return events.filter(e => e.end >= from && e.start <= to)
}

// Filter events by source provider
export function filterBySource(
  events: CalendarEvent[],
  source: CalendarEvent['source'],
): CalendarEvent[] {
  return events.filter(e => e.source === source)
}

// Group events by date key (YYYY-MM-DD) — useful for agenda view
export function groupByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const groups = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = event.start.toISOString().slice(0, 10)
    const list = groups.get(key) ?? []
    list.push(event)
    groups.set(key, list)
  }
  return groups
}
