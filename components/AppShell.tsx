'use client'

import { ReactNode, useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CalendarProvider, useCalendarContext } from './CalendarProvider'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { EventDrawer } from './EventDrawer'
import { QuickAdd } from './QuickAdd'
import { TaskSidebar } from './TaskSidebar'
import { WidgetManager } from './WidgetManager'
import { AlertOverlay } from './AlertOverlay'

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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [taskSidebarOpen, setTaskSidebarOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key === 'F4') {
        e.preventDefault()
        window.close()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleQuickAdd = useCallback(async (event: { title: string; start: Date; end: Date; allDay: boolean }) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
          allDay: event.allDay,
        }),
      })
      window.dispatchEvent(new Event('calendar-refresh'))
    } catch {
      // silently fail
    }
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        <Topbar
          currentDate={currentDate}
          onToday={goToday}
          onPrev={() => goPrev(view)}
          onNext={() => goNext(view)}
          onToggleTasks={() => setTaskSidebarOpen(o => !o)}
          taskSidebarOpen={taskSidebarOpen}
        />

        {/* QuickAdd bar */}
        {view !== 'settings' && (
          <div className="px-2 sm:px-4 py-2 border-b border-slate-800/50 shrink-0">
            <QuickAdd onAdd={handleQuickAdd} />
          </div>
        )}

        {/* Calendar view content */}
        <main className="flex-1 overflow-auto pb-14 md:pb-0 min-h-0">
          {children}
        </main>

        {/* Floating widget layer — overlays on top of the calendar */}
        {view !== 'settings' && (
          <div className="absolute inset-0 top-[112px] pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
            <div className="relative w-full h-full pointer-events-auto">
              <WidgetManager />
            </div>
          </div>
        )}
      </div>

      {/* Task sidebar */}
      <TaskSidebar open={taskSidebarOpen} onClose={() => setTaskSidebarOpen(false)} />

      {/* Event detail drawer */}
      <EventDrawer />

      {/* Family alert overlay — shows on top of everything */}
      <AlertOverlay />
    </div>
  )
}
