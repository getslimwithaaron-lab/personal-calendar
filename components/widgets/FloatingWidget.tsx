'use client'

import { ReactNode, useRef, useCallback, useState } from 'react'

export interface FloatingWidgetProps {
  title: string
  icon: string
  x: number
  y: number
  w: number
  h: number
  collapsed: boolean
  zIndex: number
  onMove: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
  onCollapse: (collapsed: boolean) => void
  onFocus: () => void
  onClose: () => void
  children: ReactNode
}

const MIN_W = 260
const MIN_H = 160
const TITLE_H = 44

export function FloatingWidget({
  title, icon, x, y, w, h, collapsed, zIndex,
  onMove, onResize, onCollapse, onFocus, onClose, children,
}: FloatingWidgetProps) {
  const dragging = useRef(false)
  const resizing = useRef(false)
  const startPos = useRef({ x: 0, y: 0, ox: 0, oy: 0, ow: 0, oh: 0 })
  const [dragActive, setDragActive] = useState(false)
  const lastTap = useRef(0)

  // ── Drag by title bar ──────────────────────────────────────────────
  const handleDragDown = useCallback((e: React.PointerEvent) => {
    // Double-tap to collapse
    const now = Date.now()
    if (now - lastTap.current < 350) {
      onCollapse(!collapsed)
      lastTap.current = 0
      return
    }
    lastTap.current = now

    e.preventDefault()
    e.stopPropagation()
    onFocus()
    dragging.current = true
    setDragActive(true)
    startPos.current = { x: e.clientX, y: e.clientY, ox: x, oy: y, ow: w, oh: h }

    const move = (ev: PointerEvent) => {
      if (!dragging.current) return
      const dx = ev.clientX - startPos.current.x
      const dy = ev.clientY - startPos.current.y
      onMove(
        Math.max(0, startPos.current.ox + dx),
        Math.max(0, startPos.current.oy + dy),
      )
    }
    const up = () => {
      dragging.current = false
      setDragActive(false)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }, [x, y, w, h, collapsed, onMove, onCollapse, onFocus])

  // ── Resize from bottom-right corner ────────────────────────────────
  const handleResizeDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    resizing.current = true
    startPos.current = { x: e.clientX, y: e.clientY, ox: x, oy: y, ow: w, oh: h }

    const move = (ev: PointerEvent) => {
      if (!resizing.current) return
      const dw = ev.clientX - startPos.current.x
      const dh = ev.clientY - startPos.current.y
      onResize(
        Math.max(MIN_W, startPos.current.ow + dw),
        Math.max(MIN_H, startPos.current.oh + dh),
      )
    }
    const up = () => {
      resizing.current = false
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }, [x, y, w, h, onResize, onFocus])

  return (
    <div
      className={`absolute flex flex-col bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden select-none
        ${dragActive ? 'ring-2 ring-blue-500/50' : ''}`}
      style={{
        left: x,
        top: y,
        width: w,
        height: collapsed ? TITLE_H : h,
        zIndex,
        transition: dragging.current || resizing.current ? 'none' : 'height 0.15s ease',
      }}
      onPointerDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 h-[44px] shrink-0 bg-slate-800/80 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handleDragDown}
      >
        <span className="text-sm">{icon}</span>
        <span className="flex-1 text-xs font-semibold text-slate-300 truncate">{title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onCollapse(!collapsed) }}
          className="p-1 rounded hover:bg-slate-700 min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-500"
        >
          <svg className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="p-1 rounded hover:bg-red-900/50 min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-500 hover:text-red-400"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-auto scroll-container min-h-0">
          {children}
        </div>
      )}

      {/* Resize handle (bottom-right) */}
      {!collapsed && (
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize touch-none flex items-center justify-center"
          onPointerDown={handleResizeDown}
        >
          <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 22H20V20H22V22ZM22 18H18V22H22V18ZM22 14H14V22H22V14Z" opacity="0.3" />
            <path d="M22 22H20V20H22V22ZM22 18H18V22H16V18H22V16H18V14H22V18ZM14 22H10V18H14V22Z" />
          </svg>
        </div>
      )}
    </div>
  )
}
