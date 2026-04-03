import { useState, useEffect } from 'react'
import { getSystemStats } from '../../shared/services';
import { AdminLayout } from '../../components/layout';
import { Users, BookOpen } from 'lucide-react';


export function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalGuides: 0 })

    useEffect(() => {
        getSystemStats().then(data => setStats(data)).catch(err => console.error("Failed to load stats", err))
    }, [])

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    System Overview
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                            <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Country Guides</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalGuides || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
