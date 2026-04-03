'use client'

import { useMemo, useEffect } from 'react'
import { startOfDay, endOfDay, format, isToday } from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'
import { TimeGrid } from '@/components/TimeGrid'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'

export default function DayPage() {
  const { currentDate, setSelectedEvent, setDrawerOpen } = useCalendarContext()

  const dayStart = useMemo(() => startOfDay(currentDate), [currentDate])
  const dayEnd = useMemo(() => endOfDay(currentDate), [currentDate])
  const days = useMemo(() => [dayStart], [dayStart])

  const { events, isLoading } = useCalendarEvents({
    from: dayStart,
    to: dayEnd,
  })

  useEffect(() => {
    const el = document.getElementById('time-grid-scroll')
    if (el) {
      const now = new Date()
      el.scrollTop = Math.max(0, (now.getHours() - 1) * 60)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Day header */}
      <div className="flex items-center justify-center py-3 border-b border-slate-800 shrink-0">
        <div className={`text-center ${isToday(currentDate) ? 'text-blue-400' : 'text-slate-300'}`}>
          <div className="text-sm">{format(currentDate, 'EEEE')}</div>
          <div className={`text-2xl font-bold ${
            isToday(currentDate) ? 'bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto' : ''
          }`}>
            {format(currentDate, 'd')}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-2 text-xs text-slate-500">Loading...</div>
      )}

      <TimeGrid
        days={days}
        events={events}
        onEventClick={(ev) => {
          setSelectedEvent(ev)
          setDrawerOpen(true)
        }}
      />
    </div>
  )
}
