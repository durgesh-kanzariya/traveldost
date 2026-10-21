import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllGuides, getGuideByCountry, getCachedLocation, detectAndCacheLocation } from '../../shared/services'

export function useEmergency() {
    const [selectedCountry, setSelectedCountry] = useState('India')
    const [activeData, setActiveData] = useState(null)
    const [allCountries, setAllCountries] = useState([])
    const [loading, setLoading] = useState(false)
    const [locationError, setLocationError] = useState(null)
    const emergencyRequestIdRef = useRef(0)

    const fetchEmergencyData = useCallback(async (countryName, passedRequestId) => {
        const localId = passedRequestId !== undefined ? passedRequestId : ++emergencyRequestIdRef.current
        try {
            setLoading(true)
            const data = await getGuideByCountry(countryName)
            if (emergencyRequestIdRef.current !== localId) return

            const isDatabase = Boolean(data && data.source === 'database' && (data.id || data.country_name))
            const clean = (val) => (val && typeof val === 'string' && val.trim() && val !== '--' ? val.trim() : null)
            setActiveData({
                police: isDatabase ? clean(data?.police_number) : null,
                ambulance: isDatabase ? clean(data?.ambulance_number) : null,
                fire: isDatabase ? clean(data?.fire_number) : null,
                embassy: isDatabase ? clean(data?.embassy_number) : null,
                note: `Emergency contacts for ${data?.country_name || countryName}`,
                rules: data?.local_rules || [],
                isVerified: false,
                isDatabase,
                provenance: data?.provenance || (isDatabase ? 'Listed Regional Contact' : '112 Universal Emergency Number — Available in EU and select global networks (verify local carrier)'),
                source: data?.source || (isDatabase ? 'database' : 'fallback')
            })
            setSelectedCountry(data?.country_name || countryName)
        } catch (err) {
            if (emergencyRequestIdRef.current !== localId) return
            console.error('Failed to load emergency data:', err)
            setActiveData({
                police: null,
                ambulance: null,
                fire: null,
                embassy: null,
                note: 'Offline / Fallback Mode',
                rules: ['Emergency service data currently unavailable offline.'],
                isVerified: false,
                isDatabase: false,
                provenance: '112 Universal Emergency Number — Available in EU and select global networks (verify local carrier)',
                source: 'offline_fallback'
            })
        } finally {
            if (emergencyRequestIdRef.current === localId) {
                setLoading(false)
            }
        }
    }, [])

    // Fetch all countries list on mount
    useEffect(() => {
        let isMounted = true
        getAllGuides()
            .then(data => {
                if (isMounted) setAllCountries(data || [])
            })
            .catch(console.error)
        return () => {
            isMounted = false
        }
    }, [])

    // Detect location and load emergency data on mount
    useEffect(() => {
        let isCancelled = false
        const requestId = ++emergencyRequestIdRef.current

        async function loadLocationData() {
            setLoading(true)
            setLocationError(null)
            try {
                let cachedLocation = getCachedLocation()
                if (!cachedLocation) {
                    cachedLocation = await detectAndCacheLocation()
                }
                if (isCancelled || requestId !== emergencyRequestIdRef.current) return

                if (cachedLocation && cachedLocation.country) {
                    await fetchEmergencyData(cachedLocation.country, requestId)
                }
            } catch (err) {
                if (!isCancelled && requestId === emergencyRequestIdRef.current) {
                    console.error("Location detection failed:", err)
                    setLocationError("Location access denied")
                    await fetchEmergencyData('India', requestId)
                }
            } finally {
                if (!isCancelled && requestId === emergencyRequestIdRef.current) {
                    setLoading(false)
                }
            }
        }

        loadLocationData()

        return () => {
            isCancelled = true
        }
    }, [fetchEmergencyData])

    // Manual location refresh function
    const refreshLocation = useCallback(async (forceRefresh = false) => {
        const requestId = ++emergencyRequestIdRef.current
        setLoading(true)
        setLocationError(null)

        if (forceRefresh) {
            sessionStorage.removeItem('traveldost_safezones_cache')
        }

        try {
            const location = await detectAndCacheLocation(forceRefresh)
            if (requestId === emergencyRequestIdRef.current) {
                await fetchEmergencyData(location.country, requestId)
            }
        } catch (err) {
            if (requestId === emergencyRequestIdRef.current) {
                console.error("Location refresh failed:", err)
                setLocationError("Location access denied")
                await fetchEmergencyData('India', requestId)
            }
        } finally {
            if (requestId === emergencyRequestIdRef.current) setLoading(false)
        }
    }, [fetchEmergencyData])

    return {
        selectedCountry,
        activeData,
        allCountries,
        loading,
        locationError,
        refreshLocation,
        detectLocation: refreshLocation,
        fetchEmergencyData
    }
}
