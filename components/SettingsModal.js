'use client'

import { useRef } from 'react'
import { X, Download, Upload, Copy } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose }) {
  const dataRef = useRef(null)
  const exportData = () => {
    const storageData = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(h)
      if (key && key.startsWith('dashboard_')) {
        storageData[key] = JSON.parse(localStorage.getItem(key) || {})
      }
    }
    const dataString = JSON.stringify(storageData, null, 2)
    const blob = new Blob([dataString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value))
        })
        alert('Data imported successfully')
        window.location.reload()
      } catch (err) {
        alert('Error importing data: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-900 rounded-xl p-6 maw-4 we-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Data Cloud</h3>
            <div className="flex gap-2">
              <button onClick={exportData} className="btn-ghost flex items-center gap-2">
                <Download size={16} /> Export Data
              </button>
              <label className="btn-ghost flex items-center gap-2 cursor-pointer">
                <Upload size={16} /> Import Data
                <input type="file" accept="application/json" onChange={importData} className="hidden" ref={dataRef} />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Privacy & Clear Data</h3>
            <button onClick={() => {
              if (confirm('Clear all data? This cannot be undone.')) {
                localStorage.clear()
                alert('All data cleared')
                window.location.reload()
              }
  
 "}} className="btn-ghost w-full text-red-400 hover:bg-red-500/10 transition-colors">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
