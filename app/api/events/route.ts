// app/api/events/route.ts
// Unified events endpoint — merges Google + Outlook events server-side

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { listGoogleEvents } from '@/lib/google/calendar'
import { listOutlookEvents } from '@/lib/outlook/calendar'
import { getValidGoogleToken } from '@/lib/google/token'
import { getValidOutlookToken } from '@/lib/outlook/token'
import { CalendarEvent } from '@/types'

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const from = searchParams.get('from')
  const to   = searchParams.get('to')
  if (!from || !to) {
    return NextResponse.json({ error: 'from and to required' }, { status: 400 })
  }

  const fromDate = new Date(from)
  const toDate   = new Date(to)

  const sb = supabaseAdmin()
  const { data: connections } = await sb
    .from('calendar_connections')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .eq('active', true)

  if (!connections || connections.length === 0) {
    return NextResponse.json({ events: [] })
  }

  const allEvents: CalendarEvent[] = []

  const results = await Promise.allSettled(
    connections.map(async (conn) => {
      if (conn.provider === 'google') {
        const token = await getValidGoogleToken(
          conn.id, conn.access_token, conn.token_expiry,
        )
        return listGoogleEvents(
          token, conn.calendar_id, fromDate, toDate, conn.id, conn.color,
        )
      }
      if (conn.provider === 'outlook') {
        const token = await getValidOutlookToken(
          conn.id, conn.access_token, conn.token_expiry,
        )
        return listOutlookEvents(
          token, fromDate, toDate, conn.id, conn.color,
        )
      }
      return [] as CalendarEvent[]
    }),
  )

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allEvents.push(...result.value)
    }
  }

  // Deduplicate by source + externalId and sort by start time
  const seen = new Set<string>()
  const unique = allEvents.filter(e => {
    const key = `${e.source}:${e.externalId}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  unique.sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })

  return NextResponse.json({ events: unique })
}
