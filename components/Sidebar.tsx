'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/week',    label: 'Week',    icon: WeekIcon },
  { href: '/day',     label: 'Day',     icon: DayIcon },
  { href: '/month',   label: 'Month',   icon: MonthIcon },
  { href: '/agenda',  label: 'Agenda',  icon: AgendaIcon },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
] as const

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <nav
        className={`
          hidden md:flex flex-col shrink-0 bg-slate-900 border-r border-slate-800 h-full
          transition-[width] duration-200 ease-in-out
          ${collapsed ? 'w-16' : 'w-56'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 h-14 border-b border-slate-800">
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0 hover:bg-blue-500 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            C
          </button>
          {!collapsed && (
            <span className="text-sm font-semibold text-white tracking-tight whitespace-nowrap overflow-hidden">
              Calendar
            </span>
          )}
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col gap-1 py-3 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`
                  flex items-center rounded-lg text-sm font-medium
                  transition-colors min-h-[44px]
                  ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}
                  ${active
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile bottom nav bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 safe-bottom">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg min-w-[48px] min-h-[44px]
                  ${active ? 'text-blue-400' : 'text-slate-500'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function WeekIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16M15 4v16" />
    </svg>
  )
}

function DayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M5 10h14" />
      <path d="M12 14h0" strokeLinecap="round" strokeWidth={2} />
    </svg>
  )
}

function MonthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16M15 4v16M3 15h18" />
    </svg>
  )
}

function AgendaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
