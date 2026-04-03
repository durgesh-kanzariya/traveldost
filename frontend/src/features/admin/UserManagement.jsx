import { useState, useEffect } from 'react'
import { getAllUsers, deleteUser } from '../../shared/services';
import { AdminLayout } from '../../components/layout';
import { Search, Shield, User, Trash2 } from 'lucide-react';

export function UserManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch Users on Mount
    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            setUsers(data)
        } catch (err) {
            setError('Failed to load users.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle Delete
    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(userId)
                // Remove from local state to avoid refetch
                setUsers(users.filter(user => user.id !== userId))
                alert('User deleted successfully.')
            } catch (err) {
                alert(err.message)
            }
        }
    }

    // Filter Users
    const filteredUsers = users.filter(user =>
        (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                        Manage Users
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        View and manage {users.length} registered users.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-slate-600 dark:text-slate-400">
                                                        {user.first_name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{user.first_name} {user.last_name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
