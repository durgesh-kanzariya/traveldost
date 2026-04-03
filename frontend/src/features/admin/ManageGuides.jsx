import { useState, useEffect } from 'react'
import { getAllGuidesAdmin, createGuide, updateGuide, deleteGuide } from '../../shared/services';
import { AdminLayout } from '../../components/layout';
import { GuideFormModal } from '../guides';
import { Plus, Search, MapPin, Pencil, Trash2 } from 'lucide-react';

export function ManageGuides() {
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingGuide, setEditingGuide] = useState(null)
    const [error, setError] = useState('')

    // Fetch Guides
    useEffect(() => {
        fetchGuides()
    }, [])

    const fetchGuides = async () => {
        try {
            setLoading(true)
            const data = await getAllGuidesAdmin()
            setGuides(data)
        } catch (err) {
            setError('Failed to load guides.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handlers
    const handleAddClick = () => {
        setEditingGuide(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (guide) => {
        setEditingGuide(guide)
        setIsModalOpen(true)
    }

    const handleDeleteClick = async (guideId) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            try {
                await deleteGuide(guideId)
                setGuides(guides.filter(g => g.id !== guideId))
            } catch (err) {
                alert('Failed to delete guide')
            }
        }
    }

    const handleFormSubmit = async (formData) => {
        try {
            if (editingGuide) {
                await updateGuide(editingGuide.id, formData)
            } else {
                await createGuide(formData)
            }
            setIsModalOpen(false)
            fetchGuides() // Refresh list
        } catch (err) {
            alert('Failed to save guide')
        }
    }

    // Filter
    const filteredGuides = guides.filter(guide =>
        guide.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                        Manage Country Guides
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Create and update travel guides for different countries.
                    </p>
                </div>

                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Guide
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
            </div>

            {/* Guides Grid/List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-slate-500 dark:text-slate-400">Loading guides...</p>
                ) : filteredGuides.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400">No guides found.</p>
                ) : (
                    filteredGuides.map((guide) => (
                        <div key={guide.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                        {guide.country_name}
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(guide)}
                                        className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(guide.id)}
                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                <p><span className="font-medium">Police:</span> {guide.police_number}</p>
                                <p><span className="font-medium">Ambulance:</span> {guide.ambulance_number}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <GuideFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingGuide}
            />
        </AdminLayout>
    )
}
