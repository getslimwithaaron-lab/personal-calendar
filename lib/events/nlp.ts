// lib/events/nlp.ts
// Natural language parsing for quick event creation

import * as chrono from 'chrono-node'
import { addHours } from 'date-fns'

export interface ParsedEvent {
  title: string
  start: Date
  end: Date
  allDay: boolean
}

export function parseNaturalEvent(input: string, referenceDate?: Date): ParsedEvent | null {
  const ref = referenceDate ?? new Date()
  const results = chrono.parse(input, ref, { forwardDate: true })

  if (results.length === 0) return null

  const parsed = results[0]!
  const start = parsed.start.date()

  // Extract title by removing the date/time text from input
  let title = input
  if (parsed.text) {
    title = input.replace(parsed.text, '').trim()
  }
  // Clean up common prepositions left behind
  title = title.replace(/^(at|on|from|for|in)\s+/i, '').trim()
  title = title.replace(/\s+(at|on|from|for|in)$/i, '').trim()

  if (!title) title = 'New Event'

  // Determine end time
  let end: Date
  let allDay = false

  if (parsed.end) {
    end = parsed.end.date()
  } else if (!parsed.start.isCertain('hour')) {
    // No specific time mentioned — treat as all-day
    allDay = true
    end = start
  } else {
    // Default to 1 hour duration
    end = addHours(start, 1)
  }

  return { title, start, end, allDay }
}
