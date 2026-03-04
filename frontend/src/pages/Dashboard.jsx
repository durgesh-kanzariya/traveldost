import { Link } from 'react-router-dom';
import {
  Shield, MapPin, AlertTriangle, Phone, CheckCircle2,
  RefreshCw, Info, Plane, Calendar, Briefcase
} from 'lucide-react'
import { DashboardLayout } from '../components/layout'
import { InteractiveMap, Skeleton } from '../components/ui'
import { useDashboard } from '../hooks'

export function Dashboard() {
  const {
    location,
    zoom,
    loading,
    countryData,
    error,
    upcomingTrip,
    tripEmergencyData,
    detectLocation
  } = useDashboard()

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getDaysUntilTrip = (startDate) => {
    if (!startDate) return 0
    const start = new Date(startDate)
    const today = new Date()
    const diffTime = start - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Upcoming Trip Banner */}
        {upcomingTrip && (
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900 rounded-2xl p-6 shadow-lg shadow-violet-600/20 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Upcoming Trip</p>
                  <h2 className="text-xl font-bold text-white">{upcomingTrip.destination}</h2>
                  <div className="flex items-center gap-3 mt-1 text-white/70 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(upcomingTrip.start_date)} - {formatDate(upcomingTrip.end_date)}
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {getDaysUntilTrip(upcomingTrip.start_date)} days away
                    </span>
                  </div>
                </div>
              </div>

              {tripEmergencyData && (
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white/60 text-xs">Police</p>
                    <p className="text-white font-bold">{tripEmergencyData.police || '--'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white/60 text-xs">Ambulance</p>
                    <p className="text-white font-bold">{tripEmergencyData.ambulance || '--'}</p>
                  </div>
                </div>
              )}

              <Link
                to="/checklist"
                className="flex items-center gap-2 bg-white text-violet-700 px-4 py-2 rounded-xl font-medium hover:bg-white/90 transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Trip Checklist
              </Link>
            </div>
          </div>
        )}

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
            <InteractiveMap lat={location.lat} lng={location.lng} zoom={zoom} />
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              {['Police', 'Ambulance'].map((type) => (
                <div key={type} className="p-4 border border-white/50 dark:border-slate-800/50 rounded-xl hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{type}</span>
                    </div>
                    <span className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                      {countryData?.emergency[type.toLowerCase()] || '--'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Local Customs</h2>
            </div>
            <div className="space-y-2">
              {Array.isArray(countryData?.rules) && countryData.rules.map((rule, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-amber-100 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{rule}</p>
                </div>
              ))}
              {!countryData && !loading && (
                <div className="flex items-center justify-center gap-2 p-8 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Information unavailable</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}