import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin().from('birthdays').select('*').eq('user_id', session.supabaseUserId).order('month').order('day')
  return NextResponse.json({ birthdays: data ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, month, day, year } = await req.json()
  const { error } = await supabaseAdmin().from('birthdays').insert({ user_id: session.supabaseUserId, name, month, day, year: year ?? null })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await supabaseAdmin().from('birthdays').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
