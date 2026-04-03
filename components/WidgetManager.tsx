'use client'

import { useState, useCallback, useMemo } from 'react'
import { FloatingWidget } from './widgets/FloatingWidget'
import { useWidgetLayouts, WidgetLayout } from '@/hooks/useWidgetData'

// Widget content imports
import { NotesWidget } from './widgets/NotesWidget'
import { ToDoWidget } from './widgets/ToDoWidget'
import { WeatherWidget } from './widgets/WeatherWidget'
import { MiniCalendarWidget } from './widgets/MiniCalendarWidget'
import { GroceryWidget } from './widgets/GroceryWidget'
import { MealPlannerWidget } from './widgets/MealPlannerWidget'
import { RecipeBoxWidget } from './widgets/RecipeBoxWidget'
import { ChoreChartWidget } from './widgets/ChoreChartWidget'
import { BirthdayWidget } from './widgets/BirthdayWidget'
import { CountdownWidget } from './widgets/CountdownWidget'
import { ExpenseWidget } from './widgets/ExpenseWidget'
import { ContactsWidget } from './widgets/ContactsWidget'
import { AlertHistoryWidget } from './widgets/AlertHistoryWidget'

// ── Widget registry ──────────────────────────────────────────────────────────
interface WidgetDef {
  key: string
  title: string
  icon: string
  defaultW: number
  defaultH: number
  component: () => React.JSX.Element
}

const WIDGET_DEFS: WidgetDef[] = [
  { key: 'notes',       title: 'Notes',            icon: '📝', defaultW: 360, defaultH: 300, component: () => <NotesWidget /> },
  { key: 'todo',        title: 'To Do',            icon: '✅', defaultW: 480, defaultH: 360, component: () => <ToDoWidget /> },
  { key: 'weather',     title: '7-Day Forecast',   icon: '🌤', defaultW: 520, defaultH: 200, component: () => <WeatherWidget /> },
  { key: 'calendar',    title: 'Mini Calendar',    icon: '📅', defaultW: 280, defaultH: 320, component: () => <MiniCalendarWidget /> },
  { key: 'grocery',     title: 'Grocery List',     icon: '🛒', defaultW: 340, defaultH: 380, component: () => <GroceryWidget /> },
  { key: 'meals',       title: 'Meal Planner',     icon: '🍽', defaultW: 340, defaultH: 400, component: () => <MealPlannerWidget /> },
  { key: 'recipes',     title: 'Recipe Box',       icon: '📖', defaultW: 380, defaultH: 400, component: () => <RecipeBoxWidget /> },
  { key: 'chores',      title: 'Chore Chart',      icon: '🧹', defaultW: 380, defaultH: 360, component: () => <ChoreChartWidget /> },
  { key: 'birthdays',   title: 'Birthday Tracker', icon: '🎂', defaultW: 340, defaultH: 360, component: () => <BirthdayWidget /> },
  { key: 'countdowns',  title: 'Event Countdown',  icon: '⏳', defaultW: 360, defaultH: 340, component: () => <CountdownWidget /> },
  { key: 'expenses',    title: 'Expense Tracker',  icon: '💰', defaultW: 380, defaultH: 400, component: () => <ExpenseWidget /> },
  { key: 'contacts',    title: 'Family Contacts',  icon: '👥', defaultW: 340, defaultH: 380, component: () => <ContactsWidget /> },
  { key: 'alerts',      title: 'Alert History',    icon: '🔔', defaultW: 360, defaultH: 340, component: () => <AlertHistoryWidget /> },
]

// Default visible widgets for first-time users
const DEFAULT_VISIBLE = ['notes', 'todo', 'weather', 'calendar']

export function WidgetManager() {
  const { layouts, loaded, saveLayout } = useWidgetLayouts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [maxZ, setMaxZ] = useState(100)

  // Compute active layouts — merge saved with defaults
  const activeLayouts = useMemo(() => {
    if (!loaded) return []
    const result: (WidgetLayout & { def: WidgetDef })[] = []
    let col = 0
    for (const def of WIDGET_DEFS) {
      const saved = layouts.get(def.key)
      if (saved) {
        result.push({ ...saved, def })
      } else if (DEFAULT_VISIBLE.includes(def.key)) {
        result.push({
          widget_key: def.key,
          x: 20 + col * 30,
          y: 20 + col * 20,
          w: def.defaultW,
          h: def.defaultH,
          collapsed: false,
          visible: true,
          z_index: col + 1,
          def,
        })
        col++
      } else {
        result.push({
          widget_key: def.key,
          x: 100 + col * 30,
          y: 100 + col * 20,
          w: def.defaultW,
          h: def.defaultH,
          collapsed: false,
          visible: false,
          z_index: 1,
          def,
        })
      }
    }
    return result
  }, [layouts, loaded])

  const bringToFront = useCallback((key: string) => {
    const next = maxZ + 1
    setMaxZ(next)
    const existing = activeLayouts.find(l => l.widget_key === key)
    if (existing) {
      const { def: _d, ...rest } = existing as typeof existing & { def: unknown }
      void _d
      saveLayout({ ...rest, z_index: next })
    }
  }, [maxZ, activeLayouts, saveLayout])

  const updateWidget = useCallback((key: string, updates: Partial<WidgetLayout>) => {
    const existing = activeLayouts.find(l => l.widget_key === key)
    if (!existing) return
    const updated = { ...existing, ...updates, widget_key: key }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { def, ...toSave } = updated as typeof updated & { def: WidgetDef }
    saveLayout(toSave)
  }, [activeLayouts, saveLayout])

  const toggleWidget = useCallback((key: string) => {
    const existing = activeLayouts.find(l => l.widget_key === key)
    if (existing) {
      const next = maxZ + 1
      setMaxZ(next)
      updateWidget(key, { visible: !existing.visible, z_index: next })
    }
  }, [activeLayouts, maxZ, updateWidget])

  if (!loaded) return null

  const visibleWidgets = activeLayouts.filter(l => l.visible)

  return (
    <>
      {/* Floating widgets */}
      {visibleWidgets.map(layout => (
        <FloatingWidget
          key={layout.widget_key}
          title={layout.def.title}
          icon={layout.def.icon}
          x={layout.x}
          y={layout.y}
          w={layout.w}
          h={layout.h}
          collapsed={layout.collapsed}
          zIndex={layout.z_index}
          onMove={(x, y) => updateWidget(layout.widget_key, { x, y })}
          onResize={(w, h) => updateWidget(layout.widget_key, { w, h })}
          onCollapse={(collapsed) => updateWidget(layout.widget_key, { collapsed })}
          onFocus={() => bringToFront(layout.widget_key)}
          onClose={() => updateWidget(layout.widget_key, { visible: false })}
        >
          {layout.def.component()}
        </FloatingWidget>
      ))}

      {/* Widget menu button (fixed bottom-right) */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="fixed bottom-20 md:bottom-4 right-4 z-[9999] w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-black/40 flex items-center justify-center text-xl hover:bg-blue-500 active:scale-95 transition-transform"
        title="Widgets"
      >
        {menuOpen ? '✕' : '⊞'}
      </button>

      {/* Widget menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setMenuOpen(false)} />
          <div className="fixed bottom-36 md:bottom-20 right-4 z-[9999] w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400">Add / Remove Widgets</div>
            <div className="max-h-[400px] overflow-y-auto scroll-container">
              {WIDGET_DEFS.map(def => {
                const layout = activeLayouts.find(l => l.widget_key === def.key)
                const isVisible = layout?.visible ?? false
                return (
                  <button
                    key={def.key}
                    onClick={() => toggleWidget(def.key)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-slate-800/50 min-h-[48px]"
                  >
                    <span className="text-sm">{def.icon}</span>
                    <span className="flex-1 text-sm text-slate-300">{def.title}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isVisible ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                      {isVisible && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
