import { MapPin, Calendar, DollarSign, Pencil, Trash2, ArrowRight } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getStatus(startDate, endDate) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now < start) {
    return {
      label: 'UPCOMING',
      class: 'border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
    }
  }
  if (now >= start && now <= end) {
    return {
      label: 'IN TRANSIT',
      class: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    }
  }
  return {
    label: 'ARCHIVED',
    class: 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
  }
}

export function TripCard({ trip, onEdit, onDelete }) {
  const status = getStatus(trip.start_date, trip.end_date)
  const hasMultipleStops = trip.destinations && trip.destinations.length > 1

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between group">
      <div>
        {/* Top bar: Status & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${status.class} font-medium`}
            >
              {status.label}
            </span>
            {hasMultipleStops && (
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                {trip.destinations.length} STOPS
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(trip)}
              title="Edit itinerary"
              aria-label={`Edit ${trip.destination}`}
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(trip)}
              title="Delete itinerary"
              aria-label={`Delete ${trip.destination}`}
              className="p-1.5 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Destination Path Header */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="min-w-0 flex-1">
            {hasMultipleStops ? (
              <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {trip.destinations.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    <span>{d}</span>
                    {i < trip.destinations.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                {trip.destination || 'Unassigned Destination'}
              </h3>
            )}
          </div>
        </div>
      </div>

      {/* Metadata strip */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">
            {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
          </span>
        </div>

        {trip.budget && (
          <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-semibold shrink-0 ml-2">
            <DollarSign className="w-3 h-3 text-zinc-400" />
            <span>
              {trip.currency} {Number(trip.budget).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
