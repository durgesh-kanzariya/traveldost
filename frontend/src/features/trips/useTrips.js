import { useState, useCallback, useEffect } from 'react'
import { getTrips, createTrip, deleteTrip, getChecklistCount, updateTrip as apiUpdateTrip } from '../../shared/services'

export function useTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchTripsData() {
      setLoading(true)
      try {
        const data = await getTrips()
        if (!cancelled) setTrips(data)
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch trips:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTripsData()

    return () => { cancelled = true }
  }, [])

  const addTrip = useCallback(async (formData) => {
    await createTrip(formData)
    // Re-fetch trips after adding
    try {
      const data = await getTrips()
      setTrips(data)
    } catch (err) {
      console.error('Failed to refresh trips:', err)
    }
  }, [])

  const editTrip = useCallback(async (tripId, formData) => {
    await apiUpdateTrip(tripId, formData)
    // Re-fetch trips after editing
    try {
      const data = await getTrips()
      setTrips(data)
    } catch (err) {
      console.error('Failed to refresh trips:', err)
    }
  }, [])

  const removeTrip = useCallback(async (tripId, deleteOption) => {
    await deleteTrip(tripId, deleteOption)
    // Re-fetch trips after deleting
    try {
      const data = await getTrips()
      setTrips(data)
    } catch (err) {
      console.error('Failed to refresh trips:', err)
    }
  }, [])

  const getChecklistItemCount = useCallback(async (tripId) => {
    try {
      return await getChecklistCount(tripId)
    } catch {
      return 0
    }
  }, [])

  return {
    trips,
    loading,
    addTrip,
    editTrip,
    removeTrip,
    getChecklistItemCount
  }
}
