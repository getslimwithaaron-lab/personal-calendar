import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes — never require auth
  const publicPaths = ['/', '/login', '/signup', '/onboarding', '/invite', '/admin']
  const publicPrefixes = ['/api/signup', '/api/invite', '/api/auth', '/api/billing/webhook', '/api/admin']

  // Root path check (pathname could be "/" or "")
  if (pathname === '/' || pathname === '') return NextResponse.next()

  const isPublic = publicPaths.includes(pathname)
    || publicPrefixes.some(p => pathname.startsWith(p))
    || pathname.startsWith('/invite/')

  if (isPublic) return NextResponse.next()

  // Check for session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)'],
}
