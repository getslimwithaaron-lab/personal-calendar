'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types'

interface TaskSidebarProps {
  open: boolean
  onClose: () => void
}

export function TaskSidebar({ open, onClose }: TaskSidebarProps) {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const [newTitle, setNewTitle] = useState('')

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addTask(newTitle.trim())
    setNewTitle('')
  }

  if (!open) return null

  return (
    <div className="w-72 shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-slate-800">
        <h2 className="font-semibold text-sm">Tasks</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 min-h-[36px] min-w-[36px] flex items-center justify-center">
          <XIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Add task */}
      <div className="px-3 py-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            placeholder="Add a task..."
            className="flex-1 text-sm bg-transparent text-white placeholder-slate-500 outline-none min-h-[36px]"
          />
          {newTitle && (
            <button onClick={handleAdd} className="text-xs text-blue-400 px-2 py-1 min-h-[32px]">Add</button>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto scroll-container px-2 py-2">
        {pending.length === 0 && completed.length === 0 && (
          <p className="text-center text-sm text-slate-600 py-8">No tasks yet</p>
        )}

        {pending.map(task => (
          <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
        ))}

        {completed.length > 0 && (
          <>
            <div className="text-xs text-slate-600 mt-4 mb-1 px-2">Completed ({completed.length})</div>
            {completed.map(task => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-800/50 group">
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={`w-4 h-4 mt-0.5 rounded border shrink-0 flex items-center justify-center min-h-[16px] min-w-[16px]
          ${task.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}
      >
        {task.completed && <CheckIcon className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
          {task.title}
        </div>
        {task.dueDate && (
          <div className="text-[10px] text-slate-500 mt-0.5">
            Due {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 min-h-[24px] min-w-[24px]"
      >
        <TrashIcon className="w-3 h-3" />
      </button>
    </div>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  )
}
