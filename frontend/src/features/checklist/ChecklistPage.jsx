import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom';
import { getChecklistItemsByTrip, addChecklistItem, updateChecklistItem, deleteChecklistItem } from './checklistService.js';
import { getTrips } from '../../shared/services/tripService.js';
import { TripSelector } from '../trips';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ListChecks, Plane, Plus, Trash2 } from 'lucide-react';

export function ChecklistPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTripId = searchParams.get('trip_id')

  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(initialTripId ? parseInt(initialTripId) : null)
  const [checklist, setChecklist] = useState([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTrips = useCallback(async () => {
    try {
      const data = await getTrips()
      setTrips(data)
    } catch (err) {
      console.error('Failed to fetch trips:', err)
    }
  }, [])

  const fetchChecklist = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getChecklistItemsByTrip(selectedTripId)
      setChecklist(data)
    } catch (error) {
      console.error("Error fetching checklist:", error);
    } finally {
      setLoading(false)
    }
  }, [selectedTripId])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  useEffect(() => {
    fetchChecklist()
  }, [fetchChecklist, selectedTripId])

  const handleTripChange = (tripId) => {
    setSelectedTripId(tripId)
    if (tripId) {
      setSearchParams({ trip_id: tripId })
    } else {
      setSearchParams({})
    }
  }

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        const savedItem = await addChecklistItem(newItem, selectedTripId);
        setChecklist((prev) => [...prev, savedItem]);
        setNewItem('');
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  }

  const toggleChecklistItem = async (id, currentStatus) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )

    try {
      await updateChecklistItem(id, !currentStatus);
    } catch (err) {
      console.error(err)
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: currentStatus } : item
        )
      )
      alert("Failed to save change. Check your connection.")
    }
  }

  const deleteItem = async (id) => {
    const previousList = [...checklist]
    setChecklist((prev) => prev.filter((item) => item.id !== id))

    try {
      await deleteChecklistItem(id);
    } catch (err) {
      console.error(err)
      setChecklist(previousList)
      alert("Could not delete item.")
    }
  }

  const completedCount = checklist.filter(item => item.checked).length
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  const selectedTrip = trips.find(t => t.id === selectedTripId)

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Breadcrumbs />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl flex items-center gap-3">
              <ListChecks className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              Checklist
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {completedCount} of {checklist.length} items completed
            </p>
          </div>

          <TripSelector
            trips={trips}
            selectedTripId={selectedTripId}
            onSelect={handleTripChange}
          />
        </div>
      </div>

      {selectedTrip && (
        <div className="mb-6 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl">
          <div className="flex items-center gap-3">
            <Plane className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <div>
              <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">{selectedTrip.destination}</p>
              <p className="text-xs text-violet-500 dark:text-violet-500">
                {new Date(selectedTrip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}

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
            placeholder={selectedTrip ? `Add item for ${selectedTrip.destination}...` : "Add new item to global checklist..."}
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
        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">Loading...</p>
        ) : checklist.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">
            {selectedTrip
              ? `No items for ${selectedTrip.destination} yet. Add some!`
              : 'Your list is empty. Add items to start!'}
          </p>
        ) : (
          checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id, item.checked)}
                className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500 cursor-pointer bg-white dark:bg-slate-700"
              />
              <span
                className={`flex-1 text-sm break-all ${item.checked
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
          ))
        )}
      </div>
    </DashboardLayout>
  )
}
