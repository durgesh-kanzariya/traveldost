
function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getStatus(startDate, endDate) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now < start) return { label: 'Upcoming', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  if (now >= start && now <= end) return { label: 'Ongoing', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
  return { label: 'Completed', class: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' }
}
import { MapPin, Calendar, DollarSign, Pencil, Trash2 } from 'lucide-react';

export function TripCard({ trip, onEdit, onDelete }) {
  const status = getStatus(trip.start_date, trip.end_date)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white leading-snug">
              {trip.destinations && trip.destinations.length > 1
                ? trip.destinations.join(' → ')
                : (trip.destination || 'Unknown')}
            </h3>
            {trip.destinations && trip.destinations.length > 1 && (
              <p className="text-xs text-slate-400 dark:text-slate-500">{trip.destinations.length} stops</p>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.class}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(trip)}
            className="p-2 text-slate-400 hover:text-sky-500 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(trip)}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
        </div>
        {trip.budget && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <DollarSign className="h-4 w-4" />
            <span>{trip.currency} {Number(trip.budget).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
