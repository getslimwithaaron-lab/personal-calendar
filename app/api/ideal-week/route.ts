// app/api/ideal-week/route.ts
// CRUD for ideal week frames

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
    .from('ideal_week_frames')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .order('day_of_week')
    .order('start_time')

  const frames = (data ?? []).map(f => ({
    id: f.id,
    userId: f.user_id,
    title: f.title,
    dayOfWeek: f.day_of_week,
    startTime: f.start_time,
    endTime: f.end_time,
    color: f.color,
    label: f.label,
    active: f.active,
  }))

  return NextResponse.json({ frames })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { error } = await sb().from('ideal_week_frames').insert({
    user_id: session.supabaseUserId,
    title: body.title,
    day_of_week: body.dayOfWeek,
    start_time: body.startTime,
    end_time: body.endTime,
    color: body.color ?? '#EAF3DE',
    label: body.label ?? null,
    active: body.active ?? true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await sb().from('ideal_week_frames').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
