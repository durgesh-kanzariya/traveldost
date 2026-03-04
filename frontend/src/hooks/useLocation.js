import { useState, useCallback } from 'react'
import { detectAndCacheLocation, getCachedLocation } from '../services/locationService'

const COUNTRY_NORMALIZATION = {
  'United States': 'United States',
  'United Kingdom': 'United Kingdom',
  'United Arab Emirates': 'United Arab Emirates',
  'Niger': 'Niger',
  'Central African Republic': 'Central African Republic',
  'Iran': 'Iran',
}

export function useLocation() {
  const [location, setLocation] = useState({
    country: 'Loading...',
    city: '',
    lat: 20.5937,
    lng: 78.9629
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizeCountry = useCallback((rawCountry) => {
    for (const key of Object.keys(COUNTRY_NORMALIZATION)) {
      if (rawCountry.includes(key)) {
        return COUNTRY_NORMALIZATION[key]
      }
    }
    return rawCountry
  }, [])

  const detectLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const loc = await detectAndCacheLocation()
      const normalizedCountry = normalizeCountry(loc.country)

      setLocation({
        country: normalizedCountry,
        city: loc.city,
        lat: loc.lat,
        lng: loc.lng
      })

      return normalizedCountry
    } catch (err) {
      console.error('Location detection failed:', err)
      setError('Location access denied')
      return 'India'
    } finally {
      setLoading(false)
    }
  }, [normalizeCountry])

  const getCached = useCallback(() => {
    return getCachedLocation()
  }, [])

  return {
    location,
    loading,
    error,
    detectLocation,
    getCached,
    normalizeCountry
  }
}
