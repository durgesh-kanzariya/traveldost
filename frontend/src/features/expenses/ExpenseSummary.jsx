import { Wallet, TrendingDown, AlertCircle } from 'lucide-react';

export function ExpenseSummary({ summary, isOverBudget, budgetProgress }) {
    if (!summary) return null;

    const isPartial = summary.conversion_status === 'partial';
    const isUnavailable = summary.conversion_status === 'unavailable';
    const isConversionIncomplete = isPartial || isUnavailable;

    return (
        <div className="space-y-4 mb-8">
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                        <Wallet className="h-4 w-4" /> Budget
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {summary.currency} {parseFloat(summary.budget || 0).toFixed(2)}
                    </p>
                </div>

                <div className={`rounded-2xl border p-5 ${
                    isOverBudget
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm mb-1">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" /> Total Spent
                        </div>
                        {isPartial && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                                Partial Conversion
                            </span>
                        )}
                        {isUnavailable && (
                            <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold">
                                Conversion Unavailable
                            </span>
                        )}
                        {!isConversionIncomplete && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                                Normalized
                            </span>
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        {summary.currency} {parseFloat(summary.total_spent || 0).toFixed(2)}
                    </p>
                    {isConversionIncomplete && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {isUnavailable ? 'Exchange rates unavailable' : 'Incomplete total due to missing currency rates'}
                        </p>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                        Budget Used
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-1">
                        <div
                            className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-sky-500'}`}
                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                        />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {budgetProgress.toFixed(1)}% used {isOverBudget && <span className="text-red-500 font-medium">⚠ Over budget!</span>}
                    </p>
                </div>
            </div>

            {/* Per-currency breakdown when multi-currency or incomplete conversion */}
            {summary.by_currency && Object.keys(summary.by_currency).length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Spend by Original Currency:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(summary.by_currency).map(([curr, amt]) => (
                            <div key={curr} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                                <span className="font-bold text-sky-600 dark:text-sky-400">{curr}</span>
                                <span>{parseFloat(amt || 0).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
