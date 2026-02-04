import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, LayoutDashboard, ShieldAlert, Languages, ClipboardList, Settings, ArrowRightLeft, Menu, X, LogOut } from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Emergency', icon: ShieldAlert, href: '/emergency' },
  { name: 'Translator', icon: Languages, href: '/translator', active: true },
  { name: 'Checklist', icon: ClipboardList, href: '/checklist' },
  { name: 'Currency Converter', icon: ArrowRightLeft, href: '/currency-converter' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

const phrases = [
  { id: 1, english: 'Hello', local: 'Namaste', category: 'Greetings' },
  { id: 2, english: 'Thank you', local: 'Dhanyavaad', category: 'Greetings' },
  { id: 3, english: 'Sorry', local: 'Maafi kijiye', category: 'Greetings' },
  { id: 4, english: 'Water', local: 'Pani', category: 'Food & Drink' },
  { id: 5, english: 'Help', local: 'Madad karo', category: 'Emergency' },
  { id: 6, english: 'Hospital', local: 'Aspatal', category: 'Emergency' },
]

export function TranslatorPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPhrases = phrases.filter(phrase =>
    phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.local.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Language Translator
            </h1>
            <p className="mt-2 text-slate-600">
              Essential phrases in Gujarati for your travel
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search phrases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhrases.map((phrase) => (
              <div key={phrase.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                  {phrase.category}
                </span>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500">English</p>
                    <p className="text-lg font-semibold text-slate-900">{phrase.english}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Gujarati</p>
                    <p className="text-lg font-semibold text-sky-600">{phrase.local}</p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  🔊 Pronounce
                </button>
              </div>
            ))}
          </div>

          {filteredPhrases.length === 0 && (
            <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <Languages className="mb-3 h-12 w-12 text-slate-400" />
              <p className="text-slate-600">No phrases found matching your search</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
