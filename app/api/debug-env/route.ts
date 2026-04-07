import { NextResponse } from 'next/server'

export async function GET() {
  let authError = 'none'
  let oidcTest = 'not tested'
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    authError = session ? 'has session' : 'no session (but auth loaded OK)'
  } catch (err) {
    authError = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  }

  // Test OIDC discovery
  try {
    const res = await fetch('https://accounts.google.com/.well-known/openid-configuration')
    oidcTest = res.ok ? `OK (${res.status})` : `FAILED (${res.status})`
  } catch (err) {
    oidcTest = err instanceof Error ? `FETCH ERROR: ${err.message}` : String(err)
  }

  return NextResponse.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `set (${process.env.GOOGLE_CLIENT_ID.length} chars, starts: ${process.env.GOOGLE_CLIENT_ID.substring(0, 10)})` : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? `set (${process.env.GOOGLE_CLIENT_SECRET.length} chars)` : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'set' : 'MISSING',
    authError,
    oidcTest,
  })
}
