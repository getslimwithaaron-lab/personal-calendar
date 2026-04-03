// app/api/calendars/outlook/disconnect/route.ts
// DELETE — remove an Outlook calendar connection from Supabase

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const connectionId = searchParams.get('connectionId')
    if (!connectionId) {
      return NextResponse.json({ error: 'connectionId required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('calendar_connections')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', session.supabaseUserId)  // enforce ownership
      .eq('provider', 'outlook')

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[outlook/disconnect] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
