import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

export function GuideFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        country_name: '',
        police_number: '',
        ambulance_number: '',
        fire_number: '',
        embassy_number: '',
        local_rules: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            // Reset form for new entry
            setFormData({
                country_name: '',
                police_number: '',
                ambulance_number: '',
                fire_number: '',
                embassy_number: '',
                local_rules: ''
            })
        }
    }, [initialData, isOpen])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Country Guide' : 'Add New Country Guide'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Country Name *
                        </label>
                        <input
                            type="text"
                            name="country_name"
                            required
                            value={formData.country_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Police Number
                            </label>
                            <input
                                type="text"
                                name="police_number"
                                value={formData.police_number}
                                onChange={handleChange}
                                placeholder="e.g. 911"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Ambulance Number
                            </label>
                            <input
                                type="text"
                                name="ambulance_number"
                                value={formData.ambulance_number}
                                onChange={handleChange}
                                placeholder="e.g. 911"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Fire Number
                            </label>
                            <input
                                type="text"
                                name="fire_number"
                                value={formData.fire_number}
                                onChange={handleChange}
                                placeholder="e.g. 911"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Embassy Number (Optional)
                            </label>
                            <input
                                type="text"
                                name="embassy_number"
                                value={formData.embassy_number}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Local Rules & Tips
                        </label>
                        <textarea
                            name="local_rules"
                            rows="4"
                            value={formData.local_rules}
                            onChange={handleChange}
                            placeholder="Drive on the left side..."
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                </form>

                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Guide
                    </button>
                </div>
            </div>
        </div>
    )
}
