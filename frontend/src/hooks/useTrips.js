import { useState, useCallback, useEffect } from 'react'
import { getTrips, createTrip, deleteTrip, getChecklistCount, updateTrip as apiUpdateTrip } from '../services/tripService'

export function useTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTrips()
      setTrips(data)
    } catch (err) {
      console.error('Failed to fetch trips:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const addTrip = useCallback(async (formData) => {
    await createTrip(formData)
    await fetchTrips()
  }, [fetchTrips])

  const editTrip = useCallback(async (tripId, formData) => {
    await apiUpdateTrip(tripId, formData)
    await fetchTrips()
  }, [fetchTrips])

  const removeTrip = useCallback(async (tripId, deleteOption) => {
    await deleteTrip(tripId, deleteOption)
    await fetchTrips()
  }, [fetchTrips])

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
    fetchTrips,
    addTrip,
    editTrip,
    removeTrip,
    getChecklistItemCount
  }
}
