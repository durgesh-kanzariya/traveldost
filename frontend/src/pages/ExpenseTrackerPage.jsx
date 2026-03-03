import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Modal } from '../components/ui/Modal'
import { getTrips } from '../services/tripService'
import { getExpenses, addExpense, deleteExpense, getExpenseSummary } from '../services/expenseService'
import { DollarSign, Plus, Trash2, TrendingDown, Wallet, Tag, AlertCircle } from 'lucide-react'

const CATEGORIES = ['Food', 'Transport', 'Hotel', 'Activities', 'Shopping', 'Health', 'Other']

const CATEGORY_COLORS = {
    Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Hotel: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Activities: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

const INITIAL_FORM = {
    amount: '',
    currency: 'USD',
    category: 'Food',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
}

export function ExpenseTrackerPage() {
    const [trips, setTrips] = useState([])
    const [selectedTripId, setSelectedTripId] = useState('')
    const [expenses, setExpenses] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [submitting, setSubmitting] = useState(false)

    const selectedTrip = trips.find(t => String(t.id) === String(selectedTripId))
    const tripCurrency = selectedTrip?.currency || 'USD'

    useEffect(() => {
        getTrips().then((data) => {
            setTrips(data)
            if (data.length > 0) setSelectedTripId(String(data[0].id))
        })
    }, [])

    // Auto-sync expense currency with selected trip's currency
    useEffect(() => {
        if (tripCurrency) {
            setFormData(prev => ({ ...prev, currency: tripCurrency }))
        }
    }, [tripCurrency])

    const loadExpenses = useCallback(async () => {
        if (!selectedTripId) return
        setLoading(true)
        try {
            const [expData, sumData] = await Promise.all([
                getExpenses(selectedTripId),
                getExpenseSummary(selectedTripId),
            ])
            setExpenses(expData)
            setSummary(sumData)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [selectedTripId])

    useEffect(() => {
        loadExpenses()
    }, [loadExpenses])

    const handleAddExpense = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await addExpense({ ...formData, trip_id: selectedTripId })
            setShowModal(false)
            setFormData({ ...INITIAL_FORM, currency: tripCurrency }) // reset with trip currency
            await loadExpenses()
        } catch (err) {
            alert('Failed to add expense')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this expense?')) return
        await deleteExpense(id)
        await loadExpenses()
    }

    const budgetProgress = summary
        ? Math.min((parseFloat(summary.total_spent) / parseFloat(summary.budget)) * 100, 100)
        : 0
    const isOverBudget = summary && parseFloat(summary.total_spent) > parseFloat(summary.budget)

    return (
        <DashboardLayout>
            <div className="mb-8">
                <Breadcrumbs />
                <div className="flex items-center justify-between mt-2 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl flex items-center gap-3">
                            <DollarSign className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                            Expense Tracker
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Track spending for each trip</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedTripId}
                            onChange={(e) => setSelectedTripId(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        >
                            {trips.length === 0 && <option>No trips found</option>}
                            {trips.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.destination || 'Unnamed Trip'} ({t.start_date?.split('T')[0]})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={!selectedTripId}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Expense
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
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
            )}

            {/* Category Breakdown */}
            {summary?.by_category?.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Tag className="h-4 w-4" /> Spending by Category
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {summary.by_category.map((c) => (
                            <div key={c.category} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Other}`}>
                                {c.category}: {summary.currency} {parseFloat(c.category_total).toFixed(2)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Expense List */}
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
                                        onClick={() => handleDelete(exp.id)}
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

            {/* Add Expense Modal */}
            {showModal && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Expense">
                    <form onSubmit={handleAddExpense} className="space-y-4">
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
                </Modal>
            )}
        </DashboardLayout>
    )
}
