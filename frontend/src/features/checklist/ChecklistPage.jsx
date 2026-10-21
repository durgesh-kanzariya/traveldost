import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getChecklistItemsByTrip,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from './checklistService.js'
import { getTrips } from '../../shared/services/tripService.js'
import { TripSelector } from '../trips'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { ListChecks, Plane, Plus, Trash2, CheckCircle2 } from 'lucide-react'

export function ChecklistPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTripId = searchParams.get('trip_id')

  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(
    initialTripId ? parseInt(initialTripId, 10) : null
  )
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
      console.error('Error fetching checklist:', error)
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
        const savedItem = await addChecklistItem(newItem.trim(), selectedTripId)
        setChecklist((prev) => [...prev, savedItem])
        setNewItem('')
      } catch (error) {
        console.error('Error adding item:', error)
      }
    }
  }

  const toggleChecklistItem = async (id, currentStatus) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )

    try {
      await updateChecklistItem(id, !currentStatus)
    } catch (err) {
      console.error(err)
      setChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked: currentStatus } : item))
      )
    }
  }

  const deleteItem = async (id) => {
    const previousList = [...checklist]
    setChecklist((prev) => prev.filter((item) => item.id !== id))

    try {
      await deleteChecklistItem(id)
    } catch (err) {
      console.error(err)
      setChecklist(previousList)
    }
  }

  const completedCount = checklist.filter((item) => item.checked).length
  const progressPercent =
    checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  const selectedTrip = trips.find((t) => t.id === selectedTripId)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════
            HEADER & TRIP SELECTOR
        ═════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Packing Manifest
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Pre-departure gear checklist, baggage prep, and traveler packing ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TripSelector
              trips={trips}
              selectedTripId={selectedTripId}
              onSelect={handleTripChange}
            />
          </div>
        </div>

        {/* ════════════════════════════════════════
            STATUS & PROGRESS PANEL
        ═════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Active Scope Card (5 cols) */}
          <div className="md:col-span-5 p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                <Plane className="w-4 h-4 text-zinc-700 dark:text-zinc-300 -rotate-45" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Target Scope
                </span>
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate mt-0.5">
                  {selectedTrip ? selectedTrip.destination : 'Universal Standalone'}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shrink-0">
              {selectedTrip ? 'Assigned Route' : 'General Scope'}
            </span>
          </div>

          {/* Progress Card (7 cols) */}
          <div className="md:col-span-7 p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Manifest Readiness
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                <span>
                  {completedCount}/{checklist.length} Completed
                </span>
                <span className="text-zinc-400 dark:text-zinc-600">|</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            QUICK ADD ITEM ROW
        ═════════════════════════════════════════ */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={
              selectedTrip
                ? `Add luggage or prep item for ${selectedTrip.destination}...`
                : 'Add item to universal manifest (e.g. Passport, Universal Adapter)...'
            }
            className="flex-1 px-3.5 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* ════════════════════════════════════════
            CHECKLIST ENTRIES LEDGER
        ═════════════════════════════════════════ */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="w-3.5 h-3.5 text-zinc-500" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Manifest Checklist Items
              </h2>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
              {checklist.length} Total
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-2 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-48 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800/60" />
                </div>
              ))}
            </div>
          ) : checklist.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-9 h-9 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {selectedTrip
                  ? `No items registered for ${selectedTrip.destination}`
                  : 'Universal manifest is empty'}
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                Type an item above to add it to your pre-flight preparation.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors group"
                >
                  <label className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id, item.checked)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-zinc-100 cursor-pointer focus:ring-1 focus:ring-zinc-400"
                    />
                    <span
                      className={`text-xs font-medium break-all transition-colors ${
                        item.checked
                          ? 'text-zinc-400 dark:text-zinc-600 line-through'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    title="Remove item"
                    aria-label={`Remove ${item.label}`}
                    className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-80 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer ml-3 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
