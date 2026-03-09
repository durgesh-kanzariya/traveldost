import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    User,
    ShieldAlert,
    Sun,
    Moon,
    ArrowLeftRight
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [userData] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user')
            return storedUser ? JSON.parse(storedUser) : { firstName: 'Admin', lastName: '', email: 'admin@example.com' }
        } catch (e) {
            console.error("Failed to parse user data", e);
            return { firstName: 'Admin', lastName: '', email: 'admin@example.com' };
        }
    })

    // LOGOUT FUNCTION
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Manage Users', path: '/admin/users' },
        { icon: ShieldAlert, label: 'Manage Guides', path: '/admin/guides' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-sm">
                <span className="text-xl font-bold text-red-600">TravelDost Admin</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-[9999] w-64 transform bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/50 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="flex h-full flex-col">
                        <div className="flex h-16 items-center px-4 border-b border-slate-100 dark:border-slate-800">
                            <Link to="/admin/dashboard" className="flex items-center gap-2">
                                <img src="/logo.jpeg" alt="TravelDost Logo" className="w-8 h-8 object-cover rounded-md shrink-0" />
                                <span className="text-lg font-bold text-sky-600 dark:text-sky-400 truncate">TravelDost</span>
                                <span className="shrink-0 text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">ADMIN</span>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* User Profile Section */}
                        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                    <User className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {userData.firstName} {userData.lastName}
                                    </p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        {userData.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-2"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors mb-2"
                            >
                                <ArrowLeftRight className="h-5 w-5" />
                                Switch to User View
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 w-full min-w-0 overflow-x-hidden p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
