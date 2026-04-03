import { useState, useRef, useEffect } from 'react'
import { Shield, Ambulance, Flame, RefreshCw, Search, ChevronDown, MapPin, Phone, Landmark, AlertTriangle, AlertOctagon } from 'lucide-react'
import { useEmergency } from './useEmergency'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'

export function EmergencyPage() {
  const {
    selectedCountry,
    activeData,
    allCountries,
    loading,
    locationError,
    detectLocation,
    fetchEmergencyData
  } = useEmergency()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchRef = useRef(null)

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredCountries = allCountries.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCountrySelect = (country) => {
    setSearchQuery(country)
    setIsDropdownOpen(false)
    fetchEmergencyData(country)
  }

  // Color Mapping for reliable Tailwind detection
  const colorStyles = {
    blue: {
      border: 'border-blue-600',
      bgIcon: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      hoverIcon: 'group-hover:bg-blue-600',
      btn: 'bg-blue-600 hover:bg-blue-700'
    },
    red: {
      border: 'border-red-600',
      bgIcon: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      hoverIcon: 'group-hover:bg-red-600',
      btn: 'bg-red-600 hover:bg-red-700'
    },
    orange: {
      border: 'border-orange-600',
      bgIcon: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      hoverIcon: 'group-hover:bg-orange-600',
      btn: 'bg-orange-600 hover:bg-orange-700'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Breadcrumbs />
            <h1 className="text-xl font-bold text-red-600 dark:text-red-500 sm:text-2xl flex items-center gap-2">
              <AlertOctagon className="h-6 w-6" />
              Emergency Support
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Immediate assistance for <span className="font-bold text-slate-900 dark:text-white">{selectedCountry}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => detectLocation(true)}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-200 dark:hover:border-sky-800 transition-all shadow-sm shrink-0"
              title="Use Current Location"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative flex-1 lg:w-72" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                />
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-slate-900/50 z-50">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country}
                        onClick={() => handleCountrySelect(country)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors"
                      >
                        {country}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-400">No country found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {locationError && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <MapPin className="h-4 w-4" />
            {locationError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Police', type: 'Crime & Safety', icon: Shield, color: 'blue', value: activeData?.police },
            { title: 'Ambulance', type: 'Medical Emergency', icon: Ambulance, color: 'red', value: activeData?.ambulance },
            { title: 'Fire Dept', type: 'Fire & Rescue', icon: Flame, color: 'orange', value: activeData?.fire },
          ].map((card) => {
            const style = colorStyles[card.color]
            return (
              <div key={card.title} className={`group relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-4 shadow-md dark:shadow-slate-900/20 border-t-4 ${style.border} hover:-translate-y-0.5 transition-transform duration-300`}>
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${style.bgIcon} ${style.hoverIcon} group-hover:text-white transition-colors`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{card.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">{card.type}</p>
                <a href={`tel:${card.value}`} className={`flex w-full items-center justify-center gap-2 rounded-lg ${style.btn} py-2.5 text-sm font-bold text-white transition-all active:scale-95`}>
                  <Phone className="h-4 w-4" /> Call {card.value || '...'}
                </a>
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          <div className="rounded-xl bg-slate-900 dark:bg-slate-800 p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-lg">
                <Landmark className="h-6 w-6 text-sky-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Embassy Helpline</h3>
                <p className="text-slate-400 text-sm">For lost passports & legal help</p>
              </div>
            </div>
            <a href={`tel:${activeData?.embassy}`} className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-sky-50 transition-colors shrink-0">
              Call {activeData?.embassy || '...'}
            </a>
          </div>
        </div>

        {/* Local Customs & Rules Section */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Local Customs & Rules</h2>
          </div>

          {activeData?.rules && activeData.rules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(() => {
                const parsed = activeData.rules.map(rule => {
                  const match = rule.match(/^\[([^\]]+)\]\s*(.+)$/);
                  if (match) {
                    return { category: match[1], text: match[2] };
                  }
                  return { category: 'General', text: rule };
                });
                const grouped = {};
                parsed.forEach(r => {
                  if (!grouped[r.category]) grouped[r.category] = [];
                  grouped[r.category].push(r);
                });

                return Object.entries(grouped).map(([category, rules]) => (
                  <div
                    key={category}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">{category}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto tabular-nums">{rules.length}</span>
                    </div>
                    <ul className="px-3 py-2.5 space-y-2">
                      {rules.map((r, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-snug">
                          <span className="mt-2 h-1 w-1 rounded-full bg-sky-600 dark:bg-sky-400 shrink-0" />
                          {r.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 p-8 text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">No customs available for this location</span>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}