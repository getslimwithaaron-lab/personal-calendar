'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { startOfToday, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, subDays, addMonths, subMonths } from 'date-fns'
import { CalendarEvent } from '@/types'

interface CalendarContextValue {
  currentDate: Date
  setCurrentDate: (d: Date) => void
  goToday: () => void
  goPrev: (view: string) => void
  goNext: (view: string) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (e: CalendarEvent | null) => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(startOfToday)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const goToday = useCallback(() => setCurrentDate(startOfToday()), [])

  const goPrev = useCallback((view: string) => {
    setCurrentDate(prev => {
      if (view === 'month') return subMonths(prev, 1)
      if (view === 'day') return subDays(prev, 1)
      return subWeeks(prev, 1)
    })
  }, [])

  const goNext = useCallback((view: string) => {
    setCurrentDate(prev => {
      if (view === 'month') return addMonths(prev, 1)
      if (view === 'day') return addDays(prev, 1)
      return addWeeks(prev, 1)
    })
  }, [])

  return (
    <CalendarContext.Provider value={{
      currentDate, setCurrentDate,
      goToday, goPrev, goNext,
      selectedEvent, setSelectedEvent,
      drawerOpen, setDrawerOpen,
    }}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendarContext() {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendarContext must be inside CalendarProvider')
  return ctx
}
