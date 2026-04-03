'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export interface FamilyAlert {
  id: string
  user_id: string
  sender_name: string
  sender_email: string
  message: string
  dismissed: boolean
  dismissed_at: string | null
  created_at: string
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<FamilyAlert[]>([])
  const [isLoading, setLoading] = useState(false)
  const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/alerts')
      if (res.ok) {
        const data = await res.json() as { alerts: FamilyAlert[] }
        setAlerts(data.alerts)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => { fetchAlerts() }, [fetchAlerts])

  // Supabase Realtime subscription for instant alerts
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    supabaseRef.current = supabase

    const channel = supabase
      .channel('family_alerts_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'family_alerts' },
        (payload) => {
          const newAlert = payload.new as FamilyAlert
          setAlerts(prev => [newAlert, ...prev])
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'family_alerts' },
        (payload) => {
          const updated = payload.new as FamilyAlert
          setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const dismissAlert = useCallback(async (id: string) => {
    // Optimistic update
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true, dismissed_at: new Date().toISOString() } : a))
    await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }, [])

  const sendAlert = useCallback(async (message: string) => {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    return res.ok
  }, [])

  const undismissed = alerts.filter(a => !a.dismissed)
  const history = alerts

  return { alerts: history, undismissed, isLoading, sendAlert, dismissAlert, refetch: fetchAlerts }
}
