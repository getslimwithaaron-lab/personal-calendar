// hooks/useRealtimeEvents.ts
// Subscribes to Supabase Realtime — triggers refetch when data changes

'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  subscribeConnections,
  subscribeLocalEvents,
  subscribeTasks,
} from '@/lib/supabase/realtime'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeEventsOptions {
  userId: string | undefined
  onConnectionChange?: () => void
  onLocalEventChange?: () => void
  onTaskChange?: () => void
  enabled?: boolean
}

export function useRealtimeEvents({
  userId,
  onConnectionChange,
  onLocalEventChange,
  onTaskChange,
  enabled = true,
}: UseRealtimeEventsOptions) {
  const channelsRef = useRef<RealtimeChannel[]>([])

  useEffect(() => {
    if (!enabled || !userId) return

    const supabase = createClient()

    const channels: RealtimeChannel[] = []

    if (onConnectionChange) {
      channels.push(
        subscribeConnections(supabase, userId, () => onConnectionChange()),
      )
    }

    if (onLocalEventChange) {
      channels.push(
        subscribeLocalEvents(supabase, userId, () => onLocalEventChange()),
      )
    }

    if (onTaskChange) {
      channels.push(
        subscribeTasks(supabase, userId, () => onTaskChange()),
      )
    }

    channelsRef.current = channels

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch))
      channelsRef.current = []
    }
  }, [userId, enabled, onConnectionChange, onLocalEventChange, onTaskChange])
}
