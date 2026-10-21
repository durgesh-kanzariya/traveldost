import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Plus, ChevronDown, Check } from 'lucide-react'

export function TripSelector({ trips, selectedTripId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const selectedTrip = trips.find((t) => t.id === selectedTripId)

  const handleSelect = (tripId) => {
    onSelect(tripId)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-mono text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
      >
        <Plane className="w-3.5 h-3.5 text-zinc-500 -rotate-45" />
        <span className="font-medium truncate max-w-[120px] sm:max-w-[180px]">
          {selectedTrip ? selectedTrip.destination : 'General Checklist'}
        </span>
        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
          {selectedTrip ? 'Trip' : 'Global'}
        </span>
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-xl z-30 overflow-hidden text-xs font-mono animate-in fade-in duration-100">
          <div className="p-1.5 border-b border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                !selectedTripId
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <div>
                <span className="block">General Checklist</span>
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                  Universal standalone checklist
                </span>
              </div>
              {!selectedTripId && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
            </button>
          </div>

          {trips.length > 0 ? (
            <div className="max-h-48 overflow-y-auto p-1.5 custom-scrollbar space-y-0.5">
              {trips.map((trip) => {
                const isSelected = selectedTripId === trip.id
                return (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => handleSelect(trip.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <span className="block truncate">{trip.destination}</span>
                      <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                        {trip.start_date?.split('T')[0]}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-3 text-center text-zinc-400 text-xs">
              No itineraries found
            </div>
          )}

          <div className="p-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
            <Link
              to="/trips"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Register New Trip</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
