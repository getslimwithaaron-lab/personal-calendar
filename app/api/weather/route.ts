// app/api/weather/route.ts
// Open-Meteo weather forecast with caching

import { NextRequest, NextResponse } from 'next/server'

let cache: { data: WeatherDay[]; fetchedAt: number; key: string } | null = null
const CACHE_TTL = 30 * 60 * 1000 // 30 min

interface WeatherDay {
  date: string
  tempMax: number
  tempMin: number
  weatherCode: number
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat') ?? '39.6133'
  const lng = req.nextUrl.searchParams.get('lng') ?? '-104.9873'
  const cacheKey = `${lat},${lng}`

  if (cache && cache.key === cacheKey && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json({ days: cache.data })
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`

  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json({ error: 'Weather fetch failed' }, { status: 502 })
  }

  const json = await res.json() as {
    daily: {
      time: string[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
      weather_code: number[]
    }
  }

  const days: WeatherDay[] = json.daily.time.map((date, i) => ({
    date,
    tempMax: Math.round(json.daily.temperature_2m_max[i] ?? 0),
    tempMin: Math.round(json.daily.temperature_2m_min[i] ?? 0),
    weatherCode: json.daily.weather_code[i] ?? 0,
  }))

  cache = { data: days, fetchedAt: Date.now(), key: cacheKey }

  return NextResponse.json({ days })
}
