import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user, error } = await getSupabase()
    .from('users')
    .select('subscription_status, trial_ends_at, stripe_customer_id')
    .eq('email', session.user.email)
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    subscription_status: user.subscription_status,
    trial_ends_at: user.trial_ends_at,
    stripe_customer_id: user.stripe_customer_id,
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { plan } = await req.json()

    if (plan !== 'monthly' && plan !== 'yearly') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceAmount = plan === 'monthly' ? 499 : 3900
    const interval = plan === 'monthly' ? 'month' : 'year'

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FamilyCal ${plan === 'monthly' ? 'Monthly' : 'Yearly'} Plan`,
              description: plan === 'monthly'
                ? '$4.99/month - Family calendar for everyone'
                : '$39/year - Save over 30%',
            },
            unit_amount: priceAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/week?billing=success`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/week?billing=canceled`,
      metadata: {
        user_email: session.user.email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
