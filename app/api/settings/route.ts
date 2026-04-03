// app/api/settings/route.ts
// Get and update app settings

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
    .from('app_settings')
    .select('*')
    .eq('user_id', session.supabaseUserId)
    .single()

  if (!data) {
    // Create default settings
    const { data: created } = await sb().from('app_settings').insert({
      user_id: session.supabaseUserId,
    }).select().single()
    return NextResponse.json({ settings: mapSettings(created) })
  }

  return NextResponse.json({ settings: mapSettings(data) })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.supabaseUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const dbUpdates: Record<string, unknown> = {}

  if (body.theme !== undefined) dbUpdates.theme = body.theme
  if (body.firstDayOfWeek !== undefined) dbUpdates.first_day_of_week = body.firstDayOfWeek
  if (body.defaultView !== undefined) dbUpdates.default_view = body.defaultView
  if (body.workingHoursStart !== undefined) dbUpdates.working_hours_start = body.workingHoursStart
  if (body.workingHoursEnd !== undefined) dbUpdates.working_hours_end = body.workingHoursEnd
  if (body.showWeather !== undefined) dbUpdates.show_weather = body.showWeather
  if (body.showIdealWeek !== undefined) dbUpdates.show_ideal_week = body.showIdealWeek
  if (body.weatherLat !== undefined) dbUpdates.weather_lat = body.weatherLat
  if (body.weatherLng !== undefined) dbUpdates.weather_lng = body.weatherLng
  dbUpdates.updated_at = new Date().toISOString()

  const { error } = await sb()
    .from('app_settings')
    .update(dbUpdates)
    .eq('user_id', session.supabaseUserId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

function mapSettings(data: Record<string, unknown> | null) {
  if (!data) return null
  return {
    id: data.id,
    userId: data.user_id,
    theme: data.theme ?? 'system',
    firstDayOfWeek: data.first_day_of_week ?? 0,
    defaultView: data.default_view ?? 'week',
    workingHoursStart: data.working_hours_start ?? '08:00',
    workingHoursEnd: data.working_hours_end ?? '18:00',
    showWeather: data.show_weather ?? true,
    showIdealWeek: data.show_ideal_week ?? true,
    weatherLat: data.weather_lat ?? 39.6133,
    weatherLng: data.weather_lng ?? -104.9873,
  }
}
