'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useNotes() {
  const [content, setContent] = useState('')
  const [isLoading, setLoading] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notes')
      if (res.ok) {
        const data = await res.json() as { content: string }
        setContent(data.content)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const saveNotes = useCallback(async (text: string) => {
    await fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    })
  }, [])

  // Auto-save with debounce (800ms after last keystroke)
  const updateContent = useCallback((text: string) => {
    setContent(text)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveNotes(text), 800)
  }, [saveNotes])

  return { content, updateContent, isLoading }
}
