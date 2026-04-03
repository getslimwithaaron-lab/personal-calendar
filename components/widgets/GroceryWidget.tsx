'use client'

import { useState } from 'react'
import { useGrocery } from '@/hooks/useWidgetData'

export function GroceryWidget() {
  const { items, add, update, remove } = useGrocery()
  const [newItem, setNewItem] = useState('')

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  const handleAdd = async () => {
    if (!newItem.trim()) return
    await add({ title: newItem.trim() })
    setNewItem('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800/50 shrink-0">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          placeholder="Add item..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none min-h-[44px]"
        />
        {newItem && <button onClick={handleAdd} className="text-xs text-blue-400 px-2 min-h-[44px] min-w-[44px]">Add</button>}
      </div>
      <div className="flex-1 overflow-y-auto scroll-container">
        {unchecked.map(item => (
          <div key={item.id} className="flex items-center gap-2 px-3 py-2 min-h-[48px] group">
            <button onClick={() => update({ id: item.id, checked: true })} className="w-5 h-5 rounded border border-slate-600 shrink-0 min-h-[20px] min-w-[20px]" />
            <span className="flex-1 text-sm text-slate-200 truncate">{item.title}</span>
            <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {checked.length > 0 && (
          <>
            <div className="px-3 pt-3 pb-1 text-[10px] text-slate-600 uppercase">Checked ({checked.length})</div>
            {checked.map(item => (
              <div key={item.id} className="flex items-center gap-2 px-3 py-1.5 min-h-[40px] group">
                <button onClick={() => update({ id: item.id, checked: false })} className="w-5 h-5 rounded bg-green-700 border-green-700 shrink-0 flex items-center justify-center min-h-[20px] min-w-[20px]">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg>
                </button>
                <span className="flex-1 text-sm text-slate-500 line-through truncate">{item.title}</span>
                <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </>
        )}
        {items.length === 0 && <div className="text-center py-8 text-xs text-slate-600">No items yet</div>}
      </div>
    </div>
  )
}
