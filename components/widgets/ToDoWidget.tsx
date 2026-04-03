'use client'

import { useState } from 'react'
import { format, isBefore, startOfToday } from 'date-fns'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types'

const PEOPLE = ['aaron', 'jessica'] as const
const LABELS: Record<string, string> = { aaron: 'Aaron', jessica: 'Jessica' }

export function ToDoWidget() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState<'aaron' | 'jessica'>('aaron')
  const today = startOfToday()

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addTask(newTitle.trim(), undefined, newAssignee)
    setNewTitle('')
  }

  const isOverdue = (task: Task): boolean =>
    !task.completed && !!task.dueDate && isBefore(new Date(task.dueDate), today)

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-slate-800 shrink-0">
        <h3 className="text-sm font-semibold text-slate-300">To Do</h3>
      </div>

      {/* Add task row */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-800/50 shrink-0">
        <select
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value as 'aaron' | 'jessica')}
          className="bg-slate-800 text-[11px] rounded px-1.5 py-1 text-slate-400 border-none outline-none min-h-[36px]"
        >
          <option value="aaron">Aaron</option>
          <option value="jessica">Jessica</option>
        </select>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          placeholder="Add task..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none min-h-[36px]"
        />
        {newTitle && (
          <button onClick={handleAdd} className="text-xs text-blue-400 px-2 min-h-[36px] min-w-[44px]">Add</button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {PEOPLE.map(person => {
          const personTasks = tasks.filter(t => (t.assignee ?? 'aaron') === person)
          const pending = personTasks.filter(t => !t.completed)
          const done = personTasks.filter(t => t.completed)
          return (
            <div key={person} className="flex-1 flex flex-col border-r border-slate-800/50 last:border-r-0 overflow-y-auto scroll-container">
              {/* Column header */}
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm px-2 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/30">
                {LABELS[person]} ({pending.length})
              </div>

              {/* Pending tasks */}
              {pending.map(task => (
                <TaskRow key={task.id} task={task} overdue={isOverdue(task)} onToggle={toggleTask} onDelete={deleteTask} />
              ))}

              {/* Completed */}
              {done.length > 0 && (
                <>
                  <div className="px-2 pt-2 pb-0.5 text-[10px] text-slate-600">Done ({done.length})</div>
                  {done.slice(0, 5).map(task => (
                    <TaskRow key={task.id} task={task} overdue={false} onToggle={toggleTask} onDelete={deleteTask} />
                  ))}
                  {done.length > 5 && (
                    <div className="px-2 py-1 text-[10px] text-slate-600">+{done.length - 5} more</div>
                  )}
                </>
              )}

              {pending.length === 0 && done.length === 0 && (
                <div className="px-2 py-4 text-[11px] text-slate-600 text-center">No tasks</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TaskRow({
  task, overdue, onToggle, onDelete,
}: {
  task: Task
  overdue: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-start gap-1.5 px-2 py-1.5 group min-h-[44px]">
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={`w-5 h-5 mt-0.5 rounded border shrink-0 flex items-center justify-center min-h-[20px] min-w-[20px]
          ${task.completed ? 'bg-blue-600 border-blue-600' : overdue ? 'border-red-500' : 'border-slate-600'}`}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-xs leading-snug ${
          task.completed ? 'text-slate-500 line-through' : overdue ? 'text-red-400' : 'text-slate-200'
        }`}>
          {task.title}
        </div>
        {task.dueDate && (
          <div className={`text-[10px] mt-0.5 ${overdue ? 'text-red-500' : 'text-slate-600'}`}>
            {overdue ? 'Overdue: ' : ''}{format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-1 min-h-[24px] min-w-[24px] shrink-0"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
