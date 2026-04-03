import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const month = req.nextUrl.searchParams.get('month') // YYYY-MM
  let q = supabaseAdmin().from('expenses').select('*').eq('user_id', session.supabaseUserId)
  if (month) {
    q = q.gte('expense_date', `${month}-01`).lt('expense_date', `${month}-32`)
  }
  const { data } = await q.order('expense_date', { ascending: false })
  return NextResponse.json({ expenses: data ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, amount, category, paid_by, expense_date } = await req.json()
  const { error } = await supabaseAdmin().from('expenses').insert({
    user_id: session.supabaseUserId, title, amount, category: category ?? 'other',
    paid_by: paid_by ?? 'aaron', expense_date: expense_date ?? new Date().toISOString().slice(0, 10),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await supabaseAdmin().from('expenses').delete().eq('id', id).eq('user_id', session.supabaseUserId)
  return NextResponse.json({ ok: true })
}
