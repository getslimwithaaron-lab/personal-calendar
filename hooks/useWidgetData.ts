'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Generic CRUD hook factory ────────────────────────────────────────────────
function useCrud<T extends { id: string }>(endpoint: string, key: string) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setLoading] = useState(false)

  const fetchAll = useCallback(async (params?: string) => {
    setLoading(true)
    try {
      const url = params ? `${endpoint}?${params}` : endpoint
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setItems(data[key] ?? [])
      }
    } finally { setLoading(false) }
  }, [endpoint, key])

  useEffect(() => { fetchAll() }, [fetchAll])

  const add = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) fetchAll()
    return res.ok
  }, [endpoint, fetchAll])

  const update = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) fetchAll()
    return res.ok
  }, [endpoint, fetchAll])

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    return res.ok
  }, [endpoint, fetchAll])

  return { items, isLoading, add, update, remove, refetch: fetchAll }
}

// ── Typed hooks ──────────────────────────────────────────────────────────────

export interface GroceryItem { id: string; title: string; checked: boolean; category: string }
export function useGrocery() { return useCrud<GroceryItem>('/api/grocery', 'items') }

export interface MealPlan { id: string; day_of_week: number; meal: string; week_start: string }
export function useMeals(weekStart: string) {
  const [meals, setMeals] = useState<MealPlan[]>([])
  const fetchMeals = useCallback(async () => {
    const res = await fetch(`/api/meals?weekStart=${weekStart}`)
    if (res.ok) { const d = await res.json(); setMeals(d.meals ?? []) }
  }, [weekStart])
  useEffect(() => { fetchMeals() }, [fetchMeals])
  const setMeal = useCallback(async (dayOfWeek: number, meal: string) => {
    await fetch('/api/meals', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ day_of_week: dayOfWeek, meal, week_start: weekStart }) })
    fetchMeals()
  }, [weekStart, fetchMeals])
  return { meals, setMeal, refetch: fetchMeals }
}

export interface Recipe { id: string; title: string; ingredients: string[]; instructions: string }
export function useRecipes() { return useCrud<Recipe>('/api/recipes', 'recipes') }

export interface Chore { id: string; title: string; assignee: string; due_date: string | null; completed: boolean }
export function useChores() { return useCrud<Chore>('/api/chores', 'chores') }

export interface Birthday { id: string; name: string; month: number; day: number; year: number | null }
export function useBirthdays() { return useCrud<Birthday>('/api/birthdays', 'birthdays') }

export interface Countdown { id: string; title: string; target_date: string; color: string }
export function useCountdowns() { return useCrud<Countdown>('/api/countdowns', 'countdowns') }

export interface Expense { id: string; title: string; amount: number; category: string; paid_by: string; expense_date: string }
export function useExpenses(month?: string) {
  const hook = useCrud<Expense>('/api/expenses', 'expenses')
  useEffect(() => { if (month) hook.refetch(`month=${month}`) }, [month])
  return hook
}

export interface Contact { id: string; name: string; phone: string; role: string }
export function useContacts() { return useCrud<Contact>('/api/contacts', 'contacts') }

// ── Widget layout hook ───────────────────────────────────────────────────────
export interface WidgetLayout { widget_key: string; x: number; y: number; w: number; h: number; collapsed: boolean; visible: boolean; z_index: number }

export function useWidgetLayouts() {
  const [layouts, setLayouts] = useState<Map<string, WidgetLayout>>(new Map())
  const [loaded, setLoaded] = useState(false)

  const fetchLayouts = useCallback(async () => {
    try {
      const res = await fetch('/api/widget-layouts')
      if (res.ok) {
        const data = await res.json()
        const map = new Map<string, WidgetLayout>()
        for (const l of data.layouts ?? []) map.set(l.widget_key, l)
        setLayouts(map)
      }
    } finally { setLoaded(true) }
  }, [])

  useEffect(() => { fetchLayouts() }, [fetchLayouts])

  const saveLayout = useCallback(async (layout: WidgetLayout) => {
    setLayouts(prev => new Map(prev).set(layout.widget_key, layout))
    await fetch('/api/widget-layouts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(layout) })
  }, [])

  return { layouts, loaded, saveLayout }
}
