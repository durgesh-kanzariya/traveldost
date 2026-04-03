import { useState, useEffect } from 'react'
import { DashboardLayout, Breadcrumbs } from '../../components/layout'
import { Modal } from '../../components/ui'
import { getTrips } from '../../shared/services'
import { useExpenses } from './useExpenses'
import { ExpenseSummary, ExpenseList, ExpenseForm } from './'
import { DollarSign, Plus } from 'lucide-react'

export function ExpenseTrackerPage() {
    const [trips, setTrips] = useState([])
    const [selectedTripId, setSelectedTripId] = useState('')
    const [showModal, setShowModal] = useState(false)

    const {
        expenses,
        summary,
        loading,
        submitting,
        saveExpense,
        removeExpense
    } = useExpenses(selectedTripId)

    const selectedTrip = trips.find(t => String(t.id) === String(selectedTripId))
    const tripCurrency = selectedTrip?.currency || 'USD'

    useEffect(() => {
        getTrips().then((data) => {
            setTrips(data)
            if (data.length > 0) setSelectedTripId(String(data[0].id))
        })
    }, [])

    const handleAddExpense = async (formData) => {
        const success = await saveExpense(formData)
        if (success) {
            setShowModal(false)
        } else {
            alert('Failed to add expense')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this expense?')) return
        await removeExpense(id)
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

            <ExpenseSummary
                summary={summary}
                isOverBudget={isOverBudget}
                budgetProgress={budgetProgress}
            />

            <ExpenseList
                expenses={expenses}
                loading={loading}
                onDelete={handleDelete}
            />

            {showModal && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Expense">
                    <ExpenseForm
                        onSubmit={handleAddExpense}
                        submitting={submitting}
                        tripCurrency={tripCurrency}
                    />
                </Modal>
            )}
        </DashboardLayout>
    )
}
