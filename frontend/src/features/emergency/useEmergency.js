import { useState, useEffect, useCallback } from 'react'
import { getAllGuides, getGuideByCountry, getCachedLocation, detectAndCacheLocation } from '../../shared/services'

export function useEmergency() {
    const [selectedCountry, setSelectedCountry] = useState('India')
    const [activeData, setActiveData] = useState(null)
    const [allCountries, setAllCountries] = useState([])
    const [loading, setLoading] = useState(false)
    const [locationError, setLocationError] = useState(null)

    const fetchEmergencyData = useCallback(async (countryName) => {
        try {
            setLoading(true)
            const data = await getGuideByCountry(countryName);
            setActiveData({
                police: data.police_number || '112',
                ambulance: data.ambulance_number || '112',
                fire: data.fire_number || '112',
                embassy: data.embassy_number || 'Check Local Listings',
                note: `Emergency contacts for ${data.country_name || countryName}`,
                rules: data.local_rules || []
            })
            setSelectedCountry(data.country_name || countryName)
        } catch (err) {
            console.error(err)
            setActiveData({ police: '112', ambulance: '112', fire: '112', embassy: '--', note: 'Offline Mode' })
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
        let cancelled = false

        async function loadLocationData() {
            setLoading(true)
            setLocationError(null)
            try {
                let cachedLocation = getCachedLocation()
                if (!cachedLocation) {
                    cachedLocation = await detectAndCacheLocation()
                }
                if (cachedLocation && cachedLocation.country) {
                    // For emergency, we use the country directly, not language
                    if (!cancelled) {
                        await fetchEmergencyData(cachedLocation.country)
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Location detection failed:", err)
                    setLocationError("Location access denied")
                    await fetchEmergencyData('India')
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadLocationData()

        return () => { cancelled = true }
    }, [fetchEmergencyData])

    // Manual location refresh function
    const refreshLocation = useCallback(async (forceRefresh = false) => {
        let cancelled = false
        setLoading(true)
        setLocationError(null)

        if (forceRefresh) {
            sessionStorage.removeItem('traveldost_safezones_cache')
        }

        try {
            const location = await detectAndCacheLocation(forceRefresh)
            if (!cancelled) {
                await fetchEmergencyData(location.country)
            }
        } catch (err) {
            if (!cancelled) {
                console.error("Location refresh failed:", err)
                setLocationError("Location access denied")
                await fetchEmergencyData('India')
            }
        } finally {
            if (!cancelled) setLoading(false)
        }

        return () => { cancelled = true }
    }, [fetchEmergencyData])

    return {
        selectedCountry,
        activeData,
        allCountries,
        loading,
        locationError,
        refreshLocation,
        fetchEmergencyData
    }
}
