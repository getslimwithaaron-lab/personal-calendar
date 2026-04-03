export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: [
    // Only protect dashboard routes, not public pages
    '/week/:path*',
    '/day/:path*',
    '/month/:path*',
    '/agenda/:path*',
    '/settings/:path*',
    '/alert/:path*',
  ],
}
