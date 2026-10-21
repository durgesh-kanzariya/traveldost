import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  MapPin,
  AlertTriangle,
  Phone,
  RefreshCw,
  Info,
  Plane,
  Calendar,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Globe,
  Banknote,
  DollarSign,
  Compass,
  Radio,
  ExternalLink,
} from 'lucide-react'
import { DashboardLayout } from '../../components/layout'
import { InteractiveMap, Skeleton } from '../../components/ui'
import { useDashboard } from '../../shared/hooks'

export function Dashboard() {
  const {
    location,
    zoom,
    loading,
    countryData,
    error,
    upcomingTrip,
    tripEmergencyData,
    detectLocation,
  } = useDashboard()

  const [activeRuleCategory, setActiveRuleCategory] = useState('all')

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

  // Parse and categorize local rules
  const { categories, parsedRules } = useMemo(() => {
    if (!countryData?.rules || !Array.isArray(countryData.rules)) {
      return { categories: ['all'], parsedRules: [] }
    }

    const rules = countryData.rules.map((rule, idx) => {
      const match = rule.match(/^\[([^\]]+)\]\s*(.+)$/)
      if (match) {
        return { id: idx, category: match[1].trim(), text: match[2].trim(), raw: rule }
      }
      return { id: idx, category: 'General', text: rule.trim(), raw: rule }
    })

    const uniqueCats = ['all', ...Array.from(new Set(rules.map((r) => r.category)))]
    return { categories: uniqueCats, parsedRules: rules }
  }, [countryData])

  const filteredRules = useMemo(() => {
    if (activeRuleCategory === 'all') return parsedRules
    return parsedRules.filter((r) => r.category.toLowerCase() === activeRuleCategory.toLowerCase())
  }, [parsedRules, activeRuleCategory])

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ════════════════════════════════════════
            1. TOP HUD / TELEMETRY TICKER BAR
        ═════════════════════════════════════════ */}
        <header
          aria-label="System Status & Telemetry"
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800"
        >
          {/* Left: GPS telemetry readout */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                GPS LOCK
              </span>
            </div>

            <span className="text-zinc-300 dark:text-zinc-700">|</span>

            <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-medium">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              {loading ? (
                <Skeleton className="h-3.5 w-28" />
              ) : (
                <span>{location.city ? `${location.city}, ${location.country}` : location.country}</span>
              )}
            </div>

            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>{location.lat?.toFixed(4)}°N</span>
              <span>{location.lng?.toFixed(4)}°E</span>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            {error && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 text-[10px] font-mono text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => detectLocation(true)}
              disabled={loading}
              title="Recalibrate GPS coordinates"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'SYNCING' : 'RE-SYNC'}</span>
            </button>
          </div>
        </header>

        {/* ════════════════════════════════════════
            2. ASYMMETRIC COMMAND HERO (7 cols / 5 cols)
        ═════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (7 cols): Active Trip Dossier / Departure Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 relative overflow-hidden">
            {upcomingTrip ? (
              <div className="space-y-4">
                {/* Dossier Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      Active Flight Dossier
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>{getDaysUntilTrip(upcomingTrip.start_date)}d to departure</span>
                  </div>
                </div>

                {/* Main Trip Path Visualizer */}
                <div className="py-2">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Target Destination
                  </div>
                  <div className="flex flex-wrap items-baseline gap-3 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                      {upcomingTrip.destination}
                    </h2>
                  </div>

                  {/* Route & Dates bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>
                        {formatDate(upcomingTrip.start_date)} → {formatDate(upcomingTrip.end_date)}
                      </span>
                    </div>

                    {tripEmergencyData && (
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-400">
                          SOS:{' '}
                          <span className="text-zinc-200 font-semibold">
                            {tripEmergencyData.police || '112'}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Quick Action */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 hidden sm:inline">
                    Itinerary synced with destination emergency registry
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link
                      to="/checklist"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Packing Checklist</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to="/trips"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                    >
                      <span>Manage Trip</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between py-2 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      Flight Departure Desk
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">
                    Standby Mode
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    No active itinerary on file
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400 max-w-md leading-relaxed">
                    Create a new travel itinerary to activate intelligent destination advisory,
                    offline maps, and emergency consular dispatches.
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">
                    System ready for route configuration
                  </span>
                  <Link
                    to="/trips"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>Create Itinerary</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Regional Emergency & Telephony Hub */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-lg bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Emergency Dispatch Hotline
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
                  {location.country || 'Global'}
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Direct cellular gateway to primary regional emergency services. Tap to dial.
              </p>

              {/* 2-Cell Hot-Dial Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* Police */}
                <a
                  href={`tel:${countryData?.emergency?.police || '112'}`}
                  className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
                      Police
                    </span>
                    <Phone className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                  </div>
                  <div className="mt-2 font-mono text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {countryData?.emergency?.police || '112'}
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    Instant Connect
                  </div>
                </a>

                {/* Ambulance */}
                <a
                  href={`tel:${countryData?.emergency?.ambulance || '112'}`}
                  className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
                      Medical
                    </span>
                    <Phone className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                  </div>
                  <div className="mt-2 font-mono text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {countryData?.emergency?.ambulance || '112'}
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    Ambulance SOS
                  </div>
                </a>
              </div>
            </div>

            {/* Hub Link */}
            <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                Consular & Embassy Support
              </span>
              <Link
                to="/emergency"
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                <span>Full Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            3. CORE BENTO MODULES (Map + Cultural Dossier)
        ═════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Geospatial Map Canvas (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex flex-col">
            {/* Map Toolbar HUD */}
            <div className="px-3.5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Geospatial Viewport
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900">
                  {location.city || 'Regional Radar'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                <span>ZOOM: {zoom}x</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">
                  ONLINE
                </span>
              </div>
            </div>

            {/* Map Frame */}
            <div className="relative h-72 sm:h-96 w-full bg-zinc-100 dark:bg-zinc-900">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <InteractiveMap lat={location.lat} lng={location.lng} zoom={zoom} />
              )}
            </div>

            {/* Map Bottom Metadata Strip */}
            <div className="px-3.5 py-2 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">
                  {location.city ? `${location.city}, ${location.country}` : location.country}
                </span>
              </div>
              <span className="shrink-0 text-zinc-400 dark:text-zinc-500">
                WGS-84 Projection
              </span>
            </div>
          </div>

          {/* Regional Protocols & Cultural Intel Dossier (5 cols) */}
          <div className="lg:col-span-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div>
              <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Cultural & Local Protocols
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                  {filteredRules.length} Entries
                </span>
              </div>

              {/* Category Filter Chips */}
              {categories.length > 1 && (
                <div className="px-3.5 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar bg-white dark:bg-zinc-950/50">
                  {categories.map((cat) => {
                    const isSelected = activeRuleCategory.toLowerCase() === cat.toLowerCase()
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveRuleCategory(cat)}
                        className={`
                          px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider transition-colors shrink-0
                          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400
                          ${
                            isSelected
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-medium'
                              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                          }
                        `}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Protocol Rules Feed */}
              <div className="p-3.5 space-y-2.5 max-h-[300px] sm:max-h-[340px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded" />
                    ))}
                  </div>
                ) : filteredRules.length > 0 ? (
                  filteredRules.slice(0, 4).map((rule, idx) => (
                    <div
                      key={rule.id || idx}
                      className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400 font-semibold">
                          {rule.category}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {rule.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
                    <Info className="w-4 h-4 mx-auto mb-1.5 text-zinc-400" />
                    <p className="text-xs">No specific advisory entries for this filter</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dossier Footer Action */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                Regional compliance verified
              </span>
              <Link
                to="/emergency"
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                <span>Read Full Advisory</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            4. MODULAR UTILITY LAUNCHPAD (4 Rapid Tool Cards)
        ═════════════════════════════════════════ */}
        <section aria-label="Utility Tool Launchpad" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Rapid Tool Launchpad
            </span>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
              Core Modules
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Currency Converter',
                desc: 'Live foreign exchange rates & calculator',
                icon: Banknote,
                path: '/currency-converter',
                tag: 'FX RATES',
              },
              {
                title: 'Language Translator',
                desc: 'Phrase translation & offline guide',
                icon: Globe,
                path: '/translator',
                tag: 'SPEECH & TEXT',
              },
              {
                title: 'Packing Checklist',
                desc: 'Custom luggage & trip preparation lists',
                icon: Briefcase,
                path: '/checklist',
                tag: 'PRE-FLIGHT',
              },
              {
                title: 'Expense Ledger',
                desc: 'Multi-currency budget & spend logging',
                icon: DollarSign,
                path: '/expenses',
                tag: 'ACCOUNTING',
              },
            ].map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.title}
                  to={tool.path}
                  className="p-3.5 rounded-lg bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors" />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                        {tool.tag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2.5">
                      {tool.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
