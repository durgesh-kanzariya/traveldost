import { useState, useEffect, useCallback } from 'react'
import { getAllGuides, getGuideByCountry, getCachedLocation, detectAndCacheLocation } from '../services'

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

    const detectLocation = useCallback(async (forceRefresh = false) => {
        setLoading(true)
        setLocationError(null)
        try {
            if (!forceRefresh) {
                const cachedLocation = getCachedLocation()
                if (cachedLocation) {
                    await fetchEmergencyData(cachedLocation.country)
                    return
                }
            }

            if (forceRefresh) {
                sessionStorage.removeItem('traveldost_safezones_cache');
            }

            const location = await detectAndCacheLocation(forceRefresh)
            await fetchEmergencyData(location.country)
        } catch (err) {
            console.error("Location detection failed:", err)
            setLocationError("Location access denied")
            await fetchEmergencyData('India')
        }
    }, [fetchEmergencyData])

    useEffect(() => {
        getAllGuides().then(setAllCountries).catch(console.error)
    }, [])

    useEffect(() => {
        detectLocation()
    }, [detectLocation])

    return {
        selectedCountry,
        activeData,
        allCountries,
        loading,
        locationError,
        detectLocation,
        fetchEmergencyData
    }
}
