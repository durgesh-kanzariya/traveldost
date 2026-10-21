import { Wallet, TrendingDown, AlertCircle } from 'lucide-react'

export function ExpenseSummary({ summary, isOverBudget, budgetProgress }) {
  if (!summary) return null

  const isPartial = summary.conversion_status === 'partial'
  const isUnavailable = summary.conversion_status === 'unavailable'
  const isConversionIncomplete = isPartial || isUnavailable

  return (
    <div className="space-y-3 mb-6">
      {/* 3-Card Summary Deck */}
      <div className="grid sm:grid-cols-3 gap-3">
        {/* Total Budget Card */}
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs font-mono mb-1.5">
            <Wallet className="w-3.5 h-3.5 text-zinc-400" />
            <span className="uppercase tracking-wider">Allocated Budget</span>
          </div>
          <p className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {summary.currency} {parseFloat(summary.budget || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Spent Card */}
        <div
          className={`p-4 rounded-lg border ${
            isOverBudget
              ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
              : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
              <TrendingDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="uppercase tracking-wider">Total Disbursed</span>
            </div>
            {isPartial && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                Partial FX
              </span>
            )}
            {isUnavailable && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                FX Offline
              </span>
            )}
            {!isConversionIncomplete && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                Indexed
              </span>
            )}
          </div>

          <p
            className={`font-mono text-2xl font-bold tracking-tight ${
              isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {summary.currency} {parseFloat(summary.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>

          {isConversionIncomplete && (
            <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>
                {isUnavailable ? 'Exchange rate service offline' : 'Discrepancy due to pending rates'}
              </span>
            </p>
          )}
        </div>

        {/* Burn Rate / Progress Card */}
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="uppercase tracking-wider">Burn Rate</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {budgetProgress.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-rose-500' : 'bg-zinc-900 dark:bg-zinc-100'
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            {isOverBudget ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                Budget ceiling exceeded
              </span>
            ) : (
              <span>Within planned margin</span>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Currency Breakdown Strip */}
      {summary.by_currency && Object.keys(summary.by_currency).length > 0 && (
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1">
            Currency Breakdown:
          </span>
          {Object.entries(summary.by_currency).map(([curr, amt]) => (
            <div
              key={curr}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono"
            >
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{curr}</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {parseFloat(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
