'use client'

import { useState } from 'react'
import { Plus, Flame, Trash2, TrendingUp } from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { generateId, getTodayKey, getWeekDates, formatShortDay, getStreakCount, getCompletionRate } from '../lib/helpers'

const HABIT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444']

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage('dashboard_habits', [])
  const [completions, setCompletions] = useLocalStorage('dashboard_habit_completions', {})
  const [input, setInput] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const today = getTodayKey()
  const weekDates = getWeekDates()

  const addHabit = () => {
    if (!input.trim()) return
    const color = HABIT_COLORS[habits.length % HABIT_COLORS.length]
    setHabits(prev => [...prev, { id: generateId(), name: input.trim(), color, createdAt: today }])
    setInput('')
    setShowAdd(false)
  }

  const toggleCompletion = (habitId, dateKey) => {
    setCompletions(prev => {
      const updated = { ...prev }
      if (!updated[dateKey]) updated[dateKey] = {}
      updated[dateKey] = { ...updated[dateKey], [habitId]: !updated[dateKey][habitId] }
      return updated
    })
  }

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const todayCompletedCount = habits.filter(h => completions[today]?.[h.id]).length

  return (
    <div className="glass-card p-5 glow-green">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Flame size={20} className="text-green-400" />
          Habit Tracker
        </h2>
        <span className="text-xs text-slate-400">
          {todayCompletedCount}/{habits.length} today
        </span>
      </div>

      {/* Today progress */}
      {habits.length > 0 && (
        <div className="progress-bar mb-4">
          <div
            className="progress-bar-fill bg-gradient-to-r from-green-500 to-emerald-400"
            style={{ width: `${habits.length ? (todayCompletedCount / habits.length) * 100 : 0}%` }}
          />
        </div>
      )}

      {/* Week grid header */}
      {habits.length > 0 && (
        <div className="flex gap-1 mb-2 pl-[120px]">
          {weekDates.map(d => {
            const key = d.toISOString().slice(0, 10)
            const isToday = key === today
            return (
              <div key={key} className={`flex-1 text-center text-xs font-medium ${isToday ? 'text-green-400' : 'text-slate-500'}`}>
                {formatShortDay(d).slice(0, 2)}
              </div>
            )
          })}
        </div>
      )}

      {/* Habit rows */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto">
        {habits.map(habit => {
          const streak = getStreakCount(completions, habit.id)
          return (
            <div key={habit.id} className="flex items-center gap-2">
              <div className="w-[120px] flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: habit.color }} />
                <span className="text-sm text-slate-300 truncate">{habit.name}</span>
              </div>
              <div className="flex gap-1 flex-1">
                {weekDates.map(d => {
                  const key = d.toISOString().slice(0, 10)
                  const checked = completions[key]?.[habit.id]
                  const isToday = key === today
                  return (
                    <button
                      key={key}
                      onClick={() => toggleCompletion(habit.id, key)}
                      className="flex-1 aspect-square max-w-[36px] rounded-lg border-2 transition-all flex items-center justify-center"
                      style={{
                        borderColor: checked ? habit.color : isToday ? habit.color + '40' : '#1e293b',
                        background: checked ? habit.color + '25' : 'transparent',
                      }}
                    >
                      {checked && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill={habit.color}>
                          <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-1 w-[50px] flex-shrink-0 justify-end">
                {streak > 0 && (
                  <span className="text-xs text-orange-400 flex items-center gap-0.5">
                    <span className="streak-fire">🔥</span>{streak}
                  </span>
                )}
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 size={12} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Add habit */}
      {showAdd ? (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            className="dark-input flex-1"
            placeholder="New habit..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
            autoFocus
          />
          <button onClick={addHabit} className="btn-primary px-3"><Plus size={16} /></button>
          <button onClick={() => setShowAdd(false)} className="btn-ghost px-3 text-xs">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="btn-ghost w-full mt-3 flex items-center justify-center gap-1">
          <Plus size={14} /> Add Habit
        </button>
      )}
    </div>
  )
}

