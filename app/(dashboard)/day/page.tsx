'use client'

import { useMemo, useEffect, useCallback } from 'react'
import { startOfDay, endOfDay, format, isToday } from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'
import { TimeGrid } from '@/components/TimeGrid'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { useWeather, weatherEmoji } from '@/hooks/useWeather'
import { useIdealWeek } from '@/hooks/useIdealWeek'
import { useSettings } from '@/hooks/useSettings'
import { CalendarEvent } from '@/types'

export default function DayPage() {
  const { currentDate, setSelectedEvent, setDrawerOpen } = useCalendarContext()
  const { settings } = useSettings()
  const { frames } = useIdealWeek()
  const { days: weatherDays } = useWeather(settings.weatherLat, settings.weatherLng)

  const dayStart = useMemo(() => startOfDay(currentDate), [currentDate])
  const dayEnd = useMemo(() => endOfDay(currentDate), [currentDate])
  const days = useMemo(() => [dayStart], [dayStart])

  const { events, isLoading, refetch } = useCalendarEvents({
    from: dayStart,
    to: dayEnd,
  })

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('calendar-refresh', handler)
    return () => window.removeEventListener('calendar-refresh', handler)
  }, [refetch])

  useEffect(() => {
    const el = document.getElementById('time-grid-scroll')
    if (el) {
      const now = new Date()
      el.scrollTop = Math.max(0, (now.getHours() - 1) * 60)
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

  // Get weather for today
  const dateStr = format(currentDate, 'yyyy-MM-dd')
  const weather = settings.showWeather ? weatherDays.find(w => w.date === dateStr) : null

  return (
    <div className="flex flex-col h-full">
      {/* Day header */}
      <div className="flex items-center justify-center py-2 sm:py-3 border-b border-slate-800 shrink-0 gap-3">
        <div className={`text-center ${isToday(currentDate) ? 'text-blue-400' : 'text-slate-300'}`}>
          <div className="text-xs sm:text-sm">{format(currentDate, 'EEEE')}</div>
          <div className={`text-xl sm:text-2xl font-bold ${
            isToday(currentDate) ? 'bg-blue-600 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto' : ''
          }`}>
            {format(currentDate, 'd')}
          </div>
        </div>
        {weather && (
          <div className="text-sm text-slate-400">
            <span className="text-lg">{weatherEmoji(weather.weatherCode)}</span>
            <span className="ml-1">{Math.round(weather.tempMax)}&deg;/{Math.round(weather.tempMin)}&deg;</span>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-2 text-xs text-slate-500">Loading...</div>
      )}

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
