// Timezone mapping: Google uses IANA names, Microsoft uses Windows names
const WINDOWS_TO_IANA: Record<string, string> = {
  'Mountain Standard Time': 'America/Denver',
  'Mountain Time': 'America/Denver',
  'Pacific Standard Time': 'America/Los_Angeles',
  'Eastern Standard Time': 'America/New_York',
  'Central Standard Time': 'America/Chicago',
  'UTC': 'UTC',
  'GMT Standard Time': 'Europe/London',
  'Romance Standard Time': 'Europe/Paris',
  'W. Europe Standard Time': 'Europe/Berlin',
  'Tokyo Standard Time': 'Asia/Tokyo',
  'China Standard Time': 'Asia/Shanghai',
  'India Standard Time': 'Asia/Calcutta',
  'AUS Eastern Standard Time': 'Australia/Sydney',
  'E. South America Standard Time': 'America/Sao_Paulo',
  'Hawaii-Aleutian Standard Time': 'Pacific/Honolulu',
  'Alaskan Standard Time': 'America/Anchorage',
  'Atlantic Standard Time': 'America/Halifax',
}

const IANA_TO_WINDOWS: Record<string, string> = Object.fromEntries(
  Object.entries(WINDOWS_TO_IANA).map(([win, iana]) => [iana, win])
)

export function windowsToIana(windowsTz: string): string {
  return WINDOWS_TO_IANA[windowsTz] ?? 'America/Denver'
}

export function ianaToWindows(ianaTz: string): string {
  return IANA_TO_WINDOWS[ianaTz] ?? 'Mountain Standard Time'
}

// App default timezone
export const APP_TIMEZONE = 'America/Denver'
