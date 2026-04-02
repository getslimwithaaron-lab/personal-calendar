'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

// ── Google SVG icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

// ── Microsoft SVG icon ────────────────────────────────────────────────────────
function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#00A4EF" d="M13 1h10v10H13z"/>
      <path fill="#7FBA00" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  )
}

// ── Sign-in button component ──────────────────────────────────────────────────
function SignInButton({
  provider,
  label,
  icon,
  onClick,
  loading,
}: {
  provider: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  loading: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-4 w-full max-w-sm px-6 bg-white text-slate-800 font-semibold rounded-2xl
                 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg shadow-black/30"
      style={{ minHeight: '72px', fontSize: '18px' }}
      aria-label={`Sign in with ${provider}`}
    >
      {icon}
      <span className="flex-1 text-left">{loading ? 'Signing in…' : label}</span>
    </button>
  )
}

// ── Login page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  async function handleSignIn(provider: string) {
    setLoadingProvider(provider)
    try {
      await signIn(provider, { callbackUrl: '/week' })
    } catch {
      setLoadingProvider(null)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-8 gap-10">
      {/* App name */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">Calendar</h1>
        <p className="text-slate-400 mt-2 text-lg">Personal dashboard</p>
      </div>

      {/* Sign-in buttons */}
      <div className="flex flex-col items-center gap-4 w-full">
        <SignInButton
          provider="google"
          label="Sign in with Google"
          icon={<GoogleIcon />}
          onClick={() => handleSignIn('google')}
          loading={loadingProvider === 'google'}
        />
        <SignInButton
          provider="microsoft"
          label="Sign in with Microsoft"
          icon={<MicrosoftIcon />}
          onClick={() => handleSignIn('microsoft-entra-id')}
          loading={loadingProvider === 'microsoft-entra-id'}
        />
      </div>

      {/* Footer note */}
      <p className="text-slate-600 text-sm text-center">
        Personal use only · Aaron&apos;s calendar dashboard
      </p>
    </main>
  )
}
