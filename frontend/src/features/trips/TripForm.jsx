import { useState } from 'react'
import { Plus, MapPin, X } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

export function TripForm({ initialData, onSubmit, countries, countriesLoading, submitLabel = 'Submit' }) {
    const [formData, setFormData] = useState(initialData || {
        destinations: [''],
        start_date: '',
        end_date: '',
        budget: '',
        currency: (() => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                return user?.default_currency || user?.defaultCurrency || 'USD';
            } catch (e) {
                return 'USD';
            }
        })()
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const addStop = () => {
        if (formData.destinations.length < 5) {
            setFormData({ ...formData, destinations: [...formData.destinations, ''] })
        }
    }

    const removeStop = (idx) => {
        setFormData({ ...formData, destinations: formData.destinations.filter((_, i) => i !== idx) })
    }

    const updateStop = (idx, val) => {
        const updated = [...formData.destinations]
        updated[idx] = val
        setFormData({ ...formData, destinations: updated })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Destinations *
                    </label>
                    {formData.destinations.length < 5 && (
                        <button
                            type="button"
                            onClick={addStop}
                            className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 font-medium"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add stop
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {formData.destinations.map((dest, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs min-w-[54px]">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {idx === 0 ? 'Start' : `Stop ${idx}`}
                            </div>
                            <div className="flex-1">
                                <SearchableSelect
                                    value={dest}
                                    onChange={(val) => updateStop(idx, val)}
                                    options={countries}
                                    placeholder="Search country..."
                                    loading={countriesLoading}
                                />
                            </div>
                            {formData.destinations.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeStop(idx)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
                    <input type="date" required value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
                    <input type="date" required value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget</label>
                    <input type="number" min="0" step="0.01" value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="e.g. 2000" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                    <select value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                        {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium transition-colors">
                {submitLabel}
            </button>
        </form>
    )
}
