import { useState, useCallback, useEffect } from 'react'
import { getExpenses, addExpense as apiAddExpense, deleteExpense as apiDeleteExpense, getExpenseSummary } from '../services/expenseService'

export function useExpenses(selectedTripId) {
    const [expenses, setExpenses] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

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
            console.error('Failed to load expenses:', e)
        } finally {
            setLoading(false)
        }
    }, [selectedTripId])

    useEffect(() => {
        loadExpenses()
    }, [loadExpenses])

    const saveExpense = useCallback(async (formData) => {
        setSubmitting(true)
        try {
            await apiAddExpense({ ...formData, trip_id: selectedTripId })
            await loadExpenses()
            return true
        } catch (err) {
            console.error('Failed to add expense:', err)
            return false
        } finally {
            setSubmitting(false)
        }
    }, [selectedTripId, loadExpenses])

    const removeExpense = useCallback(async (id) => {
        try {
            await apiDeleteExpense(id)
            await loadExpenses()
            return true
        } catch (err) {
            console.error('Failed to delete expense:', err)
            return false
        }
    }, [loadExpenses])

    return {
        expenses,
        summary,
        loading,
        submitting,
        loadExpenses,
        saveExpense,
        removeExpense
    }
}
