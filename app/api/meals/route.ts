import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const weekStart = req.nextUrl.searchParams.get('weekStart')
  if (!weekStart) return NextResponse.json({ error: 'weekStart required' }, { status: 400 })
  const { data } = await supabaseAdmin().from('meal_plans').select('*').eq('user_id', session.supabaseUserId).eq('week_start', weekStart)
  return NextResponse.json({ meals: data ?? [] })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { day_of_week, meal, week_start } = await req.json()
  const { error } = await supabaseAdmin().from('meal_plans').upsert(
    { user_id: session.supabaseUserId, day_of_week, meal, week_start },
    { onConflict: 'user_id,day_of_week,week_start' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
