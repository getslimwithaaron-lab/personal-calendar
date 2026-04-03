// app/api/calendars/outlook/connect/route.ts
// POST — save an Outlook calendar connection to Supabase

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      accountEmail: string
      accessToken: string
      refreshToken: string
      tokenExpiry: string
      calendarId?: string
      calendarName?: string
      color?: string
    }

    const { accountEmail, accessToken, refreshToken, tokenExpiry } = body
    if (!accountEmail || !accessToken || !refreshToken || !tokenExpiry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('calendar_connections')
      .insert({
        user_id:       session.supabaseUserId,
        provider:      'outlook',
        account_email: accountEmail,
        access_token:  accessToken,
        refresh_token: refreshToken,
        token_expiry:  tokenExpiry,
        calendar_id:   body.calendarId   ?? 'primary',
        calendar_name: body.calendarName ?? accountEmail,
        color:         body.color        ?? '#0078D4',
        active:        true,
      })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ connectionId: data.id })
  } catch (err) {
    console.error('[outlook/connect] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
