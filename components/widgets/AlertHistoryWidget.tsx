'use client'

import { format } from 'date-fns'
import { useAlerts } from '@/hooks/useAlerts'

export function AlertHistoryWidget() {
  const { alerts } = useAlerts()

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-slate-800/50 shrink-0 flex items-center justify-between">
        <span className="text-xs text-slate-500">{alerts.length} alerts</span>
        <span className="text-[10px] text-slate-600">Send from /alert on phone</span>
      </div>
      <div className="flex-1 overflow-y-auto scroll-container">
        {alerts.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-600">
            No alerts yet. Open <span className="text-blue-400">/alert</span> on your phone to send one.
          </div>
        )}
        {alerts.map(a => (
          <div key={a.id} className={`px-3 py-2 border-b border-slate-800/10 min-h-[48px] ${a.dismissed ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-2">
              <span className="text-sm shrink-0">{a.dismissed ? '✓' : '🔔'}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${a.dismissed ? 'text-slate-500' : 'text-white font-medium'}`}>
                  {a.message}
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  {a.sender_name} · {format(new Date(a.created_at), 'MMM d, h:mm a')}
                  {a.dismissed && ' · Dismissed'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
