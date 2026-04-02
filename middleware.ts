import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// ── Route protection middleware (NextAuth v5) ─────────────────────────────────
// Public paths that don't require a session
const PUBLIC_PATHS = ['/login', '/api/auth']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const isLoggedIn = !!req.auth

  // Not logged in + not a public path → send to /login
  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in + hitting /login → send to /week
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/week', req.nextUrl.origin))
  }

  return NextResponse.next()
})

// Apply to every route EXCEPT Next.js internals and static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.svg|.*\\.png).*)',
  ],
}
