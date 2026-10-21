import { useState } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Hotel', 'Activities', 'Shopping', 'Health', 'Other']

export function ExpenseForm({ onSubmit, submitting, tripCurrency, initialData }) {
  const getInitialState = () => {
    if (initialData) {
      return {
        amount: initialData.amount || '',
        currency: initialData.currency || tripCurrency || 'USD',
        category: initialData.category || 'Food',
        description: initialData.description || '',
        expense_date: initialData.expense_date || new Date().toISOString().split('T')[0],
      }
    }
    return {
      amount: '',
      currency: tripCurrency || 'USD',
      category: 'Food',
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
    }
  }

  const [formData, setFormData] = useState(getInitialState)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Amount and Currency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.currency !== tripCurrency && (
        <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900/40">
          Trip currency is set to {tripCurrency}. This spend will automatically index using live FX rates.
        </p>
      )}

      {/* Category */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
          Description / Vendor
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g. Shinkansen high-speed rail ticket"
          className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
          Date of Transaction
        </label>
        <input
          type="date"
          value={formData.expense_date}
          onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
          className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 dark:[color-scheme:dark] focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-2 py-2 px-4 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
      >
        {submitting ? 'Recording Transaction...' : 'Record Transaction'}
      </button>
    </form>
  )
}
