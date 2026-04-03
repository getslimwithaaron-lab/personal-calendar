'use client'

import { useMemo } from 'react'
import { IdealWeekFrame } from '@/types'

const HOUR_HEIGHT = 60

interface IdealWeekOverlayProps {
  frames: IdealWeekFrame[]
  dayOfWeek: number // 0=Sun, 6=Sat
}

export function IdealWeekOverlay({ frames, dayOfWeek }: IdealWeekOverlayProps) {
  const dayFrames = useMemo(
    () => frames.filter(f => f.dayOfWeek === dayOfWeek && f.active),
    [frames, dayOfWeek],
  )

  if (dayFrames.length === 0) return null

  return (
    <>
      {dayFrames.map(frame => {
        const [sh = 0, sm = 0] = frame.startTime.split(':').map(Number)
        const [eh = 0, em = 0] = frame.endTime.split(':').map(Number)
        const topMin = sh * 60 + sm
        const endMin = eh * 60 + em
        const top = (topMin / 60) * HOUR_HEIGHT
        const height = ((endMin - topMin) / 60) * HOUR_HEIGHT

        return (
          <div
            key={frame.id}
            className="absolute left-0 right-0 pointer-events-none z-0 rounded-sm opacity-20"
            style={{
              top,
              height,
              backgroundColor: frame.color,
            }}
          >
            <span className="text-[9px] px-1 opacity-60 text-slate-600 font-medium">
              {frame.label || frame.title}
            </span>
          </div>
        )
      })}
    </>
  )
}
