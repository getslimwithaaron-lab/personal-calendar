import type { WeatherDay } from '@/types'

const CACHE_KEY = 'weather_cache'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface WeatherCache {
  fetchedAt: number
  data: WeatherDay[]
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherDay[]> {
  // Check localStorage cache first
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const cache: WeatherCache = JSON.parse(raw)
      if (Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
        return cache.data
      }
    }
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&temperature_unit=fahrenheit` +
    `&timezone=America%2FDenver` +
    `&forecast_days=14`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const json = await res.json()

  const days: WeatherDay[] = json.daily.time.map((date: string, i: number) => ({
    date,
    tempMax: Math.round(json.daily.temperature_2m_max[i]),
    tempMin: Math.round(json.daily.temperature_2m_min[i]),
    weatherCode: json.daily.weathercode[i],
  }))

  if (typeof window !== 'undefined') {
    const cache: WeatherCache = { fetchedAt: Date.now(), data: days }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  }

  return days
}

// WMO weather code → label + emoji
export function weatherLabel(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Clear', icon: '☀️' }
  if (code <= 3) return { label: 'Partly Cloudy', icon: '⛅' }
  if (code <= 48) return { label: 'Fog', icon: '🌫️' }
  if (code <= 67) return { label: 'Rain', icon: '🌧️' }
  if (code <= 77) return { label: 'Snow', icon: '❄️' }
  if (code <= 82) return { label: 'Showers', icon: '🌦️' }
  return { label: 'Storm', icon: '⛈️' }
}
