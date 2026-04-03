'use client'

import { useState } from 'react'
import { useContacts } from '@/hooks/useWidgetData'

export function ContactsWidget() {
  const { items: contacts, add, remove } = useContacts()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')

  const handleAdd = async () => {
    if (!name.trim()) return
    await add({ name: name.trim(), phone, role })
    setName(''); setPhone(''); setRole(''); setAdding(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/50 shrink-0">
        <span className="text-xs text-slate-500">{contacts.length} contacts</span>
        <button onClick={() => setAdding(!adding)} className="text-xs text-blue-400 min-h-[36px] min-w-[44px]">{adding ? 'Cancel' : '+ Add'}</button>
      </div>
      {adding && (
        <div className="px-3 py-2 border-b border-slate-800/50 space-y-2 shrink-0">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" type="tel" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (e.g. Mom, Doctor)" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <button onClick={handleAdd} className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-medium min-h-[44px]">Save</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scroll-container">
        {contacts.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-2 min-h-[56px] border-b border-slate-800/10 group">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 shrink-0">
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200">{c.name}</div>
              <div className="text-[10px] text-slate-500">{c.role}{c.role && c.phone ? ' · ' : ''}{c.phone}</div>
            </div>
            {c.phone && (
              <a href={`tel:${c.phone}`} className="text-blue-400 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </a>
            )}
            <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {contacts.length === 0 && !adding && <div className="text-center py-8 text-xs text-slate-600">No contacts yet</div>}
      </div>
    </div>
  )
}
