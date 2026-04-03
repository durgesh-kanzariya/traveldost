import { Wallet, TrendingDown } from 'lucide-react';

export function ExpenseSummary({ summary, isOverBudget, budgetProgress }) {
    if (!summary) return null

    return (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                    <Wallet className="h-4 w-4" /> Budget
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {summary.currency} {parseFloat(summary.budget || 0).toFixed(2)}
                </p>
            </div>
            <div className={`rounded-2xl border p-5 ${isOverBudget ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                    <TrendingDown className="h-4 w-4" /> Total Spent
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Normalized</span>
                </div>
                <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {summary.currency} {parseFloat(summary.total_spent || 0).toFixed(2)}
                </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                    Budget Used
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-1">
                    <div
                        className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-sky-500'}`}
                        style={{ width: `${budgetProgress}%` }}
                    />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {budgetProgress.toFixed(1)}% used {isOverBudget && <span className="text-red-500 font-medium">⚠ Over budget!</span>}
                </p>
            </div>
        </div>
    )
}
