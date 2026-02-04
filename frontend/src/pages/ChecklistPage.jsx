import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'

export function ChecklistPage() {
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Passport', checked: true },
    { id: 2, label: 'Tickets', checked: false },
    { id: 3, label: 'Travel Insurance', checked: false },
    { id: 4, label: 'Hotel Booking', checked: true },
    { id: 5, label: 'Emergency Contacts', checked: false },
  ])
  const [newItem, setNewItem] = useState('')

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const addItem = () => {
    if (newItem.trim()) {
      setChecklist((prev) => [
        ...prev,
        { id: Date.now(), label: newItem, checked: false }
      ])
      setNewItem('')
    }
  }

  const deleteItem = (id) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id))
  }

  const completedCount = checklist.filter(item => item.checked).length
  const progressPercent = Math.round((completedCount / checklist.length) * 100) || 0

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Trip Checklist
        </h1>
        <p className="mt-2 text-slate-600">
          {completedCount} of {checklist.length} items completed
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Progress</p>
            <p className="text-sm font-bold text-sky-600">{progressPercent}%</p>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-sky-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add new item..."
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-700"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleChecklistItem(item.id)}
              className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                item.checked
                  ? 'text-slate-400 line-through'
                  : 'text-slate-700'
              }`}
            >
              {item.label}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
