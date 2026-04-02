import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import { createClient } from '@supabase/supabase-js'

// ── Supabase admin (service role) — server only, never exposed to client ──────
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── Upsert user row on first sign-in ─────────────────────────────────────────
async function upsertUser(email: string, name: string | null | undefined) {
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('users').upsert(
      { email, name: name ?? '', timezone: 'America/Denver' },
      { onConflict: 'email', ignoreDuplicates: false }
    )
    if (error) console.error('[auth] upsertUser error:', error.message)
  } catch (err) {
    console.error('[auth] upsertUser exception:', err)
  }
}

// ── Get Supabase user UUID by email ───────────────────────────────────────────
async function getSupabaseUserId(email: string): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    if (error) return null
    return data?.id ?? null
  } catch {
    return null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ── Custom pages ────────────────────────────────────────────────────────────
  pages: {
    signIn: '/login',
    error: '/login',
  },

  // ── Providers ───────────────────────────────────────────────────────────────
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID ?? 'common'}/v2.0`,
      authorization: {
        params: {
          scope: 'openid email profile Calendars.ReadWrite offline_access',
        },
      },
    }),
  ],

  // ── Callbacks ────────────────────────────────────────────────────────────────
  callbacks: {
    // Runs on every sign-in — create/update user row in Supabase
    async signIn({ user }) {
      if (!user.email) return false
      await upsertUser(user.email, user.name)
      return true
    },

    // Runs after signIn and on every request — build the JWT payload
    async jwt({ token, account, user }) {
      // First sign-in: account + user are populated
      if (account && user) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
        token.expiresAt = account.expires_at  // Unix seconds
        // Fetch Supabase UUID and store in token
        if (user.email) {
          token.supabaseUserId = (await getSupabaseUserId(user.email)) ?? undefined
        }
      }
      return token
    },

    // Runs on every useSession() / getSession() — expose fields to client
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.provider = token.provider
      session.supabaseUserId = token.supabaseUserId
      session.expiresAt = token.expiresAt
      return session
    },
  },

  // ── Session strategy: JWT (no DB adapter needed) ──────────────────────────
  session: { strategy: 'jwt' },
})
