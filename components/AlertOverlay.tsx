'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { format } from 'date-fns'
import { useAlerts, FamilyAlert } from '@/hooks/useAlerts'

export function AlertOverlay() {
  const { undismissed, dismissAlert } = useAlerts()

  // Show the oldest undismissed alert first (stack: one at a time)
  const currentAlert = undismissed.length > 0 ? undismissed[undismissed.length - 1] : null

  if (!currentAlert) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <AlertCard
        alert={currentAlert}
        remaining={undismissed.length}
        onDismiss={() => dismissAlert(currentAlert.id)}
      />
    </div>
  )
}

function AlertCard({
  alert,
  remaining,
  onDismiss,
}: {
  alert: FamilyAlert
  remaining: number
  onDismiss: () => void
}) {
  const [holdProgress, setHoldProgress] = useState(0)
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStart = useRef(0)

  const startHold = useCallback(() => {
    holdStart.current = Date.now()
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - holdStart.current
      const progress = Math.min(1, elapsed / 2000)
      setHoldProgress(progress)
      if (progress >= 1) {
        if (holdTimer.current) clearInterval(holdTimer.current)
        onDismiss()
      }
    }, 30)
  }, [onDismiss])

  const stopHold = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current)
    holdTimer.current = null
    setHoldProgress(0)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (holdTimer.current) clearInterval(holdTimer.current)
    }
  }, [])

  const createdAt = new Date(alert.created_at)

  return (
    <div className="w-full max-w-2xl mx-4 bg-slate-900 border-2 border-blue-500 rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔔</span>
          <div>
            <div className="text-white font-bold text-lg">Family Alert</div>
            <div className="text-blue-200 text-sm">
              From {alert.sender_name} · {format(createdAt, 'h:mm a')}
            </div>
          </div>
        </div>
        {remaining > 1 && (
          <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {remaining} alerts
          </div>
        )}
      </div>

      {/* Message */}
      <div className="px-8 py-10">
        <p className="text-white text-3xl sm:text-4xl font-bold text-center leading-tight">
          {alert.message}
        </p>
      </div>

      {/* Dismiss button — hold for 2 seconds */}
      <div className="px-6 pb-6">
        <button
          onPointerDown={startHold}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          className="relative w-full py-5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-lg font-semibold overflow-hidden touch-none select-none min-h-[80px]"
        >
          {/* Progress fill */}
          <div
            className="absolute inset-0 bg-green-600/30 transition-none"
            style={{ width: `${holdProgress * 100}%` }}
          />
          <span className="relative z-10">
            {holdProgress > 0
              ? holdProgress >= 1
                ? 'Dismissed!'
                : 'Hold to dismiss...'
              : 'Hold to Dismiss'}
          </span>
        </button>
        <p className="text-center text-xs text-slate-600 mt-2">
          Press and hold for 2 seconds to dismiss
        </p>
      </div>
    </div>
  )
}
