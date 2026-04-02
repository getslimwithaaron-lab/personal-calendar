// app/api/calendars/google/connect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { accountEmail, accessToken, refreshToken, tokenExpiry, calendarId, calendarName, color } =
      await req.json() as {
        accountEmail: string; accessToken: string; refreshToken: string
        tokenExpiry: string; calendarId: string; calendarName: string; color: string
      }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('calendar_connections')
      .upsert({
        user_id: session.supabaseUserId, provider: 'google',
        account_email: accountEmail, access_token: accessToken,
        refresh_token: refreshToken, token_expiry: tokenExpiry,
        calendar_id: calendarId, calendar_name: calendarName,
        color: color ?? '#4285F4', active: true,
      }, { onConflict: 'user_id,provider,account_email' })
      .select('id').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ connectionId: data.id })
  } catch (err) {
    console.error('[google/connect]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
