'use client'

import { useMemo } from 'react'
import { startOfWeek, addDays, format } from 'date-fns'
import { useMeals } from '@/hooks/useWidgetData'
import { useCalendarContext } from '@/components/CalendarProvider'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MealPlannerWidget() {
  const { currentDate } = useCalendarContext()
  const weekStart = useMemo(() => format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'), [currentDate])
  const { meals, setMeal } = useMeals(weekStart)
  const todayDow = new Date().getDay()

  const getMeal = (dow: number) => meals.find(m => m.day_of_week === dow)?.meal ?? ''

  return (
    <div className="flex flex-col h-full">
      {/* Today's meal prominently */}
      <div className="px-3 py-3 bg-blue-600/10 border-b border-slate-800/50 shrink-0">
        <div className="text-[10px] text-blue-400 uppercase font-semibold">Tonight&apos;s Dinner</div>
        <div className="text-lg font-semibold text-white mt-0.5 min-h-[28px]">
          {getMeal(todayDow) || <span className="text-slate-600 text-sm">Not planned yet</span>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scroll-container">
        {DAYS.map((label, dow) => {
          const isToday = dow === todayDow
          return (
            <div key={dow} className={`flex items-center gap-2 px-3 py-1.5 border-b border-slate-800/20 min-h-[48px] ${isToday ? 'bg-blue-600/5' : ''}`}>
              <span className={`text-xs font-medium w-8 shrink-0 ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>{label}</span>
              <input
                value={getMeal(dow)}
                onChange={(e) => setMeal(dow, e.target.value)}
                placeholder="What's for dinner?"
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-700 outline-none min-h-[36px]"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
