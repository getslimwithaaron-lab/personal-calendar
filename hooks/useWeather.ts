// hooks/useWeather.ts
// Fetch 7-day weather forecast from Open-Meteo via our API

'use client'

import { useState, useEffect, useCallback } from 'react'
import { WeatherDay } from '@/types'

export function useWeather(lat?: number, lng?: number) {
  const [days, setDays] = useState<WeatherDay[]>([])
  const [isLoading, setLoading] = useState(false)

  const fetchWeather = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (lat !== undefined) params.set('lat', String(lat))
      if (lng !== undefined) params.set('lng', String(lng))
      const res = await fetch(`/api/weather?${params}`)
      if (res.ok) {
        const data = await res.json() as { days: WeatherDay[] }
        setDays(data.days)
      }
    } finally {
      setLoading(false)
    }
  }, [lat, lng])

  useEffect(() => { fetchWeather() }, [fetchWeather])

  return { days, isLoading, refetch: fetchWeather }
}

// Map WMO weather codes to emoji
export function weatherEmoji(code: number): string {
  if (code === 0) return '\u2600\uFE0F' // clear
  if (code <= 3) return '\u26C5' // partly cloudy
  if (code <= 49) return '\u2601\uFE0F' // cloudy/fog
  if (code <= 59) return '\uD83C\uDF27\uFE0F' // drizzle
  if (code <= 69) return '\uD83C\uDF27\uFE0F' // rain
  if (code <= 79) return '\u2744\uFE0F' // snow
  if (code <= 84) return '\uD83C\uDF27\uFE0F' // rain showers
  if (code <= 86) return '\u2744\uFE0F' // snow showers
  if (code <= 99) return '\u26A1' // thunderstorm
  return '\u2601\uFE0F'
}
