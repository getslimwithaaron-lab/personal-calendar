import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin().from('chores').select('*').eq('user_id', session.supabaseUserId).order('completed').order('due_date', { ascending: true, nullsFirst: false })
  return NextResponse.json({ chores: data ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, assignee, due_date } = await req.json()
  const { error } = await supabaseAdmin().from('chores').insert({ user_id: session.supabaseUserId, title, assignee: assignee ?? 'aaron', due_date })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...updates } = await req.json()
  if (updates.completed !== undefined) updates.completed_at = updates.completed ? new Date().toISOString() : null
  const { error } = await supabaseAdmin().from('chores').update(updates).eq('id', id).eq('user_id', session.supabaseUserId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await supabaseAdmin().from('chores').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
