'use client'

import { useState, useEffect } from 'react'
import { Settings, LayoutGrid, Heart, BookOpen, Brain } from 'lucide-react'
import TodoList from '../components/TodoList'
import HabitTracker from '../components/HabitTracker'
import GoalsTracker from '../components/GoalsTracker'
import WeeklyCalendar from '../components/WeeklyCalendar'
import WorkoutTracker from '../components/WorkoutTracker'
import DietTracker from '../components/DietTracker'
import SleepTracker from '../components/SleepTracker'
import VideoWatchlist from '../components/VideoWatchlist'
import Journal from '../components/Journal'
import QuoteWidget from '../components/QuoteWidget'
import SettingsModal from '../components/SettingsModal'

const TABS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'productivity', label: 'Productivity', icon: Brain },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'growth', label: 'Growth', icon: BookOpen },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all')
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading your dashboard...</div>
      </div>
    )
  }

  const showSection = (section) => activeTab === 'all' || activeTab === section

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Life Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {greeting} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Tab navigation */}
          <nav className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-pill flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Quote - always visible */}
        <div className="mb-6">
          <QuoteWidget />
        </div>

        {/* Productivity section */}
        {showSection('productivity') && (
          <section className="mb-6">
            {activeTab !== 'all' && (
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Brain size={14} /> Productivity
              </h2>
            )}
            <div className="dashboard-grid">
              <TodoList />
              <WeeklyCalendar />
              <HabitTracker />
              <GoalsTracker />
            </div>
          </section>
        )}

        {/* Health section */}
        {showSection('health') && (
          <section className="mb-6">
            {activeTab !== 'all' && (
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Heart size={14} /> Health & Fitness
              </h2>
            )}
            <div className="dashboard-grid">
              <WorkoutTracker />
              <DietTracker />
              <SleepTracker />
            </div>
          </section>
        )}

        {/* Growth section */}
        {showSection('growth') && (
          <section className="mb-6">
            {activeTab !== 'all' && (
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={14} /> Learning & Growth
              </h2>
            )}
            <div className="dashboard-grid">
              <VideoWatchlist />
              <Journal />
            </div>
          </section>
        )}
      </main>

      {/* Settings modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}

