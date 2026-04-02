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
