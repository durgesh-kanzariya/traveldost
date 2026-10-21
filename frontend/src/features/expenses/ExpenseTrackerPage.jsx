import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout'
import { Modal } from '../../components/ui'
import { getTrips } from '../../shared/services'
import { useExpenses } from './useExpenses'
import { ExpenseSummary, ExpenseList, ExpenseForm } from './'
import { Plus, AlertTriangle } from 'lucide-react'

export function ExpenseTrackerPage() {
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(null)

  const {
    expenses,
    summary,
    loading,
    submitting,
    saveExpense,
    removeExpense,
  } = useExpenses(selectedTripId)

  const selectedTrip = trips.find((t) => String(t.id) === String(selectedTripId))
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

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense)
  }

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return
    await removeExpense(expenseToDelete.id)
    setExpenseToDelete(null)
  }

  const budgetProgress = summary
    ? Math.min((parseFloat(summary.total_spent) / parseFloat(summary.budget)) * 100, 100)
    : 0
  const isOverBudget = summary && parseFloat(summary.total_spent) > parseFloat(summary.budget)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════
            HEADER & TRIP SELECTOR
        ═════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Expense Ledger
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Multi-currency spend tracking, live FX conversion, and budget burn rate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Trip Selector Dropdown */}
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              aria-label="Select trip itinerary"
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
            >
              {trips.length === 0 && <option>No trips available</option>}
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.destination || 'Unnamed Route'} ({t.start_date?.split('T')[0]})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              disabled={!selectedTripId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SUMMARY DECK
        ═════════════════════════════════════════ */}
        <ExpenseSummary
          summary={summary}
          isOverBudget={isOverBudget}
          budgetProgress={budgetProgress}
        />

        {/* ════════════════════════════════════════
            EXPENSE LEDGER LIST
        ═════════════════════════════════════════ */}
        <ExpenseList
          expenses={expenses}
          loading={loading}
          onDelete={handleDeleteClick}
        />

        {/* ════════════════════════════════════════
            RECORD TRANSACTION MODAL
        ═════════════════════════════════════════ */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Record New Transaction"
          >
            <ExpenseForm
              onSubmit={handleAddExpense}
              submitting={submitting}
              tripCurrency={tripCurrency}
            />
          </Modal>
        )}

        {/* ════════════════════════════════════════
            CUSTOM DELETE CONFIRMATION MODAL
        ═════════════════════════════════════════ */}
        {expenseToDelete && (
          <Modal
            isOpen={Boolean(expenseToDelete)}
            onClose={() => setExpenseToDelete(null)}
            title="Delete Expense Record"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <p className="text-xs text-rose-700 dark:text-rose-300">
                  Are you sure you want to remove this expense of{' '}
                  <span className="font-mono font-semibold">
                    {expenseToDelete.currency} {parseFloat(expenseToDelete.amount).toFixed(2)}
                  </span>
                  {expenseToDelete.description ? ` (${expenseToDelete.description})` : ''}?
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExpenseToDelete(null)}
                  className="flex-1 py-2 px-3 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 px-3 text-xs font-medium rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}
