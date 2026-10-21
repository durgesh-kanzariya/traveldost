import { useState } from 'react'
import { X, Save } from 'lucide-react'

export function GuideFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const emptyForm = {
        country_name: '',
        police_number: '',
        ambulance_number: '',
        fire_number: '',
        embassy_number: '',
        local_rules: ''
    }

    const [prevInitialData, setPrevInitialData] = useState(initialData)
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
    const [formData, setFormData] = useState(initialData || emptyForm)

    if (initialData !== prevInitialData || isOpen !== prevIsOpen) {
        setPrevInitialData(initialData)
        setPrevIsOpen(isOpen)
        setFormData(initialData || emptyForm)
    }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                            INTELLIGENCE_DOSSIER
                        </span>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {initialData ? `Edit Guide: ${initialData.country_name}` : 'New Country Intelligence Guide'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form id="guide-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div>
                        <label className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                            Country / Territory Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="country_name"
                            required
                            value={formData.country_name}
                            onChange={handleChange}
                            placeholder="e.g. Japan, Germany, Switzerland"
                            className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 font-sans"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                Police Dispatch
                            </label>
                            <input
                                type="text"
                                name="police_number"
                                value={formData.police_number}
                                onChange={handleChange}
                                placeholder="e.g. 110, 911"
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                Ambulance / Paramedic
                            </label>
                            <input
                                type="text"
                                name="ambulance_number"
                                value={formData.ambulance_number}
                                onChange={handleChange}
                                placeholder="e.g. 119, 112"
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                Fire Department
                            </label>
                            <input
                                type="text"
                                name="fire_number"
                                value={formData.fire_number}
                                onChange={handleChange}
                                placeholder="e.g. 119, 999"
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                Consular / Embassy Hotline
                            </label>
                            <input
                                type="text"
                                name="embassy_number"
                                value={formData.embassy_number}
                                onChange={handleChange}
                                placeholder="e.g. +1 (555) 019-2834"
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                            Local Rules, Cultural Norms & Advisories
                        </label>
                        <textarea
                            name="local_rules"
                            rows="4"
                            value={formData.local_rules}
                            onChange={handleChange}
                            placeholder="Rules regarding jaywalking, transit etiquette, tipping practices, emergency procedures..."
                            className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none font-sans"
                        />
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="guide-form"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Guide</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
