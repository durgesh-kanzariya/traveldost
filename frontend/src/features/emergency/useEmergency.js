import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllGuides, getGuideByCountry, getCachedLocation, detectAndCacheLocation } from '../../shared/services'

export function useEmergency() {
    const [selectedCountry, setSelectedCountry] = useState('India')
    const [activeData, setActiveData] = useState(null)
    const [allCountries, setAllCountries] = useState([])
    const [loading, setLoading] = useState(false)
    const [locationError, setLocationError] = useState(null)
    const emergencyRequestIdRef = useRef(0)

    const fetchEmergencyData = useCallback(async (countryName) => {
        try {
            setLoading(true)
            const data = await getGuideByCountry(countryName);
            const isVerified = Boolean(data && data.is_verified !== false && data.source !== 'fallback' && (data.id || data.country_name))
            setActiveData({
                police: data.police_number || '112',
                ambulance: data.ambulance_number || '112',
                fire: data.fire_number || '112',
                embassy: data.embassy_number || 'Check Local Listings',
                note: `Emergency contacts for ${data.country_name || countryName}`,
                rules: data.local_rules || [],
                isVerified,
                source: data.source || (isVerified ? 'database' : 'fallback')
            })
            setSelectedCountry(data.country_name || countryName)
        } catch (err) {
            console.error('Failed to load emergency data:', err)
            setActiveData({
                police: '112',
                ambulance: '112',
                fire: '112',
                embassy: '--',
                note: 'Offline / Fallback Mode',
                rules: ['Emergency service data currently unavailable offline.'],
                isVerified: false,
                source: 'offline_fallback'
            })
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch all countries list on mount
    useEffect(() => {
        getAllGuides().then(setAllCountries).catch(console.error)
    }, [])

    // Detect location and load emergency data on mount
    useEffect(() => {
        const requestId = ++emergencyRequestIdRef.current

        async function loadLocationData() {
            setLoading(true)
            setLocationError(null)
            try {
                let cachedLocation = getCachedLocation()
                if (!cachedLocation) {
                    cachedLocation = await detectAndCacheLocation()
                }
                if (cachedLocation && cachedLocation.country) {
                    if (requestId === emergencyRequestIdRef.current) {
                        await fetchEmergencyData(cachedLocation.country)
                    }
                }
            } catch (err) {
                if (requestId === emergencyRequestIdRef.current) {
                    console.error("Location detection failed:", err)
                    setLocationError("Location access denied")
                    await fetchEmergencyData('India')
                }
            } finally {
                if (requestId === emergencyRequestIdRef.current) setLoading(false)
            }
        }

        loadLocationData()

        return () => { emergencyRequestIdRef.current++ }
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
                await fetchEmergencyData(location.country)
            }
        } catch (err) {
            if (requestId === emergencyRequestIdRef.current) {
                console.error("Location refresh failed:", err)
                setLocationError("Location access denied")
                await fetchEmergencyData('India')
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
