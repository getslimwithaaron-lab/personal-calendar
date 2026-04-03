'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { CalendarProvider, useCalendarContext } from './CalendarProvider'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CalendarProvider>
      <ShellInner>{children}</ShellInner>
    </CalendarProvider>
  )
}

function ShellInner({ children }: { children: ReactNode }) {
  const { currentDate, goToday, goPrev, goNext } = useCalendarContext()
  const pathname = usePathname()
  const view = pathname.split('/')[1] || 'week'

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          currentDate={currentDate}
          onToday={goToday}
          onPrev={() => goPrev(view)}
          onNext={() => goNext(view)}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
