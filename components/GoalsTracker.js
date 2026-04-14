'use client'

import { useState } from 'react'
import { Target, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { generateId } from '../lib/helpers'

const GOAL_CATEGORIES = [
  { label: 'Health', color: '#10b981', emoji: '💪' },
  { label: 'Career', color: '#3b82f6', emoji: '💼' },
  { label: 'Finance', color: '#f59e0b', emoji: '💰' },
  { label: 'Personal', color: '#8b5cf6', emoji: '🧠' },
  { label: 'Creative', color: '#ec4899', emoji: '🎨' },
]

export default function GoalsTracker() {
  const [goals, setGoals] = useLocalStorage('dashboard_goals', [])
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', category: 0, target: '', unit: '', current: 0 })
  const [expanded, setExpanded] = useState(null)

  const addGoal = () => {
    if (!newGoal.title.trim()) return
    setGoals(prev => [...prev, {
      id: generateId(),
      ...newGoal,
      current: 0,
      target: Number(newGoal.target) || 100,
      createdAt: new Date().toISOString(),
    }])
    setNewGoal({ title: '', category: 0, target: '', unit: '', current: 0 })
    setShowAdd(false)
  }

  const updateProgress = (id, value) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g
      const newCurrent = Math.max(0, Math.min(g.target, Number(value)))
      return { ...g, current: newCurrent }
    }))
  }

  const incrementGoal = (id, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g
      const newCurrent = Math.max(0, Math.min(g.target, g.current + amount))
      return { ...g, current: newCurrent }
    }))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  return (
    <div className="glass-card p-5 glow-purple">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Target size={20} className="text-purple-400" />
          Goals
        </h2>
        <span className="text-xs text-slate-400">{goals.length} active</span>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {goals.map(goal => {
          const cat = GOAL_CATEGORIES[goal.category] || GOAL_CATEGORIES[0]
          const pct = goal.target ? Math.round((goal.current / goal.target) * 100) : 0
          const isExpanded = expanded === goal.id

          return (
            <div key={goal.id} className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : goal.id)}>
                <span className="text-lg">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200 truncate">{goal.title}</span>
                    <span className="badge text-[10px]" style={{ background: cat.color + '20', color: cat.color }}>{cat.label}</span>
                  </div>
                  <div className="progress-bar mt-2">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-slate-500">{goal.current} / {goal.target} {goal.unit}</span>
                    <span className="text-[11px] font-semibold" style={{ color: cat.color }}>{pct}%</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                  <button onClick={() => incrementGoal(goal.id, -1)} className="btn-ghost px-2 py-1 text-xs">-1</button>
                  <button onClick={() => incrementGoal(goal.id, 1)} className="btn-ghost px-2 py-1 text-xs">+1</button>
                  <button onClick={() => incrementGoal(goal.id, 5)} className="btn-ghost px-2 py-1 text-xs">+5</button>
                  <input
                    type="number"
                    className="dark-input w-20 text-xs text-center"
                    value={goal.current}
                    onChange={e => updateProgress(goal.id, e.target.value)}
                  />
                  <button onClick={() => deleteGoal(goal.id)} className="ml-auto text-slate-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showAdd ? (
        <div className="mt-3 space-y-2">
          <input className="dark-input" placeholder="Goal title..." value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} autoFocus />
          <div className="flex gap-2">
            <input className="dark-input w-1/2" placeholder="Target (e.g. 30)" type="number" value={newGoal.target} onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))} />
            <input className="dark-input w-1/2" placeholder="Unit (e.g. days)" value={newGoal.unit} onChange={e => setNewGoal(p => ({ ...p, unit: e.target.value }))} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {GOAL_CATEGORIES.map((c, i) => (
              <button key={c.label} onClick={() => setNewGoal(p => ({ ...p, category: i }))}
                className="text-xs px-2 py-1 rounded-lg transition-all"
                style={{
                  background: newGoal.category === i ? c.color + '25' : 'transparent',
                  color: newGoal.category === i ? c.color : '#64748b',
                  border: `1px solid ${newGoal.category === i ? c.color + '40' : '#33415540'}`,
                }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addGoal} className="btn-primary flex-1">Add Goal</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="btn-ghost w-full mt-3 flex items-center justify-center gap-1">
          <Plus size={14} /> Add Goal
        </button>
      )}
    </div>
  )
}

