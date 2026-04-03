// hooks/useSettings.ts
// App settings hook

'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppSettings } from '@/types'

const DEFAULTS: AppSettings = {
  id: '',
  userId: '',
  theme: 'system',
  firstDayOfWeek: 0,
  defaultView: 'week',
  workingHoursStart: '08:00',
  workingHoursEnd: '18:00',
  showWeather: true,
  showIdealWeek: true,
  weatherLat: 39.6133,
  weatherLng: -104.9873,
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS)
  const [isLoading, setLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json() as { settings: AppSettings }
        if (data.settings) setSettings(data.settings)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    return res.ok
  }, [])

  return { settings, isLoading, updateSettings, refetch: fetchSettings }
}
