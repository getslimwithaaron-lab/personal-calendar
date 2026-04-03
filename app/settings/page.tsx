'use client'

import { useSettings } from '@/hooks/useSettings'
import { signOut } from 'next-auth/react'

export default function SettingsPage() {
  const { settings, isLoading, updateSettings } = useSettings()

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading settings...</div>
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Theme */}
      <Section title="Appearance">
        <Label text="Theme">
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
            className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 text-white border border-slate-700 outline-none min-h-[36px]"
          >
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </Label>
      </Section>

      {/* Calendar */}
      <Section title="Calendar">
        <Label text="Default view">
          <select
            value={settings.defaultView}
            onChange={(e) => updateSettings({ defaultView: e.target.value as 'week' | 'day' | 'month' | 'agenda' })}
            className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 text-white border border-slate-700 outline-none min-h-[36px]"
          >
            <option value="week">Week</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="agenda">Agenda</option>
          </select>
        </Label>

        <Label text="Week starts on">
          <select
            value={settings.firstDayOfWeek}
            onChange={(e) => updateSettings({ firstDayOfWeek: Number(e.target.value) as 0 | 1 })}
            className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 text-white border border-slate-700 outline-none min-h-[36px]"
          >
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
          </select>
        </Label>

        <Label text="Working hours">
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={settings.workingHoursStart}
              onChange={(e) => updateSettings({ workingHoursStart: e.target.value })}
              className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 text-white border border-slate-700 outline-none w-28 min-h-[36px]"
            />
            <span className="text-slate-500">to</span>
            <input
              type="time"
              value={settings.workingHoursEnd}
              onChange={(e) => updateSettings({ workingHoursEnd: e.target.value })}
              className="bg-slate-800 text-sm rounded-lg px-2 py-1.5 text-white border border-slate-700 outline-none w-28 min-h-[36px]"
            />
          </div>
        </Label>
      </Section>

      {/* Features */}
      <Section title="Features">
        <Toggle label="Show weather" checked={settings.showWeather} onChange={(v) => updateSettings({ showWeather: v })} />
        <Toggle label="Show ideal week" checked={settings.showIdealWeek} onChange={(v) => updateSettings({ showIdealWeek: v })} />
      </Section>

      {/* Account */}
      <Section title="Account">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full py-2.5 rounded-xl bg-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/30 min-h-[44px]"
        >
          Sign Out
        </button>
      </Section>

      {/* Discreet exit fullscreen button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen()
            }
          }}
          className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors px-2 py-1"
        >
          Exit Full Screen
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-slate-400 mb-3">{title}</h2>
      <div className="space-y-3 bg-slate-900 rounded-xl p-4">{children}</div>
    </div>
  )
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-300">{text}</span>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative min-h-[24px] ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
