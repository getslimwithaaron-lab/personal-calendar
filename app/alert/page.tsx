'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'

const QUICK_ALERTS = [
  "I'm on my way home",
  'Call me now',
  'Dinner is ready',
  'Can you pick up the kids?',
  'Running late',
  'Come downstairs',
]

export default function AlertPage() {
  const { data: session, status } = useSession()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (status === 'loading') {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p className="text-slate-400">Loading...</p>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-6 gap-8">
        <div className="text-center">
          <span className="text-5xl">🔔</span>
          <h1 className="text-2xl font-bold text-white mt-4">Family Alert</h1>
          <p className="text-slate-400 mt-2">Sign in to send alerts to the family display</p>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/alert' })}
          className="flex items-center gap-3 px-6 py-4 bg-white text-slate-800 font-semibold rounded-2xl shadow-lg min-h-[64px] text-lg"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </main>
    )
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    setSending(true)
    setSent(false)
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })
      if (res.ok) {
        setSent(true)
        setMessage('')
        setTimeout(() => setSent(false), 3000)
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white safe-top safe-bottom">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <div>
          <h1 className="text-lg font-bold">Send Alert</h1>
          <p className="text-xs text-slate-500">Signed in as {session.user?.name ?? session.user?.email}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Success banner */}
        {sent && (
          <div className="bg-green-600/20 border border-green-600/40 rounded-xl px-4 py-3 text-green-400 text-center font-medium min-h-[52px] flex items-center justify-center">
            Alert sent to the display!
          </div>
        )}

        {/* Message input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your alert message..."
          rows={3}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg text-white placeholder-slate-600 outline-none focus:border-blue-500 resize-none min-h-[120px]"
        />

        {/* Send button */}
        <button
          onClick={() => handleSend(message)}
          disabled={!message.trim() || sending}
          className="w-full py-4 rounded-xl bg-blue-600 text-white text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 active:scale-[0.98] transition-transform min-h-[64px]"
        >
          {sending ? 'Sending...' : 'Send Alert'}
        </button>

        {/* Quick alerts */}
        <div className="mt-2">
          <p className="text-xs text-slate-500 mb-2 uppercase font-semibold tracking-wider">Quick Alerts</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ALERTS.map(text => (
              <button
                key={text}
                onClick={() => handleSend(text)}
                disabled={sending}
                className="px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 text-left hover:bg-slate-800 active:scale-[0.98] transition-transform disabled:opacity-40 min-h-[52px]"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
