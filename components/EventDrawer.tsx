'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { CalendarEvent } from '@/types'
import { useCalendarContext } from './CalendarProvider'

export function EventDrawer() {
  const { selectedEvent, drawerOpen, setDrawerOpen, setSelectedEvent } = useCalendarContext()

  const close = () => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedEvent(null), 300)
  }

  return (
    <AnimatePresence>
      {drawerOpen && selectedEvent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 flex flex-col"
          >
            <DrawerContent event={selectedEvent} onClose={close} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function DrawerContent({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(event.title)
  const [notes, setNotes] = useState(event.notes ?? '')
  const [deleting, setDeleting] = useState(false)

  const start = new Date(event.start)
  const end = new Date(event.end)

  const handleSave = async () => {
    const endpoint = event.source === 'google'
      ? '/api/calendars/google/events'
      : '/api/calendars/outlook/events'

    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        connectionId: event.connectionId,
        eventId: event.externalId,
        updates: { title, notes },
      }),
    })
    setEditing(false)
  }

  const handleDelete = async () => {
    const endpoint = event.source === 'google'
      ? `/api/calendars/google/events?connectionId=${event.connectionId}&eventId=${event.externalId}`
      : `/api/calendars/outlook/events?connectionId=${event.connectionId}&eventId=${event.externalId}`

    await fetch(endpoint, { method: 'DELETE' })
    onClose()
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
          <span className="text-xs text-slate-500 uppercase">{event.source}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <XIcon className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 scroll-container">
        {/* Title */}
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-b border-slate-700 outline-none w-full pb-1 mb-4 text-white"
            autoFocus
          />
        ) : (
          <h2 className="text-xl font-semibold text-white mb-4">{event.title}</h2>
        )}

        {/* Time */}
        <div className="flex items-center gap-3 mb-4 text-sm text-slate-300">
          <ClockIcon className="w-4 h-4 text-slate-500" />
          <div>
            {event.allDay ? (
              <span>All day · {format(start, 'EEEE, MMMM d, yyyy')}</span>
            ) : (
              <>
                <div>{format(start, 'EEEE, MMMM d, yyyy')}</div>
                <div>{format(start, 'h:mm a')} – {format(end, 'h:mm a')}</div>
              </>
            )}
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-3 mb-4 text-sm text-slate-300">
            <MapIcon className="w-4 h-4 text-slate-500" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-1">Notes</div>
          {editing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 rounded-lg p-2 text-sm text-slate-300 outline-none min-h-[80px] resize-none"
            />
          ) : (
            <p className="text-sm text-slate-400">{event.notes || 'No notes'}</p>
          )}
        </div>

        {/* Event type badge */}
        {event.eventType !== 'standard' && (
          <div className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 mb-4">
            {event.eventType}
          </div>
        )}
      </div>

      {/* Footer actions */}
      {event.source !== 'local' && (
        <div className="p-4 border-t border-slate-800 flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 min-h-[44px]">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 min-h-[44px]">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 min-h-[44px]">
                Edit
              </button>
              {deleting ? (
                <button onClick={handleDelete} className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-500 min-h-[44px]">
                  Confirm Delete
                </button>
              ) : (
                <button onClick={() => setDeleting(true)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-red-400 text-sm hover:bg-slate-700 min-h-[44px]">
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
