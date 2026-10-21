import { AlertCircle, Trash2 } from 'lucide-react'

const CATEGORY_STYLES = {
  Food: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300',
  Transport: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300',
  Hotel: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300',
  Activities: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300',
  Shopping: 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/30 text-pink-800 dark:text-pink-300',
  Health: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300',
  Other: 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
}

export function ExpenseList({ expenses, loading, onDelete }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden">
      {/* Ledger Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Disbursement Ledger
          </h2>
          {loading && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          )}
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
          {expenses.length} Records
        </span>
      </div>

      {loading && expenses.length === 0 ? (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-2 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-16 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-1">
                  <div className="w-32 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-20 h-2.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
                </div>
              </div>
              <div className="w-20 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="py-14 text-center">
          <div className="w-9 h-9 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            No expenses logged for this itinerary
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            Record meals, transit, lodging, or excursions above.
          </p>
        </div>
      ) : (
        <div
          className={`divide-y divide-zinc-100 dark:divide-zinc-800/80 transition-opacity duration-150 ${
            loading ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {expenses.map((exp) => {
            const isDifferentCurrency = exp.currency !== exp.trip_currency
            const hasNormalized = exp.normalized_amount !== null && exp.normalized_amount !== undefined

            return (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border shrink-0 ${
                      CATEGORY_STYLES[exp.category] || CATEGORY_STYLES.Other
                    }`}
                  >
                    {exp.category}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {exp.description || 'Uncategorized expense'}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {exp.expense_date?.split('T')[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-3">
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                      {exp.currency} {parseFloat(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {isDifferentCurrency && (
                      <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        {hasNormalized ? (
                          <>
                            ≈ {exp.trip_currency} {parseFloat(exp.normalized_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </>
                        ) : (
                          <span className="text-amber-500 dark:text-amber-400">FX pending</span>
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(exp)}
                    title="Remove expense"
                    aria-label="Remove expense item"
                    className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors opacity-80 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
