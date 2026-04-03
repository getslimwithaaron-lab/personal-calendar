'use client'

import { useMemo } from 'react'
import { format, isSameDay, isToday, differenceInMinutes, startOfDay } from 'date-fns'
import { CalendarEvent } from '@/types'

const HOUR_HEIGHT = 60 // px per hour
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface TimeGridProps {
  days: Date[]
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onSlotClick?: (date: Date, hour: number) => void
}

export function TimeGrid({ days, events, onEventClick, onSlotClick }: TimeGridProps) {
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      map.set(key, events.filter(e => !e.allDay && isSameDay(new Date(e.start), day)))
    }
    return map
  }, [days, events])

  const allDayEvents = useMemo(
    () => events.filter(e => e.allDay),
    [events],
  )

  return (
    <div className="flex flex-col h-full">
      {/* All-day row */}
      {allDayEvents.length > 0 && (
        <div className="flex border-b border-slate-800 shrink-0">
          <div className="w-14 shrink-0" />
          <div className="flex flex-1">
            {days.map(day => {
              const key = format(day, 'yyyy-MM-dd')
              const dayAllDay = allDayEvents.filter(e => isSameDay(new Date(e.start), day))
              return (
                <div key={key} className="flex-1 min-w-0 px-0.5 py-1 border-l border-slate-800 first:border-l-0">
                  {dayAllDay.map(ev => (
                    <button
                      key={ev.id}
                      onClick={() => onEventClick?.(ev)}
                      className="block w-full text-left text-xs px-1.5 py-0.5 rounded truncate mb-0.5 min-h-[24px]"
                      style={{ backgroundColor: ev.color + '33', color: ev.color }}
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto scroll-container" id="time-grid-scroll">
        <div className="flex relative" style={{ height: 24 * HOUR_HEIGHT }}>
          {/* Hour labels */}
          <div className="w-14 shrink-0 relative">
            {HOURS.map(h => (
              <div
                key={h}
                className="absolute left-0 right-0 text-xs text-slate-500 text-right pr-2"
                style={{ top: h * HOUR_HEIGHT - 6 }}
              >
                {h === 0 ? '' : format(new Date(2000, 0, 1, h), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex flex-1 relative">
            {days.map(day => {
              const key = format(day, 'yyyy-MM-dd')
              const dayEvents = eventsByDay.get(key) ?? []
              return (
                <div key={key} className="flex-1 min-w-0 relative border-l border-slate-800/50 first:border-l-0">
                  {/* Hour lines */}
                  {HOURS.map(h => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-slate-800/30 cursor-pointer"
                      style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                      onClick={() => onSlotClick?.(day, h)}
                    />
                  ))}

                  {/* Now line */}
                  {isToday(day) && <NowLine />}

                  {/* Events */}
                  {dayEvents.map(ev => (
                    <EventBlock key={ev.id} event={ev} day={day} onClick={() => onEventClick?.(ev)} />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function EventBlock({ event, day, onClick }: { event: CalendarEvent; day: Date; onClick: () => void }) {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const dayStart = startOfDay(day)
  const topMin = Math.max(0, differenceInMinutes(start, dayStart))
  const durationMin = Math.max(15, differenceInMinutes(end, start))

  const top = (topMin / 60) * HOUR_HEIGHT
  const height = Math.max(16, (durationMin / 60) * HOUR_HEIGHT)

  return (
    <button
      onClick={onClick}
      className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-xs overflow-hidden cursor-pointer z-10 text-left"
      style={{
        top,
        height,
        backgroundColor: event.color + '33',
        borderLeft: `3px solid ${event.color}`,
        color: event.color,
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {height > 30 && (
        <div className="text-[10px] opacity-70">
          {format(start, 'h:mm a')}
        </div>
      )}
    </button>
  )
}

function NowLine() {
  const now = new Date()
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
  const top = (minutesSinceMidnight / 60) * HOUR_HEIGHT

  return (
    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top }}>
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
        <div className="flex-1 h-px bg-red-500" />
      </div>
    </div>
  )
}
