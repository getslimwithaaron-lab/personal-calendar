import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin().from('family_contacts').select('*').eq('user_id', session.supabaseUserId).order('name')
  return NextResponse.json({ contacts: data ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, phone, role } = await req.json()
  const { error } = await supabaseAdmin().from('family_contacts').insert({ user_id: session.supabaseUserId, name, phone: phone ?? '', role: role ?? '' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await supabaseAdmin().from('family_contacts').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
