'use client'

import { useMemo } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, format, isSameMonth, isToday, isSameDay,
} from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function MiniCalendarWidget() {
  const { currentDate, setCurrentDate } = useCalendarContext()

  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate])
  const gridStart = useMemo(() => startOfWeek(monthStart, { weekStartsOn: 0 }), [monthStart])
  const gridEnd = useMemo(() => endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }), [currentDate])

  const allDays = useMemo(() => {
    const days: Date[] = []
    let d = gridStart
    while (d <= gridEnd) {
      days.push(d)
      d = addDays(d, 1)
    }
    return days
  }, [gridStart, gridEnd])

  return (
    <div className="flex flex-col h-full">
      {/* Month header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 shrink-0">
        <h3 className="text-sm font-semibold text-slate-300">{format(currentDate, 'MMMM yyyy')}</h3>
      </div>

      <div className="flex-1 flex flex-col p-2">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DOW.map((d, i) => (
            <div key={i} className="text-center text-[10px] text-slate-600 font-medium py-0.5">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 flex-1">
          {allDays.map(day => {
            const inMonth = isSameMonth(day, currentDate)
            const today = isToday(day)
            const selected = isSameDay(day, currentDate)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setCurrentDate(day)}
                className={`
                  flex items-center justify-center text-[11px] rounded-full aspect-square
                  min-h-[28px] min-w-[28px] transition-colors
                  ${today ? 'bg-blue-600 text-white font-bold' : ''}
                  ${selected && !today ? 'ring-1 ring-blue-400 text-blue-400' : ''}
                  ${!today && !selected && inMonth ? 'text-slate-300 hover:bg-slate-800' : ''}
                  ${!inMonth ? 'text-slate-700' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
