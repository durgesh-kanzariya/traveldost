import { useState } from 'react' // Removed useEffect
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Globe, 
  Phone, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Banknote
} from 'lucide-react'

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // 1. FIXED: Lazy Initialization (Reads storage once on load)
  const [userData] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : { name: 'Traveler', email: 'user@example.com' }
  })

  // 2. LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckSquare, label: 'Trip Checklist', path: '/checklist' },
    { icon: Globe, label: 'Translator', path: '/translator' },
    { icon: Banknote, label: 'Currency', path: '/currency-converter' }, // <--- NEW LINK
    { icon: Phone, label: 'Emergency', path: '/emergency' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-sm">
        <span className="text-xl font-bold text-sky-600">TravelDost</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center px-6">
              <span className="text-2xl font-bold text-sky-600">TravelDost</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                  <User className="h-6 w-6 text-sky-600" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {userData.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {userData.email}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}