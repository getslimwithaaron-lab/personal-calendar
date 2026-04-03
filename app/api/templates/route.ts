// app/api/templates/route.ts
// CRUD for event templates

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await sb()
    .from('event_templates')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .order('created_at', { ascending: false })

  const templates = (data ?? []).map(t => ({
    id: t.id,
    userId: t.user_id,
    title: t.title,
    defaultDurationMin: t.default_duration_min,
    color: t.color,
    notes: t.notes,
    location: t.location,
    recurrenceRule: t.recurrence_rule,
  }))

  return NextResponse.json({ templates })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { error } = await sb().from('event_templates').insert({
    user_id: session.supabaseUserId,
    title: body.title,
    default_duration_min: body.defaultDurationMin ?? 60,
    color: body.color ?? null,
    notes: body.notes ?? null,
    location: body.location ?? null,
    recurrence_rule: body.recurrenceRule ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await sb().from('event_templates').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
