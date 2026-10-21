import { useState, useCallback, useEffect, useRef } from 'react'
import { getExpenses, addExpense, deleteExpense, getExpenseSummary } from '../../shared/services'

export function useExpenses(selectedTripId) {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // In-memory cache per tripId for instantaneous trip switching
  const cacheRef = useRef({})

  useEffect(() => {
    let cancelled = false

    async function loadExpensesData() {
      if (!selectedTripId) {
        setExpenses([])
        setSummary(null)
        return
      }

      // Check if we have cached data for instantaneous render
      const cached = cacheRef.current[selectedTripId]
      if (cached) {
        setExpenses(cached.expenses)
        setSummary(cached.summary)
        // Background revalidation without blocking UI
      } else {
        setLoading(true)
      }

      try {
        const [expData, sumData] = await Promise.all([
          getExpenses(selectedTripId),
          getExpenseSummary(selectedTripId),
        ])
        if (!cancelled) {
          cacheRef.current[selectedTripId] = { expenses: expData, summary: sumData }
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

    return () => {
      cancelled = true
    }
  }, [selectedTripId])

  const saveExpense = useCallback(
    async (formData) => {
      setSubmitting(true)
      try {
        await addExpense({ ...formData, trip_id: selectedTripId })
        try {
          const [expData, sumData] = await Promise.all([
            getExpenses(selectedTripId),
            getExpenseSummary(selectedTripId),
          ])
          cacheRef.current[selectedTripId] = { expenses: expData, summary: sumData }
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
    },
    [selectedTripId]
  )

  const removeExpense = useCallback(
    async (id) => {
      try {
        await deleteExpense(id)
        try {
          const [expData, sumData] = await Promise.all([
            getExpenses(selectedTripId),
            getExpenseSummary(selectedTripId),
          ])
          cacheRef.current[selectedTripId] = { expenses: expData, summary: sumData }
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
    },
    [selectedTripId]
  )

  return {
    expenses,
    summary,
    loading,
    submitting,
    saveExpense,
    removeExpense,
  }
}
