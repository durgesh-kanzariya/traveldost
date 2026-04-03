import { useState } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Hotel', 'Activities', 'Shopping', 'Health', 'Other']

export function ExpenseForm({ onSubmit, submitting, tripCurrency, initialData }) {
    // Initialize state based on initialData or default values
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount *</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                    <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    >
                        {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {formData.currency !== tripCurrency && (
                        <p className="mt-1 text-xs text-amber-500">⚠ Trip budget is in {tripCurrency}. This expense will be stored as {formData.currency}.</p>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    placeholder="e.g., Dinner at restaurant"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
                {submitting ? 'Adding...' : 'Add Expense'}
            </button>
        </form>
    )
}
