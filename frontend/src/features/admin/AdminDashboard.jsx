import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSystemStats } from '../../shared/services'
import { AdminLayout } from '../../components/layout'
import { Users, Globe2, ShieldCheck, ArrowRight, RefreshCw, Activity, Server, Database } from 'lucide-react'

export function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalGuides: 0 })
    const [loading, setLoading] = useState(true)

    const loadStats = async () => {
        setLoading(true)
        try {
            const data = await getSystemStats()
            setStats(data || { totalUsers: 0, totalGuides: 0 })
        } catch (err) {
            console.error('Failed to load stats', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStats()
    }, [])

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-6xl">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
                                ROOT_SYS // OVERVIEW
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                HEALTHY
                            </span>
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            System Control & Operations
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Global metrics, account distribution, and emergency intelligence infrastructure.
                        </p>
                    </div>

                    <button
                        onClick={loadStats}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Metrics</span>
                    </button>
                </div>

                {/* Primary Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
                        <div className="flex items-center justify-between text-zinc-500 mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider">Registered Accounts</span>
                            <Users className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {loading ? '—' : stats.totalUsers ?? 0}
                            </span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                Active State
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-2">
                            Total authenticated users in database
                        </p>
                    </div>

                    <div className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
                        <div className="flex items-center justify-between text-zinc-500 mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider">Country Intelligence</span>
                            <Globe2 className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {loading ? '—' : stats.totalGuides ?? 0}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-400">
                                Nations
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-2">
                            Hotline and advisory dossiers registered
                        </p>
                    </div>

                    <div className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
                        <div className="flex items-center justify-between text-zinc-500 mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider">API Cluster</span>
                            <Server className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                99.98%
                            </span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                Node 20 LTS
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-2">
                            Express & PostgreSQL service uptime
                        </p>
                    </div>

                    <div className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
                        <div className="flex items-center justify-between text-zinc-500 mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider">Data Layer</span>
                            <Database className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                PostgreSQL
                            </span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                Live
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-2">
                            Relational ledger & trip state active
                        </p>
                    </div>
                </div>

                {/* Subsystem Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* User Management Entry Card */}
                    <Link
                        to="/admin/users"
                        className="group p-5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all block"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                        User Registry & Roles
                                    </h3>
                                    <p className="font-mono text-[11px] text-zinc-500">
                                        Manage account privileges and identity records
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all" />
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
                            Inspect user credentials, elevate roles between traveler and administrator, or decommission legacy accounts.
                        </p>
                        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 font-mono text-[10px] text-zinc-400">
                            <span>ROUTE: /admin/users</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400">READ / WRITE ACCESS</span>
                        </div>
                    </Link>

                    {/* Country Guides Entry Card */}
                    <Link
                        to="/admin/guides"
                        className="group p-5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all block"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center">
                                    <Globe2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                        Country Intelligence Guides
                                    </h3>
                                    <p className="font-mono text-[11px] text-zinc-500">
                                        Emergency hotlines, regional tips, and embassy records
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all" />
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
                            Publish verified police, fire, ambulance numbers and cultural dos & don'ts synced to traveler emergency dashboards.
                        </p>
                        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 font-mono text-[10px] text-zinc-400">
                            <span>ROUTE: /admin/guides</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400">SYNCHRONIZED GLOBAL</span>
                        </div>
                    </Link>
                </div>

                {/* System Diagnostics Box */}
                <div className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                System Security & Guardrails
                            </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400">
                            TOKEN: JWT (HS256)
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs text-zinc-600 dark:text-zinc-400">
                        <div>
                            <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">Session Isolation</span>
                            <span className="text-zinc-800 dark:text-zinc-200">Strict Bearer Authorization Header</span>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">Role Enforcement</span>
                            <span className="text-zinc-800 dark:text-zinc-200">Middleware RBAC [AdminOnly]</span>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">Currency Sync</span>
                            <span className="text-zinc-800 dark:text-zinc-200">Open Exchange Fallback Matrix Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
