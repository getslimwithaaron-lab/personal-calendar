'use client'

import { useState, useRef } from 'react'
import { format, addMinutes } from 'date-fns'
import { CalendarEvent } from '@/types'

const HOUR_HEIGHT = 60
const SNAP_MINUTES = 15

interface DraggableEventProps {
  event: CalendarEvent
  dayStart: Date
  onClick: () => void
  onReschedule?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
}

export function DraggableEvent({ event, dayStart, onClick, onReschedule }: DraggableEventProps) {
  const [dragging, setDragging] = useState(false)
  const [offsetY, setOffsetY] = useState(0)
  const startYRef = useRef(0)
  const start = new Date(event.start)
  const end = new Date(event.end)
  const durationMin = (end.getTime() - start.getTime()) / 60000
  const topMin = Math.max(0, (start.getTime() - dayStart.getTime()) / 60000)

  const top = (topMin / 60) * HOUR_HEIGHT + offsetY
  const height = Math.max(16, (durationMin / 60) * HOUR_HEIGHT)

  function handlePointerDown(e: React.PointerEvent) {
    if (!onReschedule) return
    e.preventDefault()
    startYRef.current = e.clientY
    setDragging(true)

    const handleMove = (ev: PointerEvent) => {
      const dy = ev.clientY - startYRef.current
      setOffsetY(dy)
    }

    const handleUp = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleUp)
      setDragging(false)

      const dy = ev.clientY - startYRef.current
      if (Math.abs(dy) < 5) {
        setOffsetY(0)
        return
      }

      const deltaMin = Math.round((dy / HOUR_HEIGHT) * 60 / SNAP_MINUTES) * SNAP_MINUTES
      if (deltaMin === 0) {
        setOffsetY(0)
        return
      }

      const newStart = addMinutes(start, deltaMin)
      const newEnd = addMinutes(end, deltaMin)
      setOffsetY(0)
      onReschedule(event, newStart, newEnd)
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleUp)
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        if (!dragging) onClick()
        e.stopPropagation()
      }}
      className={`absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-xs overflow-hidden z-10 text-left touch-none select-none
        ${dragging ? 'opacity-80 shadow-lg shadow-black/50 z-30 ring-2 ring-blue-400' : 'cursor-pointer'}`}
      style={{
        top,
        height,
        backgroundColor: event.color + '33',
        borderLeft: `3px solid ${event.color}`,
        color: event.color,
        transition: dragging ? 'none' : 'top 0.15s ease',
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {height > 30 && (
        <div className="text-[10px] opacity-70">{format(start, 'h:mm a')}</div>
      )}
    </button>
  )
}
