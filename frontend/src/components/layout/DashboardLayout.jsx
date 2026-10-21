import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getStoredUser, clearAuth } from '../../shared/utils/authStorage'
import { useTheme } from '../../shared/context/ThemeContext'
import {
  LayoutDashboard,
  Plane,
  DollarSign,
  CheckSquare,
  Globe,
  Banknote,
  Phone,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ArrowLeftRight,
} from 'lucide-react'

/* ──────────────────────────────────────────────
   Navigation Configuration — High Density & Restrained
   ────────────────────────────────────────────── */
const NAV_ITEMS_MAIN = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Plane, label: 'My Trips', path: '/trips' },
  { icon: DollarSign, label: 'Expenses', path: '/expenses' },
  { icon: CheckSquare, label: 'Checklist', path: '/checklist' },
]

const NAV_ITEMS_TOOLS = [
  { icon: Globe, label: 'Translator', path: '/translator' },
  { icon: Banknote, label: 'Currency', path: '/currency-converter' },
  { icon: Phone, label: 'Emergency', path: '/emergency' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

const ROUTE_TITLES = {
  '/dashboard': 'Dashboard',
  '/trips': 'My Trips',
  '/expenses': 'Expense Tracker',
  '/checklist': 'Packing Checklist',
  '/translator': 'Language Translator',
  '/currency-converter': 'Currency Converter',
  '/emergency': 'Emergency Assistance',
  '/settings': 'Account Settings',
}

export function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [userData] = useState(() => {
    const stored = getStoredUser()
    return stored || { firstName: 'Traveler', lastName: '', email: 'traveler@traveldost.app' }
  })

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const initials =
    `${userData.firstName?.[0] ?? ''}${userData.lastName?.[0] ?? ''}`.toUpperCase() || 'TD'

  const currentTitle = ROUTE_TITLES[location.pathname] || 'Overview'

  const renderNavLinks = (onItemClick) => (
    <div className="flex flex-col gap-6">
      {/* Primary Section */}
      <div>
        <div className="px-2.5 mb-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none">
          Workspace
        </div>
        <div className="space-y-0.5">
          {NAV_ITEMS_MAIN.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onItemClick}
                aria-current={active ? 'page' : undefined}
                className={`
                  group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium
                  transition-colors duration-150 border
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500
                  ${
                    active
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800'
                      : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60'
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active
                      ? 'text-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300'
                  }`}
                  strokeWidth={active ? 2 : 1.75}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Utilities Section */}
      <div>
        <div className="px-2.5 mb-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none">
          Utilities
        </div>
        <div className="space-y-0.5">
          {NAV_ITEMS_TOOLS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onItemClick}
                aria-current={active ? 'page' : undefined}
                className={`
                  group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium
                  transition-colors duration-150 border
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500
                  ${
                    active
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800'
                      : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60'
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active
                      ? 'text-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300'
                  }`}
                  strokeWidth={active ? 2 : 1.75}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderSidebarFooter = () => (
    <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
      {/* Admin Panel Toggle */}
      {userData.role === 'admin' && (
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium
            text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100
            hover:bg-zinc-100 dark:hover:bg-zinc-900
            border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800
            transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        >
          <span className="flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-500" />
            <span>Admin Console</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
            Switch
          </span>
        </button>
      )}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle visual theme"
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium
          text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100
          hover:bg-zinc-100 dark:hover:bg-zinc-900
          border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800
          transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
      >
        <span className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-zinc-500" />
          )}
          <span>Theme</span>
        </span>
        <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </button>

      {/* User Profile Card */}
      <div className="p-2 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded shrink-0 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[11px] font-mono font-medium text-zinc-800 dark:text-zinc-200 select-none">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate leading-tight">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate leading-tight mt-0.5">
            {userData.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out of account"
          className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      <div className="flex flex-1 min-h-screen">
        {/* ════════════════════════════════════════
            DESKTOP SIDEBAR (Linear/Vercel Aesthetic)
        ═════════════════════════════════════════ */}
        <aside
          aria-label="Sidebar Navigation"
          className="hidden lg:flex flex-col sticky top-0 h-screen w-56 shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800"
        >
          {/* Brand Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded"
            >
              <div className="w-6 h-6 rounded overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white shrink-0 flex items-center justify-center">
                <img src="/logo.jpeg" alt="TravelDost Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                TravelDost
              </span>
            </Link>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
              v1.2
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
            {renderNavLinks()}
          </nav>

          {/* Footer Card */}
          <div className="p-3">
            {renderSidebarFooter()}
          </div>
        </aside>

        {/* ════════════════════════════════════════
            MAIN CONTENT AREA + TOP HEADER BAR
        ═════════════════════════════════════════ */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top Header Bar */}
          <header className="h-14 px-4 sm:px-6 sticky top-0 z-20 flex items-center justify-between bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
            {/* Left: Mobile Trigger & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                <Menu className="w-4 h-4" />
              </button>

              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono hidden sm:inline">
                  TravelDost
                </span>
                <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">/</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {currentTitle}
                </span>
              </nav>
            </div>

            {/* Right: Sharp Utility Status Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="hidden sm:inline">System</span>
                <span>Online</span>
              </div>
            </div>
          </header>

          {/* Main Content Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE DRAWER / MODAL OVERLAY
      ═════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 transition-opacity"
          />

          {/* Sliding Panel */}
          <aside
            aria-label="Mobile Navigation Drawer"
            className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-xl z-50 animate-in slide-in-from-left duration-200"
          >
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white shrink-0 flex items-center justify-center">
                  <img src="/logo.jpeg" alt="TravelDost Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  TravelDost
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {renderNavLinks(() => setMobileMenuOpen(false))}
            </nav>

            {/* Footer */}
            <div className="p-3">
              {renderSidebarFooter()}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
