// lib/google/token.ts
// Handles Google OAuth token refresh and Supabase connection updates

import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Refresh a Google access token using the stored refresh token.
// Updates the connection row in Supabase and returns the new access token.
export async function refreshGoogleToken(connectionId: string): Promise<string> {
  const supabase = getSupabaseAdmin()

  const { data: conn, error } = await supabase
    .from('calendar_connections')
    .select('refresh_token')
    .eq('id', connectionId)
    .single()

  if (error || !conn) throw new Error('Connection not found')

  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: conn.refresh_token,
    grant_type:    'refresh_token',
  })

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
  const data = await res.json() as { access_token: string; expires_in: number }

  const expiry = new Date(Date.now() + data.expires_in * 1000).toISOString()
  await supabase.from('calendar_connections').update({
    access_token: data.access_token,
    token_expiry: expiry,
  }).eq('id', connectionId)

  return data.access_token
}

// Return a valid access token — refresh if expiring within 5 minutes.
export async function getValidGoogleToken(
  connectionId: string,
  currentToken: string,
  tokenExpiry: string
): Promise<string> {
  const expiresAt = new Date(tokenExpiry).getTime()
  const fiveMinutes = 5 * 60 * 1000
  if (Date.now() + fiveMinutes < expiresAt) return currentToken
  return refreshGoogleToken(connectionId)
}
