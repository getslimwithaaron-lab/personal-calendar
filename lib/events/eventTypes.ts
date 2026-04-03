// lib/events/eventTypes.ts
// Styling and utilities for event types (standard, focus, blocked)

import { EventType } from '@/types'

interface EventTypeStyle {
  label: string
  bgClass: string
  borderColor: string
  icon: string
}

export const EVENT_TYPE_STYLES: Record<EventType, EventTypeStyle> = {
  standard: {
    label: 'Standard',
    bgClass: 'bg-opacity-20',
    borderColor: 'currentColor',
    icon: '',
  },
  focus: {
    label: 'Focus Time',
    bgClass: 'bg-purple-500/20',
    borderColor: '#a855f7',
    icon: '\uD83C\uDFAF',
  },
  blocked: {
    label: 'Blocked',
    bgClass: 'bg-slate-500/20',
    borderColor: '#64748b',
    icon: '\uD83D\uDEAB',
  },
}

export function getEventTypeStyle(type: EventType): EventTypeStyle {
  return EVENT_TYPE_STYLES[type] ?? EVENT_TYPE_STYLES.standard
}
