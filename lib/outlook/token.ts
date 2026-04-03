// lib/outlook/token.ts
// Handles Microsoft OAuth token refresh and Supabase connection updates

import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Refresh a Microsoft access token using the stored refresh token.
// Updates the connection row in Supabase and returns the new access token.
export async function refreshOutlookToken(connectionId: string): Promise<string> {
  const supabase = getSupabaseAdmin()

  const { data: conn, error } = await supabase
    .from('calendar_connections')
    .select('refresh_token')
    .eq('id', connectionId)
    .single()

  if (error || !conn) throw new Error('Connection not found')

  const params = new URLSearchParams({
    client_id:     process.env.AZURE_AD_CLIENT_ID!,
    client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
    refresh_token: conn.refresh_token,
    grant_type:    'refresh_token',
    scope:         'Calendars.ReadWrite offline_access',
  })

  const tenantId = process.env.AZURE_AD_TENANT_ID ?? 'common'
  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
    }
  )

  if (!res.ok) throw new Error(`Outlook token refresh failed: ${res.status}`)
  const data = await res.json() as { access_token: string; expires_in: number; refresh_token?: string }

  const expiry = new Date(Date.now() + data.expires_in * 1000).toISOString()
  const update: Record<string, string> = {
    access_token: data.access_token,
    token_expiry: expiry,
  }
  if (data.refresh_token) update.refresh_token = data.refresh_token

  await supabase.from('calendar_connections').update(update).eq('id', connectionId)
  return data.access_token
}

// Return a valid access token — refresh silently if expiring within 5 minutes.
export async function getValidOutlookToken(
  connectionId: string,
  currentToken: string,
  tokenExpiry: string
): Promise<string> {
  const expiresAt   = new Date(tokenExpiry).getTime()
  const fiveMinutes = 5 * 60 * 1000
  if (Date.now() + fiveMinutes < expiresAt) return currentToken
  return refreshOutlookToken(connectionId)
}
