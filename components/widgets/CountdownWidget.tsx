'use client'

import { useState, useMemo } from 'react'
import { differenceInDays, format } from 'date-fns'
import { useCountdowns } from '@/hooks/useWidgetData'

export function CountdownWidget() {
  const { items: countdowns, add, remove } = useCountdowns()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [dateStr, setDateStr] = useState('')

  const handleAdd = async () => {
    if (!title.trim() || !dateStr) return
    await add({ title: title.trim(), target_date: dateStr })
    setTitle(''); setDateStr(''); setAdding(false)
  }

  const sorted = useMemo(() => {
    const now = new Date()
    return countdowns.map(c => ({
      ...c,
      daysLeft: differenceInDays(new Date(c.target_date), now),
    })).sort((a, b) => a.daysLeft - b.daysLeft)
  }, [countdowns])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/50 shrink-0">
        <span className="text-xs text-slate-500">{countdowns.length} countdowns</span>
        <button onClick={() => setAdding(!adding)} className="text-xs text-blue-400 min-h-[36px] min-w-[44px]">{adding ? 'Cancel' : '+ Add'}</button>
      </div>
      {adding && (
        <div className="px-3 py-2 border-b border-slate-800/50 space-y-2 shrink-0">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event name" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <button onClick={handleAdd} className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-medium min-h-[44px]">Save</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scroll-container">
        {sorted.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-3 min-h-[64px] border-b border-slate-800/10 group">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0" style={{ backgroundColor: c.color + '22' }}>
              <span className="text-xl font-bold" style={{ color: c.color }}>{Math.max(0, c.daysLeft)}</span>
              <span className="text-[9px]" style={{ color: c.color }}>days</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 font-medium">{c.title}</div>
              <div className="text-[10px] text-slate-500">{format(new Date(c.target_date), 'MMMM d, yyyy')}</div>
            </div>
            <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {countdowns.length === 0 && !adding && <div className="text-center py-8 text-xs text-slate-600">No countdowns yet</div>}
      </div>
    </div>
  )
}
