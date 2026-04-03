import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Public routes — no auth required
  const publicPaths = ['/', '/login', '/signup', '/onboarding', '/invite', '/api/signup', '/api/invite', '/api/auth', '/api/billing/webhook']
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (isPublic) return NextResponse.next()

  // Protected routes — redirect to login if no session
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)'],
}
