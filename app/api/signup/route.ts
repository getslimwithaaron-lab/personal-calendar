import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { addSignupContact } from '@/lib/emailoctopus'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existing } = await getSupabase()
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Calculate trial end date (14 days from now)
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14)

    // Create user
    const { data: user, error } = await getSupabase()
      .from('users')
      .insert({
        email: email.toLowerCase(),
        name,
        password_hash: passwordHash,
        role: 'owner',
        subscription_status: 'trialing',
        trial_ends_at: trialEnd.toISOString(),
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    // Create default app_settings for user
    await getSupabase().from('app_settings').insert({
      user_id: user.id,
      theme: 'dark',
      default_view: 'week',
      first_day_of_week: 0,
      working_hours_start: '08:00',
      working_hours_end: '18:00',
      show_weather: true,
      show_ideal_week: false,
    })

    // Add to EmailOctopus list (non-blocking — don't fail signup if email service is down)
    addSignupContact(email, name).catch((err) =>
      console.error('EmailOctopus signup error:', err)
    )

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Signup error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
