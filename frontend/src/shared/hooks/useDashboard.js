import { useState, useEffect, useCallback, useRef } from 'react'
import { getGuideByCountry, getUpcomingTrip, detectAndCacheLocation } from '../services'

export function useDashboard() {
    const [location, setLocation] = useState({
        country: 'Loading...',
        city: '',
        lat: 20.5937,
        lng: 78.9629
    })
    const [zoom, setZoom] = useState(4)
    const [loading, setLoading] = useState(true)
    const [countryData, setCountryData] = useState(null)
    const [error, setError] = useState(null)
    const [upcomingTrip, setUpcomingTrip] = useState(null)
    const [tripEmergencyData, setTripEmergencyData] = useState(null)
    const locationRequestIdRef = useRef(0)

    const fetchUpcomingTrip = useCallback(async () => {
        try {
            const trip = await getUpcomingTrip()
            if (trip) {
                setUpcomingTrip(trip)
                const guideData = await getGuideByCountry(trip.destination)
                setTripEmergencyData({
                    police: guideData.police_number,
                    ambulance: guideData.ambulance_number
                })
            }
        } catch (err) {
            console.error("Failed to fetch upcoming trip:", err)
        }
    }, [])

    const fetchGuideData = useCallback(async (countryName) => {
        try {
            const data = await getGuideByCountry(countryName);
            const formattedData = {
                emergency: {
                    police: data.police_number,
                    ambulance: data.ambulance_number
                },
                rules: data.local_rules || []
            }
            setCountryData(formattedData)
        } catch (err) {
            console.error("Failed to fetch guide:", err)
            setCountryData(null)
        }
    }, [])

    useEffect(() => {
        const requestId = ++locationRequestIdRef.current

        async function loadLocation() {
            setLoading(true)
            setZoom(4)
            setError(null)

            try {
                const detectedLocation = await detectAndCacheLocation(false)
                let rawCountry = detectedLocation.country

                const fixes = {
                    "United States": "United States",
                    "United Kingdom": "United Kingdom",
                    "United Arab Emirates": "United Arab Emirates",
                    "Central African Republic": "Central African Republic"
                }

                for (const [key, value] of Object.entries(fixes)) {
                    if (rawCountry.includes(key)) {
                        rawCountry = value
                        break
                    }
                }

                if (requestId === locationRequestIdRef.current) {
                    setLocation({
                        country: rawCountry,
                        city: detectedLocation.city,
                        lat: detectedLocation.lat,
                        lng: detectedLocation.lng
                    })
                    await fetchGuideData(rawCountry)
                    setTimeout(() => setZoom(15), 500)
                }
            } catch (err) {
                if (requestId === locationRequestIdRef.current) {
                    console.error("Location detection failed:", err)
                    setError("Location access denied")
                    await fetchGuideData('India')
                }
            } finally {
                if (requestId === locationRequestIdRef.current) setLoading(false)
            }
        }

        loadLocation()
        fetchUpcomingTrip()

        return () => { locationRequestIdRef.current++ }
    }, [fetchUpcomingTrip, fetchGuideData])

    // Manual location refresh function (callable from components)
    const refreshLocation = useCallback(async (forceRefresh = false) => {
        const requestId = ++locationRequestIdRef.current
        setLoading(true)
        setZoom(4)
        setError(null)

        if (forceRefresh) {
            sessionStorage.removeItem('traveldost_safezones_cache')
        }

        try {
            const detectedLocation = await detectAndCacheLocation(forceRefresh)
            let rawCountry = detectedLocation.country

            const fixes = {
                "United States": "United States",
                "United Kingdom": "United Kingdom",
                "United Arab Emirates": "United Arab Emirates",
                "Central African Republic": "Central African Republic"
            }

            for (const [key, value] of Object.entries(fixes)) {
                if (rawCountry.includes(key)) {
                    rawCountry = value
                    break
                }
            }

            if (requestId === locationRequestIdRef.current) {
                setLocation({
                    country: rawCountry,
                    city: detectedLocation.city,
                    lat: detectedLocation.lat,
                    lng: detectedLocation.lng
                })
                await fetchGuideData(rawCountry)
                setTimeout(() => setZoom(15), 500)
            }
        } catch (err) {
            if (requestId === locationRequestIdRef.current) {
                console.error("Location detection failed:", err)
                setError("Location access denied")
                await fetchGuideData('India')
            }
        } finally {
            if (requestId === locationRequestIdRef.current) setLoading(false)
        }
    }, [fetchGuideData])

    return {
        location,
        zoom,
        loading,
        countryData,
        error,
        upcomingTrip,
        tripEmergencyData,
        refreshLocation
    }
}
