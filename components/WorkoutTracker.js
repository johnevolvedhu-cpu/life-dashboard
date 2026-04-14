'use client'

import { useState } from 'react'
import { Dumbbell, Plus, Trash2, Clock, Flame as FireIcon } from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { generateId, getTodayKey } from '../lib/helpers'

const WORKOUT_TYPES = [
  { label: 'Strength', emoji: '🏋️', color: '#ef4444' },
  { label: 'Cardio', emoji: '🏃', color: '#f59e0b' },
  { label: 'Yoga', emoji: '🧘', color: '#8b5cf6' },
  { label: 'HIIT', emoji: '⚡', color: '#ec4899' },
  { label: 'Sports', emoji: '⚽', color: '#10b981' },
  { label: 'Swimming', emoji: '🏊', color: '#06b6d4' },
]

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useLocalStorage('dashboard_workouts', [])
  const [showAdd, setShowAdd] = useState(false)
  const [newWorkout, setNewWorkout] = useState({ type: 0, name: '', duration: 30, calories: '', notes: '' })
  const today = getTodayKey()

  const addWorkout = () => {
    if (!newWorkout.name.trim()) return
    setWorkouts(prev => [...prev, {
      id: generateId(),
      ...newWorkout,
      calories: Number(newWorkout.calories) || 0,
      date: today,
    }])
    setNewWorkout({ type: 0, name: '', duration: 30, calories: '', notes: '' })
    setShowAdd(false)
  }

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  const todaysWorkouts = workouts.filter(w => w.date === today)
  const totalMinutes = todaysWorkouts.reduce((sum, w) => sum + w.duration, 0)
  const totalCalories = todaysWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0)

  // Weekly summary
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekWorkouts = workouts.filter(w => w.date >= weekStart.toISOString().slice(0, 10))
  const weekDays = new Set(weekWorkouts.map(w => w.date)).size

  return (
    <div className="glass-card p-5 glow-orange">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Dumbbell size={20} className="text-orange-400" />
          Workouts
        </h2>
        <span className="text-xs text-slate-400">{weekDays}/7 days this week</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-800/40 rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-orange-400">{totalMinutes}</div>
          <div className="text-[10px] text-slate-500">min today</div>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-red-400">{totalCalories}</div>
          <div className="text-[10px] text-slate-500">cal burned</div>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-green-400">{todaysWorkouts.length}</div>
          <div className="text-[10px] text-slate-500">sessions</div>
        </div>
      </div>

      {/* Today's workouts */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {todaysWorkouts.map(w => {
          const type = WORKOUT_TYPES[w.type] || WORKOUT_TYPES[0]
          return (
            <div key={w.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40">
              <span className="text-xl">{type.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">{w.name}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock size={10} /> {w.duration}min</span>
                  {w.calories > 0 && <span className="text-[11px] text-slate-500 flex items-center gap-1"><FireIcon size={10} /> {w.calories}cal</span>}
                </div>
              </div>
              <button onClick={() => deleteWorkout(w.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          )
        })}
        {todaysWorkouts.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">No workouts logged today</p>
        )}
      </div>

      {showAdd ? (
        <div className="mt-3 space-y-2">
          <div className="flex gap-1 flex-wrap">
            {WORKOUT_TYPES.map((t, i) => (
              <button key={t.label} onClick={() => setNewWorkout(p => ({ ...p, type: i }))}
                className="text-xs px-2 py-1 rounded-lg transition-all"
                style={{
                  background: newWorkout.type === i ? t.color + '25' : 'transparent',
                  color: newWorkout.type === i ? t.color : '#64748b',
                  border: `1px solid ${newWorkout.type === i ? t.color + '40' : '#33415540'}`,
                }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <input className="dark-input" placeholder="Workout name..." value={newWorkout.name} onChange={e => setNewWorkout(p => ({ ...p, name: e.target.value }))} autoFocus />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 mb-1 block">Duration (min)</label>
              <input type="number" className="dark-input" value={newWorkout.duration} onChange={e => setNewWorkout(p => ({ ...p, duration: Number(e.target.value) }))} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 mb-1 block">Calories</label>
              <input type="number" className="dark-input" placeholder="Optional" value={newWorkout.calories} onChange={e => setNewWorkout(p => ({ ...p, calories: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addWorkout} className="btn-primary flex-1">Log Workout</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="btn-ghost w-full mt-3 flex items-center justify-center gap-1">
          <Plus size={14} /> Log Workout
        </button>
      )}
    </div>
  )
}

