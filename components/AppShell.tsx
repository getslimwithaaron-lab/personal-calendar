'use client'

import { useState, useCallback, ReactNode } from 'react'
import { addWeeks, subWeeks, addDays, subDays, addMonths, subMonths, startOfToday } from 'date-fns'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [currentDate, setCurrentDate] = useState(startOfToday)
  const pathname = usePathname()

  const navigate = useCallback((direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(startOfToday())
      return
    }
    const delta = direction === 'next' ? 1 : -1
    setCurrentDate(prev => {
      if (pathname.startsWith('/month')) return addMonths(prev, delta)
      if (pathname.startsWith('/day'))   return addDays(prev, delta)
      return addWeeks(prev, delta)  // week and agenda default to week step
    })
  }, [pathname])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          currentDate={currentDate}
          onToday={() => navigate('today')}
          onPrev={() => navigate('prev')}
          onNext={() => navigate('next')}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
