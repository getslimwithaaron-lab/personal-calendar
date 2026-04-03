// hooks/useIdealWeek.ts
// Fetch and manage ideal week frames

'use client'

import { useState, useEffect, useCallback } from 'react'
import { IdealWeekFrame } from '@/types'

export function useIdealWeek() {
  const [frames, setFrames] = useState<IdealWeekFrame[]>([])
  const [isLoading, setLoading] = useState(false)

  const fetchFrames = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ideal-week')
      if (res.ok) {
        const data = await res.json() as { frames: IdealWeekFrame[] }
        setFrames(data.frames)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFrames() }, [fetchFrames])

  const saveFrame = useCallback(async (frame: Omit<IdealWeekFrame, 'id' | 'userId'>) => {
    const res = await fetch('/api/ideal-week', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(frame),
    })
    if (res.ok) fetchFrames()
    return res.ok
  }, [fetchFrames])

  const deleteFrame = useCallback(async (id: string) => {
    const res = await fetch(`/api/ideal-week?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchFrames()
    return res.ok
  }, [fetchFrames])

  return { frames, isLoading, saveFrame, deleteFrame, refetch: fetchFrames }
}
