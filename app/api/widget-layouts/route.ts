import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin().from('widget_layouts').select('*').eq('user_id', session.supabaseUserId)
  return NextResponse.json({ layouts: data ?? [] })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { widget_key, x, y, w, h, collapsed, visible, z_index } = await req.json()
  const { error } = await supabaseAdmin().from('widget_layouts').upsert(
    { user_id: session.supabaseUserId, widget_key, x, y, w, h, collapsed, visible, z_index },
    { onConflict: 'user_id,widget_key' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
