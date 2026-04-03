'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  trialUsers: number
  paidUsers: number
  mrr: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin')
        if (res.status === 403) {
          setError('Access denied')
          setLoading(false)
          return
        }
        if (!res.ok) {
          setError('Failed to load stats')
          setLoading(false)
          return
        }
        const data = await res.json()
        setStats(data)
      } catch {
        setError('Failed to load stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-xl font-semibold">{error}</p>
          <Link href="/week" className="text-blue-400 hover:text-blue-300 underline">
            Back to Calendar
          </Link>
        </div>
      </div>
    )
  }

  const cards = [
    { label: 'Total Signups', value: stats?.totalUsers ?? 0 },
    { label: 'Active Trials', value: stats?.trialUsers ?? 0 },
    { label: 'Paid Subscribers', value: stats?.paidUsers ?? 0 },
    {
      label: 'Monthly Revenue',
      value: `$${(stats?.mrr ?? 0).toFixed(2)}`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <Link
            href="/week"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Back to Calendar
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <p className="text-slate-400 text-sm font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
