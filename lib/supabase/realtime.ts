// lib/supabase/realtime.ts
// Supabase Realtime channel helpers for push sync

import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

export type RealtimePayload<T = Record<string, unknown>> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
}

// Subscribe to changes on calendar_connections for a user
export function subscribeConnections(
  supabase: SupabaseClient,
  userId: string,
  onChange: (payload: RealtimePayload) => void,
): RealtimeChannel {
  return supabase
    .channel(`connections:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calendar_connections',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onChange({
        eventType: payload.eventType as RealtimePayload['eventType'],
        new: payload.new as Record<string, unknown>,
        old: payload.old as Record<string, unknown>,
      }),
    )
    .subscribe()
}

// Subscribe to changes on local_events for a user
export function subscribeLocalEvents(
  supabase: SupabaseClient,
  userId: string,
  onChange: (payload: RealtimePayload) => void,
): RealtimeChannel {
  return supabase
    .channel(`local_events:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'local_events',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onChange({
        eventType: payload.eventType as RealtimePayload['eventType'],
        new: payload.new as Record<string, unknown>,
        old: payload.old as Record<string, unknown>,
      }),
    )
    .subscribe()
}

// Subscribe to changes on tasks for a user
export function subscribeTasks(
  supabase: SupabaseClient,
  userId: string,
  onChange: (payload: RealtimePayload) => void,
): RealtimeChannel {
  return supabase
    .channel(`tasks:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onChange({
        eventType: payload.eventType as RealtimePayload['eventType'],
        new: payload.new as Record<string, unknown>,
        old: payload.old as Record<string, unknown>,
      }),
    )
    .subscribe()
}
