import { Trash2, AlertCircle } from 'lucide-react'

const CATEGORY_COLORS = {
    Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Hotel: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Activities: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

export function ExpenseList({ expenses, loading, onDelete }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-semibold text-slate-900 dark:text-white">All Expenses</h2>
            </div>
            {loading ? (
                <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : expenses.length === 0 ? (
                <div className="p-12 text-center">
                    <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No expenses yet for this trip.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {expenses.map((exp) => (
                        <div key={exp.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`}>
                                    {exp.category}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{exp.description || 'No description'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{exp.expense_date?.split('T')[0]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {exp.currency} {parseFloat(exp.amount).toFixed(2)}
                                    </p>
                                    {exp.normalized_amount && (
                                        <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">
                                            ≈ {exp.trip_currency} {parseFloat(exp.normalized_amount).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onDelete(exp.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
