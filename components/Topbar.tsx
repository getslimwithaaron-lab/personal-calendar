'use client'

import { usePathname } from 'next/navigation'
import { format } from 'date-fns'

const VIEW_LABELS: Record<string, string> = {
  '/week': 'Week',
  '/day': 'Day',
  '/month': 'Month',
  '/agenda': 'Agenda',
  '/settings': 'Settings',
}

interface TopbarProps {
  currentDate: Date
  onToday?: () => void
  onPrev?: () => void
  onNext?: () => void
}

export function Topbar({ currentDate, onToday, onPrev, onNext }: TopbarProps) {
  const pathname = usePathname()
  const viewLabel = VIEW_LABELS[pathname] ?? ''

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm shrink-0">
      {/* Left: view label + date */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">{viewLabel}</h1>
        <span className="text-sm text-slate-400">
          {format(currentDate, 'MMMM yyyy')}
        </span>
      </div>

      {/* Center: navigation arrows + today */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px]"
        >
          Today
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Right: sync indicator placeholder */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" title="Connected" />
        <span className="text-xs text-slate-500 hidden md:block">Synced</span>
      </div>
    </header>
  )
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}
