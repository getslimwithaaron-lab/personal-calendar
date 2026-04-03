'use client'

import { useState } from 'react'
import { format, isBefore, startOfToday } from 'date-fns'
import { useChores } from '@/hooks/useWidgetData'

export function ChoreChartWidget() {
  const { items: chores, add, update, remove } = useChores()
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState('aaron')
  const today = startOfToday()

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await add({ title: newTitle.trim(), assignee: newAssignee })
    setNewTitle('')
  }

  const pending = chores.filter(c => !c.completed)
  const done = chores.filter(c => c.completed)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-800/50 shrink-0">
        <select value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} className="bg-slate-800 text-[11px] rounded px-1.5 py-1 text-slate-400 outline-none min-h-[40px]">
          <option value="aaron">Aaron</option>
          <option value="jessica">Jessica</option>
        </select>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }} placeholder="Add chore..." className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none min-h-[40px]" />
        {newTitle && <button onClick={handleAdd} className="text-xs text-blue-400 min-h-[40px] min-w-[44px]">Add</button>}
      </div>
      <div className="flex-1 overflow-y-auto scroll-container">
        {pending.map(chore => {
          const overdue = chore.due_date && isBefore(new Date(chore.due_date), today)
          return (
            <div key={chore.id} className="flex items-center gap-2 px-3 py-2 min-h-[48px] group">
              <button onClick={() => update({ id: chore.id, completed: true })} className={`w-5 h-5 rounded border shrink-0 min-h-[20px] min-w-[20px] ${overdue ? 'border-red-500' : 'border-slate-600'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm truncate ${overdue ? 'text-red-400' : 'text-slate-200'}`}>{chore.title}</div>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-slate-600">{chore.assignee === 'aaron' ? 'Aaron' : 'Jessica'}</span>
                  {chore.due_date && <span className={overdue ? 'text-red-500' : 'text-slate-600'}>{overdue ? 'Overdue' : format(new Date(chore.due_date), 'MMM d')}</span>}
                </div>
              </div>
              <button onClick={() => remove(chore.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )
        })}
        {done.length > 0 && (
          <>
            <div className="px-3 pt-3 pb-1 text-[10px] text-slate-600">Done ({done.length})</div>
            {done.slice(0, 5).map(chore => (
              <div key={chore.id} className="flex items-center gap-2 px-3 py-1 min-h-[36px]">
                <div className="w-5 h-5 rounded bg-green-700 shrink-0 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <span className="text-xs text-slate-500 line-through truncate">{chore.title}</span>
              </div>
            ))}
          </>
        )}
        {chores.length === 0 && <div className="text-center py-8 text-xs text-slate-600">No chores yet</div>}
      </div>
    </div>
  )
}
