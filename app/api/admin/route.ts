import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ADMIN_EMAIL = 'getslimwithaaron@gmail.com'

export async function GET() {
  const session = await auth()

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Total users
    const { count: totalUsers } = await getSupabase()
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Trial users
    const { count: trialUsers } = await getSupabase()
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'trialing')

    // Paid users
    const { count: paidUsers } = await getSupabase()
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    const mrr = (paidUsers || 0) * 4.99

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      trialUsers: trialUsers || 0,
      paidUsers: paidUsers || 0,
      mrr,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
