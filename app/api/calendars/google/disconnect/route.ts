// app/api/calendars/google/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const connectionId = searchParams.get('connectionId') ?? ''

    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('calendar_connections')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', session.supabaseUserId)
      .eq('provider', 'google')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[google/disconnect]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
