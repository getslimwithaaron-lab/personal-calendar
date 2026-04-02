// app/api/calendars/google/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { listGoogleEvents, createGoogleEvent, updateGoogleEvent, deleteGoogleEvent } from '@/lib/google/calendar'
import { getValidGoogleToken } from '@/lib/google/token'

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// ── Helper: load connection + get valid token ─────────────────────────────────
async function getConnection(connectionId: string, userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('id', connectionId)
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single()
  if (error || !data) throw new Error('Connection not found')
  const token = await getValidGoogleToken(data.id, data.access_token, data.token_expiry)
  return { conn: data, token }
}

// ── GET /api/calendars/google/events?connectionId=...&from=...&to=... ─────────
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const connectionId = searchParams.get('connectionId') ?? ''
    const from = new Date(searchParams.get('from') ?? Date.now() - 7 * 86400000)
    const to   = new Date(searchParams.get('to')   ?? Date.now() + 30 * 86400000)

    const { conn, token } = await getConnection(connectionId, session.supabaseUserId)
    const events = await listGoogleEvents(token, conn.calendar_id, from, to, connectionId, conn.color)
    return NextResponse.json({ events })
  } catch (err) {
    console.error('[google/events GET]', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// ── POST /api/calendars/google/events — create ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as {
      connectionId: string; title: string; start: string; end: string
      allDay?: boolean; notes?: string; location?: string
      recurrenceRule?: string; timezone?: string
    }

    const { conn, token } = await getConnection(body.connectionId, session.supabaseUserId)
    const externalId = await createGoogleEvent(token, conn.calendar_id, {
      title: body.title,
      start: new Date(body.start),
      end:   new Date(body.end),
      allDay:        body.allDay,
      notes:         body.notes,
      location:      body.location,
      recurrenceRule: body.recurrenceRule,
      timezone:      body.timezone ?? 'America/Denver',
    })
    return NextResponse.json({ externalId })
  } catch (err) {
    console.error('[google/events POST]', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// ── PATCH /api/calendars/google/events — update ───────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as {
      connectionId: string; eventId: string
      title?: string; start?: string; end?: string
      notes?: string; location?: string; timezone?: string
    }

    const { conn, token } = await getConnection(body.connectionId, session.supabaseUserId)
    await updateGoogleEvent(token, conn.calendar_id, body.eventId, {
      title:    body.title,
      start:    body.start    ? new Date(body.start)    : undefined,
      end:      body.end      ? new Date(body.end)      : undefined,
      notes:    body.notes,
      location: body.location,
      timezone: body.timezone ?? 'America/Denver',
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[google/events PATCH]', err)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// ── DELETE /api/calendars/google/events?connectionId=...&eventId=... ──────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const connectionId = searchParams.get('connectionId') ?? ''
    const eventId      = searchParams.get('eventId')      ?? ''

    const { conn, token } = await getConnection(connectionId, session.supabaseUserId)
    await deleteGoogleEvent(token, conn.calendar_id, eventId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[google/events DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
