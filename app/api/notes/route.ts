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
    .from('notes')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .single()

  return NextResponse.json({ content: data?.content ?? '' })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json() as { content: string }

  const { error } = await sb()
    .from('notes')
    .upsert(
      { user_id: session.supabaseUserId, content, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
