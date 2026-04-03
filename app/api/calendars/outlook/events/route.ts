// app/api/calendars/outlook/events/route.ts
// GET / POST / PATCH / DELETE — Outlook calendar events via Microsoft Graph

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import {
  listOutlookEvents,
  createOutlookEvent,
  updateOutlookEvent,
  deleteOutlookEvent,
} from '@/lib/outlook/calendar'
import { getValidOutlookToken } from '@/lib/outlook/token'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── GET — list events across all active Outlook connections ───────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timeMin = new Date(searchParams.get('timeMin') ?? new Date().toISOString())
    const timeMax = new Date(searchParams.get('timeMax') ?? new Date(Date.now() + 30 * 86400000).toISOString())

    const supabase = getSupabaseAdmin()
    const { data: connections, error } = await supabase
      .from('calendar_connections')
      .select('id, access_token, refresh_token, token_expiry, color')
      .eq('user_id', session.supabaseUserId)
      .eq('provider', 'outlook')
      .eq('active', true)

    if (error) throw error
    if (!connections?.length) return NextResponse.json({ events: [] })

    const allEvents = await Promise.all(
      connections.map(async (conn) => {
        try {
          const token = await getValidOutlookToken(conn.id, conn.access_token, conn.token_expiry)
          return await listOutlookEvents(token, timeMin, timeMax, conn.id, conn.color)
        } catch (err) {
          console.error(`[outlook/events] connection ${conn.id} failed:`, err)
          return []
        }
      })
    )

    return NextResponse.json({ events: allEvents.flat() })
  } catch (err) {
    console.error('[outlook/events GET] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST — create a new Outlook event ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      connectionId: string
      title: string
      start: string
      end: string
      allDay?: boolean
      notes?: string
      location?: string
      timezone?: string
    }

    const supabase = getSupabaseAdmin()
    const { data: conn, error } = await supabase
      .from('calendar_connections')
      .select('access_token, refresh_token, token_expiry')
      .eq('id', body.connectionId)
      .eq('user_id', session.supabaseUserId)
      .single()

    if (error || !conn) return NextResponse.json({ error: 'Connection not found' }, { status: 404 })

    const token = await getValidOutlookToken(body.connectionId, conn.access_token, conn.token_expiry)
    const eventId = await createOutlookEvent(token, {
      title:    body.title,
      start:    new Date(body.start),
      end:      new Date(body.end),
      allDay:   body.allDay,
      notes:    body.notes,
      location: body.location,
      timezone: body.timezone,
    })

    return NextResponse.json({ eventId })
  } catch (err) {
    console.error('[outlook/events POST] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH — update an existing Outlook event ──────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      connectionId: string
      eventId: string
      title?: string
      start?: string
      end?: string
      notes?: string
      location?: string
      timezone?: string
    }

    const supabase = getSupabaseAdmin()
    const { data: conn, error } = await supabase
      .from('calendar_connections')
      .select('access_token, refresh_token, token_expiry')
      .eq('id', body.connectionId)
      .eq('user_id', session.supabaseUserId)
      .single()

    if (error || !conn) return NextResponse.json({ error: 'Connection not found' }, { status: 404 })

    const token = await getValidOutlookToken(body.connectionId, conn.access_token, conn.token_expiry)
    await updateOutlookEvent(token, body.eventId, {
      title:    body.title,
      start:    body.start    ? new Date(body.start)    : undefined,
      end:      body.end      ? new Date(body.end)      : undefined,
      notes:    body.notes,
      location: body.location,
      timezone: body.timezone,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[outlook/events PATCH] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE — delete an Outlook event ─────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const connectionId = searchParams.get('connectionId')
    const eventId      = searchParams.get('eventId')
    if (!connectionId || !eventId) {
      return NextResponse.json({ error: 'connectionId and eventId required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data: conn, error } = await supabase
      .from('calendar_connections')
      .select('access_token, refresh_token, token_expiry')
      .eq('id', connectionId)
      .eq('user_id', session.supabaseUserId)
      .single()

    if (error || !conn) return NextResponse.json({ error: 'Connection not found' }, { status: 404 })

    const token = await getValidOutlookToken(connectionId, conn.access_token, conn.token_expiry)
    await deleteOutlookEvent(token, eventId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[outlook/events DELETE] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
