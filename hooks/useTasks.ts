// hooks/useTasks.ts
// CRUD operations for tasks

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setLoading] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json() as { tasks: Task[] }
        setTasks(data.tasks)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = useCallback(async (title: string, dueDate?: string) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueDate }),
    })
    if (res.ok) fetchTasks()
    return res.ok
  }, [fetchTasks])

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    })
    if (res.ok) fetchTasks()
    return res.ok
  }, [fetchTasks])

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchTasks()
    return res.ok
  }, [fetchTasks])

  const scheduleTask = useCallback(async (id: string, start: string, end: string) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, scheduledStart: start, scheduledEnd: end }),
    })
    if (res.ok) fetchTasks()
    return res.ok
  }, [fetchTasks])

  return { tasks, isLoading, addTask, toggleTask, deleteTask, scheduleTask, refetch: fetchTasks }
}
