'use client'

import { useState, useRef, useCallback } from 'react'
import { parseNaturalEvent } from '@/lib/events/nlp'
import { format } from 'date-fns'

interface QuickAddProps {
  onAdd: (event: { title: string; start: Date; end: Date; allDay: boolean }) => void
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback((value: string) => {
    setInput(value)
    if (value.length < 3) {
      setPreview(null)
      return
    }
    const parsed = parseNaturalEvent(value)
    if (parsed) {
      const timeStr = parsed.allDay
        ? 'All day'
        : `${format(parsed.start, 'MMM d, h:mm a')} – ${format(parsed.end, 'h:mm a')}`
      setPreview(`${parsed.title} · ${timeStr}`)
    } else {
      setPreview(null)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return
    const parsed = parseNaturalEvent(input)
    if (parsed) {
      onAdd(parsed)
      setInput('')
      setPreview(null)
    }
  }, [input, onAdd])

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-slate-900 rounded-xl border border-slate-800 px-3 py-2">
        <PlusIcon className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Quick add: Lunch with Sarah tomorrow at noon"
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none min-h-[36px]"
        />
        {input && (
          <button
            onClick={handleSubmit}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 px-2 py-1 rounded min-h-[32px]"
          >
            Add
          </button>
        )}
      </div>
      {preview && (
        <div className="absolute top-full left-0 right-0 mt-1 px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 z-20">
          {preview}
        </div>
      )}
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
