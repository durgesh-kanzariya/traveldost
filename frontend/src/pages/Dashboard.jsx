import { useState, useEffect } from 'react'
import {
  Shield,
  MapPin,
  AlertTriangle,
  Phone,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { InteractiveMap } from '../components/InteractiveMap'
import { Skeleton } from '../components/Skeleton'

export function Dashboard() {
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

  // 1. FETCH DATA FROM YOUR BACKEND
  const fetchGuideData = async (countryName) => {
    try {
      // Call your new API endpoint
      const res = await fetch(`http://localhost:5000/api/guides/${countryName}`)
      const data = await res.json()

      // Format the DB data to match what the UI expects
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
      // Fallback if backend is down
      setCountryData(null)
    }
  }

  // 2. DETECT LOCATION & CALL BACKEND
  const detectLocation = () => {
    setLoading(true)
    setZoom(4)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // A. Get Country Name from GPS
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          const data = await res.json()

          let rawCountry = data.countryName || 'India';

          // 🧹 CLEANER: Fix weird API names to match our Database
          if (rawCountry.includes("United States")) {
            rawCountry = "United States";
          } else if (rawCountry.includes("United Kingdom")) {
            rawCountry = "United Kingdom";
          } else if (rawCountry.includes("United Arab Emirates")) {
            rawCountry = "United Arab Emirates";
          } else if (rawCountry.includes("Niger")) {
            rawCountry = "Niger";
          } else if (rawCountry.includes("Central African Republic")) {
            rawCountry = "Central African Republic";
          } else if (rawCountry.includes("Iran")) {
            rawCountry = "Iran";
          }

          const detectedCountry = rawCountry;
          const detectedCity = data.city || data.locality || '';

          setLocation({ country: detectedCountry, city: detectedCity, lat: latitude, lng: longitude })

          // B. Get Rules/Numbers from YOUR Database
          await fetchGuideData(detectedCountry)

          // C. Zoom in
          setTimeout(() => {
            setZoom(15)
          }, 500)

        } catch (err) {
          console.error(err)
          setLocation(prev => ({ ...prev, country: 'India', city: 'Default' }))
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        setError("Location access denied")
        // Default to India if permission denied
        fetchGuideData('India')
        setLoading(false)
      }
    )
  }

  useEffect(() => { detectLocation() }, [])

  // ... (inside component)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-slate-800/50 shadow-sm animate-fade-in">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-800 dark:text-slate-100 mb-1">
              Travel Guide
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Local customs and emergency information for your destination
            </p>
          </div>
          <button
            onClick={detectLocation}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-sky-600/90 hover:bg-sky-700 text-white rounded-xl shadow-lg shadow-sky-600/20 backdrop-blur-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Locating...' : 'Refresh Location'}
          </button>
        </div>

        {/* Map Section */}
        {loading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : (
          <div className="animate-fade-in">
            <InteractiveMap lat={location.lat} lng={location.lng} />
          </div>
        )}

        {/* Location Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/50 dark:border-slate-800/50 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                Current Location
              </p>
              {loading ? (
                <Skeleton className="h-6 w-32 mt-1" />
              ) : (
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {`${location.city || 'Unknown'}, ${location.country}`}
                </p>
              )}
            </div>
          </div>
          {error && (
            <div className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium border border-red-100">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Emergency Contacts Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-white/50 dark:border-slate-800/50 rounded-xl hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Police</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {countryData?.emergency.police || '--'}
                  </span>
                </div>
              </div>
              <div className="p-4 border border-white/50 dark:border-slate-800/50 rounded-xl hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ambulance</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {countryData?.emergency.ambulance || '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Local Customs Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Local Customs</h2>
            </div>
            <div className="space-y-2">
              {countryData?.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30"
                >
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{rule}</p>
                </div>
              ))}
              {!countryData && (
                <div className="flex items-center justify-center gap-2 p-8 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Loading information...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}