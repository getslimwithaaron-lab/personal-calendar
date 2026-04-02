// ============================================================
// Core Types — Personal Calendar App
// ============================================================

// ------ Calendar Event (unified across Google + Outlook + local) ------
export interface CalendarEvent {
  id: string
  externalId: string
  source: 'google' | 'outlook' | 'local'
  connectionId: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  color: string
  eventType: 'standard' | 'focus' | 'blocked'
  notes?: string
  location?: string
  recurrenceRule?: string
  timezone: string
}

// ------ Calendar Connection (one row per linked account) ------
export interface CalendarConnection {
  id: string
  userId: string
  provider: 'google' | 'outlook'
  accountEmail: string
  calendarId: string
  calendarName?: string
  color: string
  active: boolean
  tokenExpiry: string
}

// ------ Calendar Set (user-defined filter groups) ------
export interface CalendarSet {
  id: string
  userId: string
  name: string
  includedConnectionIds: string[]
  isDefault: boolean
  sortOrder: number
}

// ------ Task ------
export interface Task {
  id: string
  userId: string
  title: string
  dueDate?: string
  scheduledStart?: string
  scheduledEnd?: string
  completed: boolean
  completedAt?: string
  color?: string
  sortOrder: number
}

// ------ Ideal Week Frame ------
export interface IdealWeekFrame {
  id: string
  userId: string
  title: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  startTime: string   // "HH:mm"
  endTime: string     // "HH:mm"
  color: string
  label?: string
  active: boolean
}

// ------ Event Template ------
export interface EventTemplate {
  id: string
  userId: string
  title: string
  defaultDurationMin: number
  color?: string
  notes?: string
  location?: string
  recurrenceRule?: string
}

// ------ App Settings ------
export interface AppSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  firstDayOfWeek: 0 | 1
  defaultView: 'week' | 'day' | 'month' | 'agenda'
  workingHoursStart: string
  workingHoursEnd: string
  showWeather: boolean
  showIdealWeek: boolean
  activeCalendarSetId?: string
  weatherLat: number
  weatherLng: number
}

// ------ Weather ------
export interface WeatherDay {
  date: string
  tempMax: number
  tempMin: number
  weatherCode: number
}

// ------ View types ------
export type CalendarView = 'week' | 'day' | 'month' | 'agenda'
export type CalendarProvider = 'google' | 'outlook' | 'local'
export type EventType = 'standard' | 'focus' | 'blocked'
