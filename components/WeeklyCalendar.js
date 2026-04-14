'use client'

import { useState } from 'react'
import { Calendar, Plus, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { generateId, getWeekDates, getTodayKey } from '../lib/helpers'

const TIME_SLOTS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

const EVENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']

export default function WeeklyCalendar() {
  const [events, setEvents] = useLocalStorage('dashboard_events', [])
  const [showAdd, setShowAdd] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: getTodayKey(), time: '09:00', duration: 1, color: 0 })
  const weekDates = getWeekDates()
  const today = getTodayKey()

  const addEvent = () => {
    if (!newEvent.title.trim()) return
    setEvents(prev => [...prev, {
      id: generateId(),
      ...newEvent,
      color: EVENT_COLORS[newEvent.color],
    }])
    setNewEvent({ title: '', date: getTodayKey(), time: '09:00', duration: 1, color: 0 })
    setShowAdd(false)
  }

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const todaysEvents = events
    .filter(e => e.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))

  const upcomingEvents = events
    .filter(e => e.date > today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)

  return (
    <div className="glass-card p-5 glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} className="text-cyan-400" />
          Calendar
        </h2>
        <span className="text-xs text-slate-400">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Week strip */}
      <div className="flex gap-1 mb-4">
        {weekDates.map(d => {
          const key = d.toISOString().slice(0, 10)
          const isToday = key === today
          const hasEvents = events.some(e => e.date === key)
          return (
            <div key={key} className={`flex-1 text-center py-2 rounded-xl transition-all ${
              isToday ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-800/30'
            }`}>
              <div className={`text-[10px] uppercase ${isToday ? 'text-cyan-400' : 'text-slate-500'}`}>
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold ${isToday ? 'text-white' : 'text-slate-400'}`}>
                {d.getDate()}
              </div>
              {hasEvents && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mx-auto mt-1" />}
            </div>
          )
        })}
      </div>

      {/* Today's events */}
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Today</h3>
        {todaysEvents.length > 0 ? (
          <div className="space-y-2">
            {todaysEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40">
                <div className="w-1 h-8 rounded-full" style={{ background: event.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate">{event.title}</div>
                  <div className="text-[11px] text-slate-500">{event.time} · {event.duration}h</div>
                </div>
                <button onClick={() => deleteEvent(event.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No events today</p>
        )}
      </div>

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Upcoming</h3>
          <div className="space-y-1">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center gap-2 p-1.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: event.color }} />
                <span className="text-slate-400 w-16">{new Date(event.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-slate-300 truncate flex-1">{event.title}</span>
                <span className="text-slate-500">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add event */}
      {showAdd ? (
        <div className="mt-3 space-y-2">
          <input className="dark-input" placeholder="Event title..." value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} autoFocus />
          <div className="flex gap-2">
            <input type="date" className="dark-input flex-1" value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} />
            <select className="dark-input w-24" value={newEvent.time} onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <select className="dark-input w-1/2" value={newEvent.duration} onChange={e => setNewEvent(p => ({ ...p, duration: Number(e.target.value) }))}>
              {[0.5, 1, 1.5, 2, 3, 4].map(d => <option key={d} value={d}>{d}h</option>)}
            </select>
            <div className="flex gap-1 items-center">
              {EVENT_COLORS.map((c, i) => (
                <button key={c} onClick={() => setNewEvent(p => ({ ...p, color: i }))}
                  className="w-5 h-5 rounded-full transition-all"
                  style={{ background: c, opacity: newEvent.color === i ? 1 : 0.3, transform: newEvent.color === i ? 'scale(1.2)' : 'scale(1)' }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addEvent} className="btn-primary flex-1">Add Event</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="btn-ghost w-full mt-2 flex items-center justify-center gap-1">
          <Plus size={14} /> Add Event
        </button>
      )}
    </div>
  )
}

