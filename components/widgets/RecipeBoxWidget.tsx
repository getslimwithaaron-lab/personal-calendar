'use client'

import { useState } from 'react'
import { useRecipes, useGrocery } from '@/hooks/useWidgetData'

export function RecipeBoxWidget() {
  const { items: recipes, add: addRecipe, remove: removeRecipe } = useRecipes()
  const { add: addGroceryItem } = useGrocery()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim()) return
    const ingList = ingredients.split('\n').map(s => s.trim()).filter(Boolean)
    await addRecipe({ title: title.trim(), ingredients: ingList })
    setTitle(''); setIngredients(''); setAdding(false)
  }

  const addAllToGrocery = async (ingList: string[]) => {
    for (const ing of ingList) {
      await addGroceryItem({ title: ing })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/50 shrink-0">
        <span className="text-xs text-slate-500">{recipes.length} recipes</span>
        <button onClick={() => setAdding(!adding)} className="text-xs text-blue-400 min-h-[36px] min-w-[44px]">
          {adding ? 'Cancel' : '+ New'}
        </button>
      </div>

      {adding && (
        <div className="px-3 py-2 border-b border-slate-800/50 space-y-2 shrink-0">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Recipe name" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none min-h-[40px]" />
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ingredients (one per line)" className="w-full bg-slate-800 rounded px-2 py-1.5 text-sm text-white outline-none resize-none min-h-[60px]" rows={3} />
          <button onClick={handleSave} className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-medium min-h-[44px]">Save Recipe</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scroll-container">
        {recipes.map(r => (
          <div key={r.id} className="border-b border-slate-800/20">
            <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="flex items-center w-full px-3 py-2 text-left min-h-[48px]">
              <span className="flex-1 text-sm text-slate-200">{r.title}</span>
              <span className="text-[10px] text-slate-600">{r.ingredients.length} items</span>
            </button>
            {expanded === r.id && (
              <div className="px-3 pb-2 space-y-1">
                {r.ingredients.map((ing, i) => (
                  <div key={i} className="text-xs text-slate-400 pl-2">- {ing}</div>
                ))}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => addAllToGrocery(r.ingredients)} className="flex-1 py-1.5 rounded bg-green-700/30 text-green-400 text-xs min-h-[40px]">
                    Add all to grocery list
                  </button>
                  <button onClick={() => removeRecipe(r.id)} className="px-3 py-1.5 rounded bg-red-900/30 text-red-400 text-xs min-h-[40px]">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {recipes.length === 0 && !adding && <div className="text-center py-8 text-xs text-slate-600">No recipes yet</div>}
      </div>
    </div>
  )
}
