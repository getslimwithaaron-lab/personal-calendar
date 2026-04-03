'use client'

import { useMemo } from 'react'
import { addDays, format, isToday, isTomorrow } from 'date-fns'
import { useCalendarContext } from '@/components/CalendarProvider'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { groupByDate } from '@/lib/events/merge'
import { CalendarEvent } from '@/types'

export default function AgendaPage() {
  const { currentDate, setSelectedEvent, setDrawerOpen } = useCalendarContext()

  const from = useMemo(() => currentDate, [currentDate])
  const to = useMemo(() => addDays(currentDate, 30), [currentDate])

  const { events, isLoading } = useCalendarEvents({ from, to })

  const grouped = useMemo(() => {
    const map = groupByDate(events)
    // Sort keys chronologically
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [events])

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-container p-4">
      {isLoading && (
        <div className="text-center py-4 text-sm text-slate-500">Loading events...</div>
      )}

      {!isLoading && grouped.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">No upcoming events</p>
          <p className="text-sm mt-1">Events from your connected calendars will appear here</p>
        </div>
      )}

      {grouped.map(([dateKey, dayEvents]) => {
        const date = new Date(dateKey + 'T00:00:00')
        return (
          <div key={dateKey} className="mb-6">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-2 sticky top-0 bg-slate-950/90 backdrop-blur-sm py-1 z-10">
              <div className={`text-center w-12 ${isToday(date) ? 'text-blue-400' : 'text-slate-400'}`}>
                <div className="text-xs uppercase">{format(date, 'EEE')}</div>
                <div className={`text-xl font-bold ${
                  isToday(date) ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''
                }`}>
                  {format(date, 'd')}
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'MMMM d, yyyy')}
              </div>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Events list */}
            <div className="flex flex-col gap-1.5 ml-14">
              {dayEvents.map(ev => (
                <AgendaEventRow key={ev.id} event={ev} onClick={() => {
                  setSelectedEvent(ev)
                  setDrawerOpen(true)
                }} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AgendaEventRow({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const start = new Date(event.start)
  const end = new Date(event.end)

  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 transition-colors text-left w-full min-h-[56px]"
    >
      <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: event.color }} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-white truncate">{event.title}</div>
        <div className="text-xs text-slate-400 mt-0.5">
          {event.allDay
            ? 'All day'
            : `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`}
        </div>
        {event.location && (
          <div className="text-xs text-slate-500 mt-0.5 truncate">{event.location}</div>
        )}
      </div>
      <div className="text-[10px] text-slate-600 uppercase shrink-0">{event.source}</div>
    </button>
  )
}
