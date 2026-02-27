import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Plus } from 'lucide-react'

export function TripSelector({ trips, selectedTripId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedTrip = trips.find(t => t.id === selectedTripId)

  const handleSelect = (tripId) => {
    onSelect(tripId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Plane className="h-4 w-4" />
        {selectedTrip ? selectedTrip.destination : 'General'}
        <span className="text-xs bg-sky-100 dark:bg-sky-900/30 px-2 py-0.5 rounded-full">
          {selectedTrip ? 'Trip' : 'General'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedTripId 
                  ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="font-medium">General</span>
              <span className="block text-xs text-slate-500">Standalone checklist</span>
            </button>
          </div>
          
          {trips.length > 0 ? (
            <div className="max-h-48 overflow-y-auto p-2">
              {trips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => handleSelect(trip.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTripId === trip.id 
                      ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="font-medium">{trip.destination}</span>
                  <span className="block text-xs text-slate-500">
                    {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">
              No trips yet
            </div>
          )}
          
          <div className="p-2 border-t border-slate-100 dark:border-slate-700">
            <Link
              to="/trips"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create New Trip
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
