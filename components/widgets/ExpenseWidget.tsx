'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useExpenses } from '@/hooks/useWidgetData'

export function ExpenseWidget() {
  const currentMonth = format(new Date(), 'yyyy-MM')
  const { items: expenses, add, remove } = useExpenses(currentMonth)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('aaron')

  const handleAdd = async () => {
    if (!title.trim() || !amount) return
    await add({ title: title.trim(), amount: parseFloat(amount), paid_by: paidBy })
    setTitle(''); setAmount(''); setAdding(false)
  }

  const total = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses])

  return (
    <div className="flex flex-col h-full">
      {/* Monthly total */}
      <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-800/50 shrink-0 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase">{format(new Date(), 'MMMM yyyy')}</div>
          <div className="text-lg font-bold text-white">${total.toFixed(2)}</div>
        </div>
        <button onClick={() => setAdding(!adding)} className="text-xs text-blue-400 min-h-[40px] min-w-[44px]">{adding ? 'Cancel' : '+ Add'}</button>
      </div>
      {adding && (
        <div className="px-3 py-2 border-b border-slate-800/50 space-y-2 shrink-0">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What was it?" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <div className="flex gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="$0.00" className="flex-1 bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="bg-slate-800 rounded px-2 text-sm text-white outline-none min-h-[40px]">
              <option value="aaron">Aaron</option>
              <option value="jessica">Jessica</option>
            </select>
          </div>
          <button onClick={handleAdd} className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-medium min-h-[44px]">Add Expense</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scroll-container">
        {expenses.map(e => (
          <div key={e.id} className="flex items-center gap-2 px-3 py-2 min-h-[48px] border-b border-slate-800/10 group">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200">{e.title}</div>
              <div className="text-[10px] text-slate-500">{e.paid_by === 'aaron' ? 'Aaron' : 'Jessica'} · {format(new Date(e.expense_date), 'MMM d')}</div>
            </div>
            <span className="text-sm font-medium text-slate-300">${Number(e.amount).toFixed(2)}</span>
            <button onClick={() => remove(e.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {expenses.length === 0 && !adding && <div className="text-center py-8 text-xs text-slate-600">No expenses this month</div>}
      </div>
    </div>
  )
}
