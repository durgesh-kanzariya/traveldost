import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, LayoutDashboard, ShieldAlert, Languages, ClipboardList, Settings, MapPin, Phone, Ambulance, ArrowRightLeft, Menu, X, LogOut } from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Emergency', icon: ShieldAlert, href: '/emergency', active: true },
  { name: 'Translator', icon: Languages, href: '/translator' },
  { name: 'Checklist', icon: ClipboardList, href: '/checklist' },
  { name: 'Currency Converter', icon: ArrowRightLeft, href: '/currency-converter' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

const emergencyServices = [
  { id: 1, name: 'Police', number: '100', icon: ShieldAlert, color: 'bg-red-100 text-red-600' },
  { id: 2, name: 'Ambulance', number: '108', icon: Ambulance, color: 'bg-orange-100 text-orange-600' },
  { id: 3, name: 'Fire Brigade', number: '101', icon: ShieldAlert, color: 'bg-red-100 text-red-600' },
  { id: 4, name: 'Women Helpline', number: '1091', icon: Phone, color: 'bg-pink-100 text-pink-600' },
]

export function EmergencyPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-sky-600" />
            <span className="text-xl font-bold text-slate-900">TravelDost</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
              JD
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">john@example.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-sky-600" />
            <span className="font-bold text-slate-900">TravelDost</span>
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Emergency Services
            </h1>
            <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Rajkot, Gujarat
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {emergencyServices.map((service) => (
              <div key={service.id} className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`rounded-lg p-3 ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {service.name}
                  </h2>
                </div>
                <button className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700">
                  <span className="text-2xl">{service.number}</span>
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Tap to call
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Important Tips
            </h2>
            <ul className="space-y-2 text-slate-700">
              <li>• Always dial the correct emergency number for your location</li>
              <li>• Provide accurate location details when calling</li>
              <li>• Stay calm and follow the operator's instructions</li>
              <li>• Keep emergency numbers saved in your phone</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}
