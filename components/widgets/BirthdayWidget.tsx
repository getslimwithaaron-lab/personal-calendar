'use client'

import { useState, useMemo } from 'react'
import { differenceInDays } from 'date-fns'
import { useBirthdays } from '@/hooks/useWidgetData'

export function BirthdayWidget() {
  const { items: birthdays, add, remove } = useBirthdays()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [dateStr, setDateStr] = useState('')

  const handleAdd = async () => {
    if (!name.trim() || !dateStr) return
    const d = new Date(dateStr)
    await add({ name: name.trim(), month: d.getMonth() + 1, day: d.getDate(), year: d.getFullYear() })
    setName(''); setDateStr(''); setAdding(false)
  }

  const sorted = useMemo(() => {
    const now = new Date()
    const thisYear = now.getFullYear()
    return birthdays.map(b => {
      let next = new Date(thisYear, b.month - 1, b.day)
      if (next < now) next = new Date(thisYear + 1, b.month - 1, b.day)
      const daysUntil = differenceInDays(next, now)
      return { ...b, daysUntil }
    }).sort((a, b) => a.daysUntil - b.daysUntil)
  }, [birthdays])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/50 shrink-0">
        <span className="text-xs text-slate-500">{birthdays.length} birthdays</span>
        <button onClick={() => setAdding(!adding)} className="text-xs text-blue-400 min-h-[36px] min-w-[44px]">{adding ? 'Cancel' : '+ Add'}</button>
      </div>
      {adding && (
        <div className="px-3 py-2 border-b border-slate-800/50 space-y-2 shrink-0">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <button onClick={handleAdd} className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-medium min-h-[44px]">Save</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scroll-container">
        {sorted.map(b => (
          <div key={b.id} className="flex items-center gap-3 px-3 py-2 min-h-[52px] group border-b border-slate-800/10">
            <div className="text-xl">🎂</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200">{b.name}</div>
              <div className="text-[10px] text-slate-500">{b.month}/{b.day}{b.year ? `/${b.year}` : ''}</div>
            </div>
            <div className={`text-sm font-bold shrink-0 ${b.daysUntil <= 7 ? 'text-yellow-400' : b.daysUntil <= 30 ? 'text-blue-400' : 'text-slate-500'}`}>
              {b.daysUntil === 0 ? 'Today!' : `${b.daysUntil}d`}
            </div>
            <button onClick={() => remove(b.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {birthdays.length === 0 && !adding && <div className="text-center py-8 text-xs text-slate-600">No birthdays yet</div>}
      </div>
    </div>
  )
}
