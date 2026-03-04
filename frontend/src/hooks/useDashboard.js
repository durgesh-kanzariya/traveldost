import { useState, useEffect, useCallback } from 'react'
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

    const detectLocation = useCallback(() => {
        setLoading(true)
        setZoom(4)
        setError(null)

        detectAndCacheLocation()
            .then(async (detectedLocation) => {
                let rawCountry = detectedLocation.country;

                // Fix weird API names
                const fixes = {
                    "United States": "United States",
                    "United Kingdom": "United Kingdom",
                    "United Arab Emirates": "United Arab Emirates",
                    "Central African Republic": "Central African Republic"
                };

                for (const [key, value] of Object.entries(fixes)) {
                    if (rawCountry.includes(key)) {
                        rawCountry = value;
                        break;
                    }
                }

                setLocation({
                    country: rawCountry,
                    city: detectedLocation.city,
                    lat: detectedLocation.lat,
                    lng: detectedLocation.lng
                })

                await fetchGuideData(rawCountry)
                setTimeout(() => setZoom(15), 500)
            })
            .catch((err) => {
                console.error("Location detection failed:", err)
                setError("Location access denied")
                fetchGuideData('India')
            })
            .finally(() => setLoading(false))
    }, [fetchGuideData])

    useEffect(() => {
        detectLocation()
        fetchUpcomingTrip()
    }, [detectLocation, fetchUpcomingTrip])

    return {
        location,
        zoom,
        loading,
        countryData,
        error,
        upcomingTrip,
        tripEmergencyData,
        detectLocation
    }
}
