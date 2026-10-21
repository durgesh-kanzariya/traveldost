import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getStoredUser, clearAuth } from '../../shared/utils/authStorage'
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    Shield,
    Sun,
    Moon,
    ArrowLeftRight,
    Globe2,
    Compass
} from 'lucide-react'
import { useTheme } from '../../shared/context/ThemeContext'

export function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [userData] = useState(() => {
        const storedUser = getStoredUser()
        return storedUser || { firstName: 'Admin', lastName: '', email: 'admin@traveldost.internal' }
    })

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard Overview', path: '/admin/dashboard', code: '01' },
        { icon: Users, label: 'User Registry', path: '/admin/users', code: '02' },
        { icon: Globe2, label: 'Country Intelligence', path: '/admin/guides', code: '03' },
    ]

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-800 selection:text-zinc-100 transition-colors duration-150">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center overflow-hidden shrink-0">
                        <img src="/logo.jpeg" alt="TravelDost Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-100">
                        Admin Terminal
                    </span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    aria-label="Toggle navigation"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex min-h-screen">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-xs lg:hidden"
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-full flex-col justify-between">
                        <div>
                            {/* Brand Header */}
                            <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800/80">
                                <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
                                    <div className="w-7 h-7 rounded border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center overflow-hidden shrink-0">
                                        <img src="/logo.jpeg" alt="TravelDost Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                            TravelDost
                                        </span>
                                        <span className="font-mono text-[9px] tracking-wider uppercase text-zinc-500">
                                            Control Plane
                                        </span>
                                    </div>
                                </Link>
                                <span className="font-mono text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-medium">
                                    ROOT
                                </span>
                            </div>

                            {/* Section Label */}
                            <div className="px-4 pt-5 pb-2">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                    Console Navigation
                                </p>
                            </div>

                            {/* Nav Items */}
                            <nav className="space-y-1 px-3">
                                {menuItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.path
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center justify-between rounded px-3 py-2 text-xs font-medium transition-all ${
                                                isActive
                                                    ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs'
                                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                                                <span>{item.label}</span>
                                            </div>
                                            <span className={`font-mono text-[10px] ${isActive ? 'text-zinc-400' : 'text-zinc-400/60'}`}>
                                                {item.code}
                                            </span>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Bottom Profile & Actions */}
                        <div className="border-t border-zinc-200 dark:border-zinc-800/80 p-3 space-y-2">
                            {/* Admin Account Capsule */}
                            <div className="p-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                        {userData.firstName?.charAt(0) || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
                                            {userData.firstName} {userData.lastName}
                                        </p>
                                        <p className="truncate font-mono text-[10px] text-zinc-500 leading-tight">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                                    <span>Theme</span>
                                </span>
                                <span className="font-mono text-[10px] text-zinc-400 uppercase">
                                    {theme}
                                </span>
                            </button>

                            {/* Switch to User Space */}
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            >
                                <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Switch to User View</span>
                            </button>

                            {/* Log Out */}
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Pane */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Top Status Bar (Desktop) */}
                    <div className="hidden lg:flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md px-8 sticky top-0 z-30">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400">Environment</span>
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                                PRODUCTION_NODE_V1
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                READY
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <Compass className="w-3.5 h-3.5" />
                                <span>Back to Traveler Workspace</span>
                            </Link>
                        </div>
                    </div>

                    <main className="flex-1 p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
