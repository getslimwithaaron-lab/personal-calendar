'use client'

import { useNotes } from '@/hooks/useNotes'

export function NotesWidget() {
  const { content, updateContent, isLoading } = useNotes()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 shrink-0">
        <h3 className="text-sm font-semibold text-slate-300">Notes</h3>
        <span className="text-[10px] text-slate-600">Auto-saves</span>
      </div>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-600">Loading...</div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Type your notes here..."
          className="flex-1 w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 p-3 outline-none resize-none scroll-container"
          style={{ touchAction: 'pan-y', minHeight: '80px' }}
        />
      )}
    </div>
  )
}
