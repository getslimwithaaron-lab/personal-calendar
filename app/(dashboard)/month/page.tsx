'use client'

import { useMemo } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, format, isSameMonth, isToday, isSameDay,
} from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { CalendarEvent } from '@/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MonthPage() {
  const { currentDate, setCurrentDate, setSelectedEvent, setDrawerOpen } = useCalendarContext()

  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate])
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate])
  const gridStart = useMemo(() => startOfWeek(monthStart, { weekStartsOn: 0 }), [monthStart])
  const gridEnd = useMemo(() => endOfWeek(monthEnd, { weekStartsOn: 0 }), [monthEnd])

  const { events } = useCalendarEvents({ from: gridStart, to: gridEnd })

  // Build weeks array
  const weeks = useMemo(() => {
    const result: Date[][] = []
    let day = gridStart
    while (day <= gridEnd) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(day)
        day = addDays(day, 1)
      }
      result.push(week)
    }
    return result
  }, [gridStart, gridEnd])

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const ev of events) {
      const key = format(new Date(ev.start), 'yyyy-MM-dd')
      const list = map.get(key) ?? []
      list.push(ev)
      map.set(key, list)
    }
    return map
  }, [events])

  return (
    <div className="flex flex-col h-full p-2">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs text-slate-500 py-1">{d}</div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="flex-1 grid grid-rows-auto gap-px">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-px flex-1">
            {week.map(day => {
              const key = format(day, 'yyyy-MM-dd')
              const dayEvents = eventsByDate.get(key) ?? []
              const inMonth = isSameMonth(day, currentDate)
              const today = isToday(day)

              return (
                <button
                  key={key}
                  onClick={() => setCurrentDate(day)}
                  className={`
                    relative flex flex-col p-1 rounded-lg text-left min-h-[70px] transition-colors
                    ${inMonth ? 'bg-slate-900/50' : 'bg-slate-900/20'}
                    ${today ? 'ring-1 ring-blue-500' : ''}
                    hover:bg-slate-800/50
                  `}
                >
                  <span className={`text-xs font-medium ${
                    today ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center' :
                    inMonth ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {format(day, 'd')}
                  </span>

                  {/* Event dots / previews */}
                  <div className="flex flex-col gap-0.5 mt-1 overflow-hidden flex-1">
                    {dayEvents.slice(0, 3).map(ev => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(ev)
                          setDrawerOpen(true)
                        }}
                        className="text-[10px] leading-tight truncate rounded px-1 cursor-pointer"
                        style={{ backgroundColor: ev.color + '22', color: ev.color }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] text-slate-500">+{dayEvents.length - 3} more</span>
                    )}
                  </div>

                  {/* Dot indicators for collapsed view */}
                  {dayEvents.length > 0 && dayEvents.length <= 3 && (
                    <div className="flex gap-0.5 mt-auto pt-0.5 md:hidden">
                      {dayEvents.slice(0, 4).map(ev => (
                        <div
                          key={ev.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: ev.color }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
