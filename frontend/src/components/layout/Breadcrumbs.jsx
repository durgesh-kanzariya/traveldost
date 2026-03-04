import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-sky-600 dark:text-slate-400 dark:hover:text-white"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    // Skip "dashboard" if it's already the home icon
                    if (value === 'dashboard') return null

                    const to = `/${pathnames.slice(0, index + 1).join('/')}`
                    const isLast = index === pathnames.length - 1

                    // Format name: "currency-converter" -> "Currency Converter"
                    const name = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

                    return (
                        <li key={to}>
                            <div className="flex items-center">
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                {isLast ? (
                                    <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2 dark:text-slate-400">
                                        {name}
                                    </span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="ml-1 text-sm font-medium text-slate-700 hover:text-sky-600 md:ml-2 dark:text-slate-400 dark:hover:text-white"
                                    >
                                        {name}
                                    </Link>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
