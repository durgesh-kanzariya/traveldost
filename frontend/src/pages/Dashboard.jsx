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
          }else if (rawCountry.includes("Iran")) {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-foreground mb-1">
              Travel Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Local customs and emergency information for your destination
            </p>
          </div>
          <button
            onClick={detectLocation}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Locating...' : 'Refresh Location'}
          </button>
        </div>

        {/* Map Section */}
        <div className="rounded-2xl overflow-hidden bg-slate-100 h-96 border border-slate-200 shadow-inner relative group">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=${zoom}&output=embed`}
            title="Location Map"
            className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
          />
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 text-sky-600 animate-spin" />
                <p className="text-sm font-medium text-slate-600">Acquiring Satellite Signal...</p>
              </div>
            </div>
          )}
        </div>

        {/* Location Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Current Location
              </p>
              <p className="text-base font-bold text-slate-900">
                {loading ? 'Detecting location...' : `${location.city || 'Unknown'}, ${location.country}`}
              </p>
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
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Police</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 tabular-nums">
                    {countryData?.emergency.police || '--'}
                  </span>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Ambulance</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 tabular-nums">
                    {countryData?.emergency.ambulance || '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Local Customs Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Local Customs</h2>
            </div>
            <div className="space-y-2">
              {countryData?.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 rounded-lg bg-slate-50 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100"
                >
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{rule}</p>
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