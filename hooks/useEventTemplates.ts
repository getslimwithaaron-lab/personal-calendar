// hooks/useEventTemplates.ts
// CRUD operations for event templates

'use client'

import { useState, useEffect, useCallback } from 'react'
import { EventTemplate } from '@/types'

export function useEventTemplates() {
  const [templates, setTemplates] = useState<EventTemplate[]>([])
  const [isLoading, setLoading] = useState(false)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/templates')
      if (res.ok) {
        const data = await res.json() as { templates: EventTemplate[] }
        setTemplates(data.templates)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  const createTemplate = useCallback(async (template: Omit<EventTemplate, 'id' | 'userId'>) => {
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    })
    if (res.ok) fetchTemplates()
    return res.ok
  }, [fetchTemplates])

  const deleteTemplate = useCallback(async (id: string) => {
    const res = await fetch(`/api/templates?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchTemplates()
    return res.ok
  }, [fetchTemplates])

  return { templates, isLoading, createTemplate, deleteTemplate, refetch: fetchTemplates }
}
