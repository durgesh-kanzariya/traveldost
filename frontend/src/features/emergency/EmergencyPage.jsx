import { useState, useRef, useEffect } from 'react'
import {
  Shield,
  Ambulance,
  Flame,
  RefreshCw,
  Search,
  ChevronDown,
  MapPin,
  Phone,
  Landmark,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { useEmergency } from './useEmergency'
import { DashboardLayout } from '../../components/layout/DashboardLayout'

export function EmergencyPage() {
  const {
    selectedCountry,
    activeData,
    allCountries,
    loading,
    locationError,
    detectLocation,
    fetchEmergencyData,
  } = useEmergency()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = allCountries.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCountrySelect = (country) => {
    setSearchQuery(country)
    setIsDropdownOpen(false)
    fetchEmergencyData(country)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════
            HEADER & COUNTRY SEARCH
        ═════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Emergency Dispatch & Consular Hub
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Immediate telephony dispatches, crisis lines, and embassy assistance for{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                {selectedCountry}
              </span>
              .
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => detectLocation(true)}
              disabled={loading}
              title="Sync GPS coordinates"
              className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative flex-1 lg:w-64" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Switch destination country..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full pl-8 pr-8 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                />
                <ChevronDown
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 transition-transform pointer-events-none ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full mt-1 w-full max-h-56 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-xl z-30 text-xs font-mono">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 transition-colors cursor-pointer"
                      >
                        {country}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-zinc-400">No destination found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            LOCATION & VERIFICATION STATUS BARS
        ═════════════════════════════════════════ */}
        {locationError && (
          <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-xs font-mono text-rose-700 dark:text-rose-400">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {activeData && !activeData.isDatabase && (
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                112 Universal Emergency Protocol (EU & Global Carrier Standard)
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Regional dispatch numbers for <strong>{selectedCountry}</strong> are currently routed to the universal 112 international emergency network. Verify local carrier protocols with your accommodation or authorities upon landing.
              </p>
            </div>
          </div>
        )}

        {activeData && activeData.isDatabase && (
          <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Verified regional telephony lines active for <strong>{selectedCountry}</strong>.
            </span>
          </div>
        )}

        {/* ════════════════════════════════════════
            PRIMARY TELEPHONY HOT-DIAL TILES (3 COLS)
        ═════════════════════════════════════════ */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Police Department',
              type: 'Law Enforcement & Security',
              icon: Shield,
              value: activeData?.police,
            },
            {
              title: 'Emergency Medical',
              type: 'Paramedic & Ambulance Corps',
              icon: Ambulance,
              value: activeData?.ambulance,
            },
            {
              title: 'Fire & Rescue',
              type: 'Hazmat & Extrication Response',
              icon: Flame,
              value: activeData?.fire,
            },
          ].map((card) => {
            const hasValue = Boolean(
              card.value && typeof card.value === 'string' && card.value.trim() && card.value !== '--'
            )
            const Icon = card.icon

            return (
              <div
                key={card.title}
                className="p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                      {hasValue ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {card.title}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-3">
                    {card.type}
                  </p>

                  <div className="font-mono text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 my-2">
                    {hasValue ? card.value : '—'}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  {hasValue ? (
                    <a
                      href={`tel:${card.value}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Instant Call ({card.value})</span>
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 cursor-not-allowed select-none">
                      <span>Line Unavailable</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ════════════════════════════════════════
            CONSULAR & EMBASSY HELPLINE (Full Width Card)
        ═════════════════════════════════════════ */}
        <div className="p-4 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">
                Diplomatic & Consular Support Hotline
              </h3>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Immediate consular assistance for lost travel passports, civil unrest, or legal emergencies.
              </p>
            </div>
          </div>

          {activeData?.embassy ? (
            <a
              href={`tel:${activeData.embassy}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 shrink-0 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Dial {activeData.embassy}</span>
            </a>
          ) : (
            <span className="px-3 py-1 rounded text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 shrink-0">
              Direct In-Country Line Not Cataloged
            </span>
          )}
        </div>

        {/* ════════════════════════════════════════
            REGIONAL PROTOCOLS & CUSTOMS
        ═════════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Destination Advisory & Protocols
              </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {selectedCountry} Registry
            </span>
          </div>

          {activeData?.rules && activeData.rules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(() => {
                const parsed = activeData.rules.map((rule) => {
                  const match = rule.match(/^\[([^\]]+)\]\s*(.+)$/)
                  if (match) {
                    return { category: match[1], text: match[2] }
                  }
                  return { category: 'General', text: rule }
                })
                const grouped = {}
                parsed.forEach((r) => {
                  if (!grouped[r.category]) grouped[r.category] = []
                  grouped[r.category].push(r)
                })

                return Object.entries(grouped).map(([category, rules]) => (
                  <div
                    key={category}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {category}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                        {rules.length}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2">
                      {rules.map((r, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded bg-zinc-50/60 dark:bg-zinc-950/40 border border-zinc-200/70 dark:border-zinc-800/80"
                        >
                          <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {r.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 p-8 text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>No specific protocols cataloged for this destination</span>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}