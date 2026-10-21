import { useState } from 'react'
import { Plus, MapPin, X } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

export function TripForm({ initialData, onSubmit, countries, countriesLoading, submitLabel = 'Submit' }) {
  const [formData, setFormData] = useState(
    initialData || {
      destinations: [''],
      start_date: '',
      end_date: '',
      budget: '',
      currency: (() => {
        try {
          const user = JSON.parse(sessionStorage.getItem('user'))
          return user?.default_currency || user?.defaultCurrency || 'USD'
        } catch {
          return 'USD'
        }
      })(),
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addStop = () => {
    if (formData.destinations.length < 5) {
      setFormData({ ...formData, destinations: [...formData.destinations, ''] })
    }
  }

  const removeStop = (idx) => {
    setFormData({ ...formData, destinations: formData.destinations.filter((_, i) => i !== idx) })
  }

  const updateStop = (idx, val) => {
    const updated = [...formData.destinations]
    updated[idx] = val
    setFormData({ ...formData, destinations: updated })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Destinations List */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Destinations & Waypoints *
          </label>
          {formData.destinations.length < 5 && (
            <button
              type="button"
              onClick={addStop}
              aria-label="Add another destination stop"
              className="inline-flex items-center gap-1 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {formData.destinations.map((dest, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 min-w-[50px] shrink-0">
                <MapPin className="w-3 h-3 text-zinc-400" />
                {idx === 0 ? 'START' : `STOP ${idx}`}
              </span>

              <div className="flex-1">
                <SearchableSelect
                  id={`trip-destination-${idx}`}
                  value={dest}
                  onChange={(val) => updateStop(idx, val)}
                  options={countries}
                  placeholder="Select or search country..."
                  loading={countriesLoading}
                  ariaLabel={
                    idx === 0
                      ? 'Starting trip destination country'
                      : `Destination stop ${idx} country`
                  }
                />
              </div>

              {formData.destinations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStop(idx)}
                  aria-label={`Remove destination stop ${idx === 0 ? 'Start' : idx}`}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dates Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 dark:[color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            End Date *
          </label>
          <input
            type="date"
            required
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 dark:[color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
      </div>

      {/* Budget & Currency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Budget
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="e.g. 2500"
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          >
            {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-2 py-2 px-4 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
      >
        {submitLabel}
      </button>
    </form>
  )
}
