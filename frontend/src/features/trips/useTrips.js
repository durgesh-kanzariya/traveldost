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
    const created = await createTrip(formData)
    const data = await getTrips()
    setTrips(data)
    return created
  }, [])

  const editTrip = useCallback(async (tripId, formData) => {
    const updated = await apiUpdateTrip(tripId, formData)
    const data = await getTrips()
    setTrips(data)
    return updated
  }, [])

  const removeTrip = useCallback(async (tripId, deleteOption) => {
    await deleteTrip(tripId, deleteOption)
    const data = await getTrips()
    setTrips(data)
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
