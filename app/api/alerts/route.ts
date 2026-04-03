import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin()
    .from('family_alerts')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .order('created_at', { ascending: false })
    .limit(50)
  return NextResponse.json({ alerts: data ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message } = await req.json() as { message: string }
  if (!message?.trim()) return NextResponse.json({ error: 'message required' }, { status: 400 })

  const senderName = session.user?.name ?? session.user?.email?.split('@')[0] ?? 'Unknown'
  const senderEmail = session.user?.email ?? ''

  const { error } = await supabaseAdmin().from('family_alerts').insert({
    user_id: session.supabaseUserId,
    sender_name: senderName,
    sender_email: senderEmail,
    message: message.trim(),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json() as { id: string }
  const { error } = await supabaseAdmin()
    .from('family_alerts')
    .update({ dismissed: true, dismissed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', session.supabaseUserId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
