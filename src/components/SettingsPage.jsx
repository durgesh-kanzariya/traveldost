import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, LayoutDashboard, ShieldAlert, Languages, ClipboardList, Settings, ArrowRightLeft, Bell, Lock, User, Menu, X, LogOut } from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Emergency', icon: ShieldAlert, href: '/emergency' },
  { name: 'Translator', icon: Languages, href: '/translator' },
  { name: 'Checklist', icon: ClipboardList, href: '/checklist' },
  { name: 'Currency Converter', icon: ArrowRightLeft, href: '/currency-converter' },
  { name: 'Settings', icon: Settings, href: '/settings', active: true },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: false,
  })

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    navigate('/')
  }

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Settings
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your account and preferences
            </p>
          </div>

          {/* Account Settings */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <User className="h-5 w-5" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
                />
              </div>
              <button className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700">
                Save Changes
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Lock className="h-5 w-5" />
              Security
            </h2>
            <button className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50">
              Change Password
            </button>
          </div>

          {/* Preferences */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Bell className="h-5 w-5" />
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Notifications</p>
                  <p className="text-sm text-slate-500">Receive alerts for emergency updates</p>
                </div>
                <button
                  onClick={() => toggleSetting('notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <div>
                  <p className="font-medium text-slate-900">Location Tracking</p>
                  <p className="text-sm text-slate-500">Auto-detect your location</p>
                </div>
                <button
                  onClick={() => toggleSetting('locationTracking')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.locationTracking ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.locationTracking ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
