'use client'

import { useMemo, useEffect, useCallback } from 'react'
import { startOfWeek, endOfWeek, addDays, format, isToday, getDay } from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'
import { TimeGrid } from '@/components/TimeGrid'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { useSettings } from '@/hooks/useSettings'
import { useIdealWeek } from '@/hooks/useIdealWeek'
import { IdealWeekOverlay } from '@/components/IdealWeekOverlay'
import { rescheduleEvent } from '@/lib/events/reschedule'

export default function WeekPage() {
  const { currentDate, setSelectedEvent, setDrawerOpen } = useCalendarContext()

  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate])
  const weekEnd = useMemo(() => endOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate])
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const { events, isLoading, refetch } = useCalendarEvents({
    from: weekStart,
    to: weekEnd,
  })

  const { settings } = useSettings()
  const { frames } = useIdealWeek()

  const handleReschedule = useCallback(async (event: Parameters<typeof rescheduleEvent>[0], newStart: Date, newEnd: Date) => {
    const ok = await rescheduleEvent(event, newStart, newEnd)
    if (ok) refetch()
  }, [refetch])

  const renderDayBackground = useCallback((day: Date) => {
    if (!settings.showIdealWeek) return null
    return <IdealWeekOverlay frames={frames} dayOfWeek={getDay(day)} />
  }, [settings.showIdealWeek, frames])

  // Auto-scroll to current hour on mount
  useEffect(() => {
    const el = document.getElementById('time-grid-scroll')
    if (el) {
      const now = new Date()
      const scrollTo = Math.max(0, (now.getHours() - 1) * 60)
      el.scrollTop = scrollTo
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="flex border-b border-slate-800 shrink-0">
        <div className="w-14 shrink-0" />
        <div className="flex flex-1">
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`flex-1 min-w-0 text-center py-2 border-l border-slate-800/50 first:border-l-0 ${
                isToday(day) ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <div className="text-xs uppercase">{format(day, 'EEE')}</div>
              <div className={`text-lg font-semibold ${
                isToday(day) ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-2 text-xs text-slate-500">Loading events...</div>
      )}

      {/* Time grid */}
      <TimeGrid
        days={days}
        events={events}
        onEventClick={(ev) => {
          setSelectedEvent(ev)
          setDrawerOpen(true)
        }}
        onReschedule={handleReschedule}
        renderDayBackground={renderDayBackground}
      />
    </div>
  )
}
