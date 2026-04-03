import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Root / always goes to /login (auth handled by dashboard layout + login layout)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
  // Allow cross-origin requests from the touch display on the same network
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'graph.microsoft.com' },
    ],
  },
}

export default nextConfig
