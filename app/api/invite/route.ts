import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { addInviteContact } from '@/lib/emailoctopus'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Send invite to a family member
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Check if user is an owner
  const { data: owner } = await getSupabase()
    .from('users')
    .select('id, role, family_id')
    .eq('id', session.user.id)
    .single()

  if (!owner || owner.role !== 'owner') {
    return NextResponse.json({ error: 'Only account owners can invite members' }, { status: 403 })
  }

  // Check if already has a family member
  const familyId = owner.family_id || owner.id
  const { count } = await getSupabase()
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('family_id', familyId)

  if ((count || 0) >= 2) {
    return NextResponse.json({ error: 'Maximum of 2 family members reached' }, { status: 400 })
  }

  // Create invite token
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 day expiry

  // Ensure owner has family_id set
  if (!owner.family_id) {
    await getSupabase().from('users').update({ family_id: owner.id }).eq('id', owner.id)
  }

  const { error } = await getSupabase().from('invites').insert({
    token,
    inviter_id: owner.id,
    family_id: familyId,
    email: email.toLowerCase(),
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error('Invite error:', error)
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const inviteLink = `${baseUrl}/invite/${token}`

  // Send invite email via EmailOctopus (non-blocking)
  const inviterName = session.user.name || session.user.email || 'A family member'
  addInviteContact(email, inviteLink, inviterName).catch((err) =>
    console.error('EmailOctopus invite error:', err)
  )

  return NextResponse.json({ success: true, inviteLink })
}

// List pending invites
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await getSupabase()
    .from('invites')
    .select('*')
    .eq('inviter_id', session.user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}
