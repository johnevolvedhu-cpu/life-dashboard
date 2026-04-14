export function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d)
  }
  return dates
}

export function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatShortDay(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getStreakCount(completionMap, habitId) {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (completionMap[key]?.[habitId]) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export function getCompletionRate(completionMap, habitId, days = 30) {
  let completed = 0
  const today = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (completionMap[key]?.[habitId]) {
      completed++
    }
  }
  return Math.round((completed / days) * 100)
}

