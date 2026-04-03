import { useState, useCallback, useEffect } from 'react'
import { getExpenses, addExpense, deleteExpense, getExpenseSummary } from '../../shared/services'

export function useExpenses(selectedTripId) {
    const [expenses, setExpenses] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadExpensesData() {
            if (!selectedTripId) {
                setExpenses([])
                setSummary(null)
                return
            }
            setLoading(true)
            try {
                const [expData, sumData] = await Promise.all([
                    getExpenses(selectedTripId),
                    getExpenseSummary(selectedTripId),
                ])
                if (!cancelled) {
                    setExpenses(expData)
                    setSummary(sumData)
                }
            } catch (e) {
                if (!cancelled) console.error('Failed to load expenses:', e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadExpensesData()

        return () => { cancelled = true }
    }, [selectedTripId])

    const saveExpense = useCallback(async (formData) => {
        setSubmitting(true)
        try {
            await addExpense({ ...formData, trip_id: selectedTripId })
            // Refresh expenses after adding
            try {
                const [expData, sumData] = await Promise.all([
                    getExpenses(selectedTripId),
                    getExpenseSummary(selectedTripId),
                ])
                setExpenses(expData)
                setSummary(sumData)
            } catch (err) {
                console.error('Failed to refresh expenses:', err)
            }
            return true
        } catch (err) {
            console.error('Failed to add expense:', err)
            return false
        } finally {
            setSubmitting(false)
        }
    }, [selectedTripId])

    const removeExpense = useCallback(async (id) => {
        try {
            await deleteExpense(id)
            // Refresh expenses after deleting
            try {
                const [expData, sumData] = await Promise.all([
                    getExpenses(selectedTripId),
                    getExpenseSummary(selectedTripId),
                ])
                setExpenses(expData)
                setSummary(sumData)
            } catch (err) {
                console.error('Failed to refresh expenses:', err)
            }
            return true
        } catch (err) {
            console.error('Failed to delete expense:', err)
            return false
        }
    }, [selectedTripId])

    return {
        expenses,
        summary,
        loading,
        submitting,
        saveExpense,
        removeExpense
    }
}
