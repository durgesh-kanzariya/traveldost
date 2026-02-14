import { AdminLayout } from '../../components/AdminLayout'

export function UserManagement() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    Manage Users
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    View and manage registered users.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400">User table will go here.</p>
            </div>
        </AdminLayout>
    )
}
