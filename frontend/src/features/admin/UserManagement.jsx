import { useState, useEffect } from 'react'
import { getAllUsers, deleteUser } from '../../shared/services'
import { AdminLayout } from '../../components/layout'
import { Search, Shield, User, Trash2, RefreshCw, AlertTriangle, X } from 'lucide-react'

export function UserManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [userToDelete, setUserToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [actionNotice, setActionNotice] = useState(null)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            setUsers(Array.isArray(data) ? data : [])
        } catch (err) {
            setError('Failed to load user directory.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const confirmDelete = async () => {
        if (!userToDelete) return
        setDeleting(true)
        try {
            await deleteUser(userToDelete.id)
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
            setActionNotice({ type: 'success', text: `User ${userToDelete.email} removed from registry.` })
            setUserToDelete(null)
            setTimeout(() => setActionNotice(null), 4000)
        } catch (err) {
            setActionNotice({ type: 'error', text: err.message || 'Failed to delete user.' })
        } finally {
            setDeleting(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const full = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase()
        const query = searchTerm.toLowerCase()
        return full.includes(query) || (user.email || '').toLowerCase().includes(query)
    })

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-6xl">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
                                DIRECTORY // IAM_USERS
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                                {users.length} RECORDS
                            </span>
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            User Access & Directory
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Inspect traveler identities, monitor registration timestamps, and manage administrative privileges.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-56 sm:w-64 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all font-mono"
                            />
                        </div>

                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            title="Refresh Directory"
                            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Status Notice */}
                {actionNotice && (
                    <div
                        role="alert"
                        className={`p-3 rounded border text-xs flex items-center justify-between transition-all ${
                            actionNotice.type === 'error'
                                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                    >
                        <span className="font-mono">{actionNotice.text}</span>
                        <button onClick={() => setActionNotice(null)} className="opacity-60 hover:opacity-100">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {error && (
                    <div role="alert" className="p-3 rounded border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Table Container */}
                <div className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-900/80 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                                    <th className="px-4 py-2.5">User Identity</th>
                                    <th className="px-4 py-2.5">Role</th>
                                    <th className="px-4 py-2.5">UID / ID</th>
                                    <th className="px-4 py-2.5">Created Date</th>
                                    <th className="px-4 py-2.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-zinc-500 font-mono text-xs">
                                            Scanning identity directory...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-zinc-500 font-mono text-xs">
                                            {searchTerm ? `No users matching "${searchTerm}"` : 'No registered users found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isAdmin = user.role === 'admin'
                                        return (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                                            >
                                                {/* Identity */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 shrink-0">
                                                            {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                                {user.first_name || ''} {user.last_name || ''}
                                                            </div>
                                                            <div className="font-mono text-[11px] text-zinc-500 truncate">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border ${
                                                            isAdmin
                                                                ? 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium'
                                                                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                        }`}
                                                    >
                                                        {isAdmin ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                                                        {isAdmin ? 'ADMINISTRATOR' : 'TRAVELER'}
                                                    </span>
                                                </td>

                                                {/* UID */}
                                                <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                                                    #{String(user.id).padStart(4, '0')}
                                                </td>

                                                {/* Joined Date */}
                                                <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                                                    {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    {!isAdmin ? (
                                                        <button
                                                            onClick={() => setUserToDelete(user)}
                                                            className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                            title="Delete User Record"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    ) : (
                                                        <span className="font-mono text-[10px] text-zinc-400 italic">
                                                            PROTECTED
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Custom Modal Confirmation (Replacing native window.confirm) */}
                {userToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                        <div className="w-full max-w-sm rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xl space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                        Delete User Account
                                    </h3>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                                        Permanently delete <strong className="text-zinc-900 dark:text-zinc-200">{userToDelete.email}</strong>? Associated trips and expense ledgers will be permanently deleted.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setUserToDelete(null)}
                                    disabled={deleting}
                                    className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="px-3 py-1.5 rounded border border-red-600 bg-red-600 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting...' : 'Confirm Deletion'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
