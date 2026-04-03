'use client'

import { useWeather, weatherEmoji } from '@/hooks/useWeather'
import { useSettings } from '@/hooks/useSettings'
import { format } from 'date-fns'

export function WeatherWidget() {
  const { settings } = useSettings()
  const { days, isLoading } = useWeather(settings.weatherLat, settings.weatherLng)

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-slate-800 shrink-0">
        <h3 className="text-sm font-semibold text-slate-300">7-Day Forecast</h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-600">Loading...</div>
      ) : days.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-600">No weather data</div>
      ) : (
        <div className="flex-1 flex items-stretch overflow-x-auto scroll-container">
          {days.map((day) => {
            const date = new Date(day.date + 'T00:00:00')
            const isToday = day.date === format(new Date(), 'yyyy-MM-dd')
            return (
              <div
                key={day.date}
                className={`flex flex-col items-center justify-center gap-1 min-w-[72px] flex-1 px-2 py-2 border-r border-slate-800/30 last:border-r-0
                  ${isToday ? 'bg-blue-600/10' : ''}`}
              >
                <span className={`text-[11px] font-medium ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                  {isToday ? 'Today' : format(date, 'EEE')}
                </span>
                <span className="text-xl leading-none">{weatherEmoji(day.weatherCode)}</span>
                <div className="flex gap-1 text-[11px]">
                  <span className="text-slate-200 font-medium">{Math.round(day.tempMax)}&deg;</span>
                  <span className="text-slate-500">{Math.round(day.tempMin)}&deg;</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
