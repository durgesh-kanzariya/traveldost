import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, Languages, ClipboardList, MapPin, Phone, Ambulance, ScrollText, ArrowRightLeft } from 'lucide-react'
import { MapWidget } from '../components/MapWidget'
import { DashboardLayout } from '../components/DashboardLayout'

export function Dashboard() {
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Passport', checked: true },
    { id: 2, label: 'Tickets', checked: false },
    { id: 3, label: 'Travel Insurance', checked: false },
    { id: 4, label: 'Hotel Booking', checked: true },
  ])

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome, Traveler!
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2">
          <MapPin className="h-4 w-4 text-teal-600" />
          <span className="text-sm font-medium text-teal-700">
            Location Detected: Rajkot, Gujarat
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Map Widget - Full Width on Top */}
        <div className="h-96 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <MapWidget />
        </div>

        {/* 2x2 Grid Below Map */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Emergency Numbers Card */}
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Emergency Numbers
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-slate-700">Police</span>
                </div>
                <span className="text-lg font-bold text-red-600">100</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Ambulance className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-slate-700">Ambulance</span>
                </div>
                <span className="text-lg font-bold text-red-600">108</span>
              </div>
            </div>
          </div>

          {/* Regional Rule Card */}
          <div className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2">
                <ScrollText className="h-6 w-6 text-sky-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Regional Rule
              </h2>
            </div>
            <div className="rounded-lg bg-sky-50 p-4">
              <p className="text-slate-700">
                Alcohol is prohibited for non-permit holders in Gujarat. Visitors
                can apply for a temporary permit if needed.
              </p>
            </div>
          </div>

          {/* Quick Tools Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <ArrowRightLeft className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Tools
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/currency-converter"
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 hover:border-purple-300"
              >
                <ArrowRightLeft className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">
                  Currency
                </span>
              </Link>
              <Link
                to="/translator"
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 hover:border-teal-300"
              >
                <Languages className="h-6 w-6 text-teal-600" />
                <span className="text-sm font-medium text-slate-700">
                  Translator
                </span>
              </Link>
            </div>
          </div>

          {/* Checklist Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2">
                <ClipboardList className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Trip Checklist
              </h2>
            </div>
            <div className="space-y-2">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span
                    className={`text-sm ${
                      item.checked
                        ? 'text-slate-400 line-through'
                        : 'text-slate-700'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
