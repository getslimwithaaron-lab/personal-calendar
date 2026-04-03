import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Personal calendar dashboard',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${geist.className} antialiased bg-slate-950 text-white`}>
        <SessionProvider>
          {children}
          <ServiceWorkerRegister />
        </SessionProvider>
      </body>
    </html>
  )
}
