'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Tag } from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { generateId } from '../lib/helpers'

const PRIORITIES = [
  { label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
]

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage('dashboard_todos', [])
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState(1)
  const [filter, setFilter] = useState('all')

  const addTodo = () => {
    if (!input.trim()) return
    setTodos(prev => [...prev, {
      id: generateId(),
      text: input.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  }).sort((a, b) => a.priority - b.priority)

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="glass-card p-5 glow-blue">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <CheckCircle2 size={20} className="text-blue-400" />
          To-Do List
        </h2>
        <span className="text-xs text-slate-400">
          {completedCount}/{todos.length} done
        </span>
      </div>

      {/* Progress */}
      {todos.length > 0 && (
        <div className="progress-bar mb-4">
          <div
            className="progress-bar-fill bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${(completedCount / todos.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add todo */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="dark-input flex-1"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className="btn-primary px-3 flex items-center gap-1">
          <Plus size={16} />
        </button>
      </div>

      {/* Priority selector */}
      <div className="flex gap-2 mb-4">
        {PRIORITIES.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPriority(i)}
            className="text-xs px-3 py-1 rounded-full transition-all"
            style={{
              background: priority === i ? p.bg : 'transparent',
              color: priority === i ? p.color : '#64748b',
              border: `1px solid ${priority === i ? p.color + '40' : '#33415540'}`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-3">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-lg capitalize transition-all ${
              filter === f
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo items */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {filtered.map(todo => (
          <div
            key={todo.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              todo.completed
                ? 'bg-slate-800/30'
                : 'bg-slate-800/60 hover:bg-slate-800/80'
            }`}
          >
            <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
              {todo.completed
                ? <CheckCircle2 size={20} className="text-blue-400" />
                : <Circle size={20} className="text-slate-500" />
              }
            </button>
            <span className={`flex-1 text-sm ${
              todo.completed ? 'line-through text-slate-500' : 'text-slate-200'
            }`}>
              {todo.text}
            </span>
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: PRIORITIES[todo.priority]?.color }}
            />
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-6">
            {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
          </p>
        )}
      </div>
    </div>
  )
}

