// app/api/tasks/route.ts
// CRUD for tasks

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
    .from('tasks')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .order('sort_order')
    .order('due_date', { ascending: true, nullsFirst: false })

  const tasks = (data ?? []).map(t => ({
    id: t.id,
    userId: t.user_id,
    title: t.title,
    dueDate: t.due_date,
    scheduledStart: t.scheduled_start,
    scheduledEnd: t.scheduled_end,
    completed: t.completed,
    completedAt: t.completed_at,
    color: t.color,
    sortOrder: t.sort_order,
  }))

  return NextResponse.json({ tasks })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await sb().from('tasks').insert({
    user_id: session.supabaseUserId,
    title: body.title,
    due_date: body.dueDate ?? null,
    color: body.color ?? null,
    sort_order: body.sortOrder ?? 0,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body

  const dbUpdates: Record<string, unknown> = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.completed !== undefined) {
    dbUpdates.completed = updates.completed
    dbUpdates.completed_at = updates.completed ? new Date().toISOString() : null
  }
  if (updates.scheduledStart !== undefined) dbUpdates.scheduled_start = updates.scheduledStart
  if (updates.scheduledEnd !== undefined) dbUpdates.scheduled_end = updates.scheduledEnd
  if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate

  const { error } = await sb().from('tasks').update(dbUpdates).eq('id', id).eq('user_id', session.supabaseUserId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await sb().from('tasks').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
