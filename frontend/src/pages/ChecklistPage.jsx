import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function ChecklistPage() {
  const [checklist, setChecklist] = useState([])
  const [newItem, setNewItem] = useState('')
  const token = localStorage.getItem('token')

  // 1. FETCH ITEMS (Defined INSIDE useEffect to prevent errors)
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/checklist', {
          headers: { 'x-auth-token': token }
        })
        const data = await res.json()
        // Sort: Unchecked items first, Checked items last
        const sortedData = data.sort((a, b) => a.id - b.id)
        setChecklist(sortedData)
      } catch (err) {
        console.error("Error fetching checklist:", err)
      }
    }

    fetchChecklist()
  }, [token]) // Re-run if token changes (e.g. user re-login)


  // 2. ADD ITEM
  const addItem = async () => {
    if (newItem.trim()) {
      try {
        const res = await fetch('http://localhost:5000/api/checklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ label: newItem })
        })
        const savedItem = await res.json()
        setChecklist((prev) => [...prev, savedItem])
        setNewItem('')
      } catch (err) {
        console.error(err)
      }
    }
  }

  // 3. TOGGLE ITEM (With Manual Revert on Error)
  const toggleChecklistItem = async (id, currentStatus) => {
    // A. Optimistic Update (Update UI instantly)
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )

    // B. Send update to DB
    try {
      await fetch(`http://localhost:5000/api/checklist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ checked: !currentStatus })
      })
    } catch (err) {
      console.error(err)
      // C. ERROR HANDLER: Revert the UI back if server fails
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: currentStatus } : item
        )
      )
      alert("Failed to save change. Check your connection.")
    }
  }

  // 4. DELETE ITEM
  const deleteItem = async (id) => {
    // Optimistic Remove
    const previousList = [...checklist]
    setChecklist((prev) => prev.filter((item) => item.id !== id))

    try {
      await fetch(`http://localhost:5000/api/checklist/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      })
    } catch (err) {
      console.error(err)
      // Revert if delete fails
      setChecklist(previousList)
      alert("Could not delete item.")
    }
  }

  const completedCount = checklist.filter(item => item.checked).length
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Trip Checklist
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {completedCount} of {checklist.length} items completed
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-sky-200 dark:border-sky-900 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</p>
            <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{progressPercent}%</p>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-sky-600 dark:bg-sky-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add new item..."
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 px-4 py-2 font-medium text-white transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {checklist.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">Your list is empty. Add items to start!</p>
        )}
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleChecklistItem(item.id, item.checked)}
              className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500 cursor-pointer bg-white dark:bg-slate-700"
            />
            <span
              className={`flex-1 text-sm ${item.checked
                ? 'text-slate-400 dark:text-slate-600 line-through'
                : 'text-slate-700 dark:text-slate-200'
                }`}
            >
              {item.label}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}