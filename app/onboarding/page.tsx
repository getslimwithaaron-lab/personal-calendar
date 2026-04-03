'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [inviteError, setInviteError] = useState('')

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setInviteStatus('sending')
    setInviteError('')

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setInviteError(data.error || 'Failed to send invite')
        setInviteStatus('error')
        return
      }

      setInviteStatus('sent')
    } catch {
      setInviteError('Something went wrong')
      setInviteStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s === step
                  ? 'bg-blue-500'
                  : s < step
                    ? 'bg-blue-400'
                    : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Connect Calendar */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Connect Your Calendar</h1>
              <p className="mt-2 text-slate-400">
                Import your existing events to get started
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
                className="w-full min-h-[56px] rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-medium text-lg transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Connect Google Calendar
              </button>

              <button
                onClick={() => signIn('azure-ad', { callbackUrl: '/onboarding' })}
                className="w-full min-h-[56px] rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-medium text-lg transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#00A4EF" d="M1 13h10v10H1z" />
                  <path fill="#7FBA00" d="M13 1h10v10H13z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                Connect Microsoft Calendar
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 2: Invite Family */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Invite a Family Member</h1>
              <p className="mt-2 text-slate-400">
                Share your calendar with someone you love
              </p>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-3 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {inviteStatus === 'sent' && (
                <p className="text-green-400 text-sm">Invite sent successfully!</p>
              )}
              {inviteStatus === 'error' && (
                <p className="text-red-400 text-sm">{inviteError}</p>
              )}

              <button
                type="submit"
                disabled={inviteStatus === 'sending'}
                className="w-full min-h-[56px] rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
              >
                {inviteStatus === 'sending' ? 'Sending...' : 'Send Invite'}
              </button>
            </form>

            <button
              onClick={() => setStep(3)}
              className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 3: All Set */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-6xl mb-4">&#127881;</div>
              <h1 className="text-3xl font-bold text-white">You&apos;re All Set!</h1>
              <p className="mt-2 text-slate-400">
                Your family calendar is ready to go
              </p>
            </div>

            <Link
              href="/week"
              className="block w-full min-h-[56px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-colors flex items-center justify-center"
            >
              Go to My Calendar
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
