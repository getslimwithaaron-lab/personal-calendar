'use client'

import { useMemo, useEffect, useCallback } from 'react'
import { startOfWeek, endOfWeek, addDays, format, isToday, isSameDay } from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'
import { TimeGrid } from '@/components/TimeGrid'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { useWeather, weatherEmoji } from '@/hooks/useWeather'
import { useIdealWeek } from '@/hooks/useIdealWeek'
import { useSettings } from '@/hooks/useSettings'
import { CalendarEvent } from '@/types'

export default function WeekPage() {
  const { currentDate, setSelectedEvent, setDrawerOpen } = useCalendarContext()
  const { settings } = useSettings()
  const { frames } = useIdealWeek()
  const { days: weatherDays } = useWeather(settings.weatherLat, settings.weatherLng)

  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate])
  const weekEnd = useMemo(() => endOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate])
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const { events, isLoading, refetch } = useCalendarEvents({
    from: weekStart,
    to: weekEnd,
  })

  // Listen for calendar-refresh events from QuickAdd
  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('calendar-refresh', handler)
    return () => window.removeEventListener('calendar-refresh', handler)
  }, [refetch])

  // Auto-scroll to current hour on mount
  useEffect(() => {
    const el = document.getElementById('time-grid-scroll')
    if (el) {
      const now = new Date()
      const scrollTo = Math.max(0, (now.getHours() - 1) * 60)
      el.scrollTop = scrollTo
    }
  }, [])

  const handleReschedule = useCallback(async (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    const endpoint = event.source === 'google'
      ? '/api/calendars/google/events'
      : '/api/calendars/outlook/events'
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        connectionId: event.connectionId,
        eventId: event.externalId,
        updates: { start: newStart.toISOString(), end: newEnd.toISOString() },
      }),
    })
    refetch()
  }, [refetch])

  // Get weather for a given day
  const getWeather = (day: Date) => {
    if (!settings.showWeather || !weatherDays.length) return null
    const dateStr = format(day, 'yyyy-MM-dd')
    return weatherDays.find(w => w.date === dateStr)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Day headers with weather */}
      <div className="flex border-b border-slate-800 shrink-0">
        <div className="w-10 sm:w-14 shrink-0" />
        <div className="flex flex-1">
          {days.map(day => {
            const weather = getWeather(day)
            return (
              <div
                key={day.toISOString()}
                className={`flex-1 min-w-0 text-center py-1.5 sm:py-2 border-l border-slate-800/50 first:border-l-0 ${
                  isToday(day) ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                <div className="text-[10px] sm:text-xs uppercase">{format(day, 'EEE')}</div>
                <div className={`text-sm sm:text-lg font-semibold leading-none ${
                  isToday(day) ? 'bg-blue-600 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mx-auto' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                {weather && (
                  <div className="text-[10px] mt-0.5 leading-none" title={`${weather.tempMax}/${weather.tempMin}`}>
                    <span>{weatherEmoji(weather.weatherCode)}</span>
                    <span className="hidden sm:inline text-slate-500 ml-0.5">{Math.round(weather.tempMax)}&deg;</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-2 text-xs text-slate-500">Loading events...</div>
      )}

      {/* Time grid with ideal week overlay */}
      <TimeGrid
        days={days}
        events={events}
        idealWeekFrames={frames}
        showIdealWeek={settings.showIdealWeek}
        onEventClick={(ev) => {
          setSelectedEvent(ev)
          setDrawerOpen(true)
        }}
        onReschedule={handleReschedule}
      />
    </div>
  )
}
