'use client'

import { useState, useRef, useCallback } from 'react'
import { NotesWidget } from './widgets/NotesWidget'
import { ToDoWidget } from './widgets/ToDoWidget'
import { WeatherWidget } from './widgets/WeatherWidget'
import { MiniCalendarWidget } from './widgets/MiniCalendarWidget'

const MIN_HEIGHT = 120
const MAX_HEIGHT = 600
const DEFAULT_HEIGHT = 240

export function WidgetPanel() {
  const [height, setHeight] = useState(DEFAULT_HEIGHT)
  const [collapsed, setCollapsed] = useState(false)
  const dragging = useRef(false)
  const startY = useRef(0)
  const startH = useRef(0)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = true
    startY.current = e.clientY
    startH.current = height

    const handleMove = (ev: PointerEvent) => {
      if (!dragging.current) return
      const dy = startY.current - ev.clientY // dragging UP = bigger
      const newH = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startH.current + dy))
      setHeight(newH)
    }

    const handleUp = () => {
      dragging.current = false
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleUp)
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleUp)
  }, [height])

  return (
    <div className="shrink-0 border-t border-slate-800 bg-slate-900/50 flex flex-col" style={{ height: collapsed ? 40 : height }}>
      {/* Drag handle + collapse toggle */}
      <div
        className="flex items-center justify-center gap-2 h-[40px] shrink-0 cursor-ns-resize select-none touch-none border-b border-slate-800/50"
        onPointerDown={collapsed ? undefined : handlePointerDown}
      >
        {/* Drag indicator */}
        {!collapsed && (
          <div className="flex gap-0.5">
            <div className="w-8 h-1 rounded-full bg-slate-700" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="text-[11px] text-slate-500 hover:text-slate-300 px-2 py-1 rounded min-h-[36px] min-w-[64px] flex items-center justify-center gap-1"
        >
          <ChevronIcon className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          <span>Widgets</span>
        </button>
        {!collapsed && (
          <div className="flex gap-0.5">
            <div className="w-8 h-1 rounded-full bg-slate-700" />
          </div>
        )}
      </div>

      {/* Widget grid */}
      {!collapsed && (
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Notes */}
          <div className="flex-1 min-w-0 border-r border-slate-800/50 overflow-hidden">
            <NotesWidget />
          </div>
          {/* To Do */}
          <div className="flex-[1.5] min-w-0 border-r border-slate-800/50 overflow-hidden">
            <ToDoWidget />
          </div>
          {/* Weather */}
          <div className="flex-1 min-w-0 border-r border-slate-800/50 overflow-hidden hidden lg:flex flex-col">
            <WeatherWidget />
          </div>
          {/* Mini Calendar */}
          <div className="w-[200px] xl:w-[240px] shrink-0 overflow-hidden hidden md:flex flex-col">
            <MiniCalendarWidget />
          </div>
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 15l-6-6-6 6" />
    </svg>
  )
}
