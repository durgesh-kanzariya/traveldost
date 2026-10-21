import { useState, useEffect } from 'react'
import { getAllGuidesAdmin, createGuide, updateGuide, deleteGuide } from '../../shared/services'
import { AdminLayout } from '../../components/layout'
import { GuideFormModal } from '../guides'
import { Plus, Search, MapPin, Pencil, Trash2, Phone, AlertTriangle, X, RefreshCw, BookOpen } from 'lucide-react'

export function ManageGuides() {
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingGuide, setEditingGuide] = useState(null)
    const [guideToDelete, setGuideToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')
    const [actionNotice, setActionNotice] = useState(null)

    const fetchGuides = async () => {
        try {
            setLoading(true)
            const data = await getAllGuidesAdmin()
            setGuides(Array.isArray(data) ? data : [])
        } catch (err) {
            setError('Failed to load country intelligence dossiers.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGuides()
    }, [])

    const handleAddClick = () => {
        setEditingGuide(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (guide) => {
        setEditingGuide(guide)
        setIsModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!guideToDelete) return
        setDeleting(true)
        try {
            await deleteGuide(guideToDelete.id)
            setGuides(prev => prev.filter(g => g.id !== guideToDelete.id))
            setActionNotice({ type: 'success', text: `Country dossier for ${guideToDelete.country_name} deleted.` })
            setGuideToDelete(null)
            setTimeout(() => setActionNotice(null), 4000)
        } catch {
            setActionNotice({ type: 'error', text: 'Failed to delete country guide.' })
        } finally {
            setDeleting(false)
        }
    }

    const handleFormSubmit = async (formData) => {
        try {
            if (editingGuide) {
                await updateGuide(editingGuide.id, formData)
                setActionNotice({ type: 'success', text: `Guide for ${formData.country_name} updated successfully.` })
            } else {
                await createGuide(formData)
                setActionNotice({ type: 'success', text: `New guide for ${formData.country_name} created.` })
            }
            setIsModalOpen(false)
            fetchGuides()
            setTimeout(() => setActionNotice(null), 4000)
        } catch {
            setActionNotice({ type: 'error', text: 'Failed to save country guide.' })
        }
    }

    const filteredGuides = guides.filter(guide =>
        (guide.country_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-6xl">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
                                REPOSITORY // EMERGENCY_DOSSIERS
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                                {guides.length} NATIONS REGISTERED
                            </span>
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Country Guides & Hotlines
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Curate emergency telecommunications, diplomatic contacts, and local legal frameworks for global travelers.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Filter by nation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-48 sm:w-56 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all font-mono"
                            />
                        </div>

                        <button
                            onClick={fetchGuides}
                            disabled={loading}
                            title="Refresh guides"
                            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={handleAddClick}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-2xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Guide</span>
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

                {/* Cards Grid */}
                {loading ? (
                    <div className="p-12 text-center text-zinc-500 font-mono text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
                        Retrieving country dossiers...
                    </div>
                ) : filteredGuides.length === 0 ? (
                    <div className="p-12 text-center rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
                        <BookOpen className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                        <p className="text-xs text-zinc-500 font-mono">
                            {searchTerm ? `No country guides matching "${searchTerm}"` : 'No country dossiers found. Click "Add Guide" to register one.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredGuides.map((guide) => (
                            <div
                                key={guide.id}
                                className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                                <MapPin className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                                                    {guide.country_name}
                                                </h3>
                                                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                                                    DOSSIER #{guide.id}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditClick(guide)}
                                                className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                title="Edit Guide"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setGuideToDelete(guide)}
                                                className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                title="Delete Guide"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Numbers Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                                        <div className="p-2 rounded border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/50">
                                            <span className="font-mono text-[9px] text-zinc-400 uppercase block">Police</span>
                                            <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                                                {guide.police_number || '—'}
                                            </span>
                                        </div>
                                        <div className="p-2 rounded border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/50">
                                            <span className="font-mono text-[9px] text-zinc-400 uppercase block">Ambulance</span>
                                            <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                                                {guide.ambulance_number || '—'}
                                            </span>
                                        </div>
                                        <div className="p-2 rounded border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/50">
                                            <span className="font-mono text-[9px] text-zinc-400 uppercase block">Fire Dispatch</span>
                                            <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                                                {guide.fire_number || '—'}
                                            </span>
                                        </div>
                                        <div className="p-2 rounded border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/50">
                                            <span className="font-mono text-[9px] text-zinc-400 uppercase block">Embassy</span>
                                            <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                                                {guide.embassy_number || '—'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Local Rules Preview */}
                                    {guide.local_rules && (
                                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 italic bg-zinc-50/50 dark:bg-zinc-950/40 p-2 rounded border border-zinc-100 dark:border-zinc-800/60">
                                            "{guide.local_rules}"
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-2.5 h-2.5" />
                                        EMERGENCY SYNCED
                                    </span>
                                    <span>UPDATED</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Modal for Delete Guide */}
                {guideToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                        <div className="w-full max-w-sm rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xl space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                        Delete Country Dossier
                                    </h3>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                                        Are you sure you want to delete the guide for <strong className="text-zinc-900 dark:text-zinc-200">{guideToDelete.country_name}</strong>? Travelers in this country will lose quick emergency dial numbers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setGuideToDelete(null)}
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

                {/* Guide Form Modal */}
                <GuideFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingGuide}
                />
            </div>
        </AdminLayout>
    )
}
