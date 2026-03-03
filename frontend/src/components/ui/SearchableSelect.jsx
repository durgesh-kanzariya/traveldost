import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

/**
 * Reusable searchable dropdown component.
 * Props:
 *  - value: currently selected value (string)
 *  - onChange: callback(newValue)
 *  - options: array of strings
 *  - placeholder: input placeholder string
 *  - loading: bool
 */
export function SearchableSelect({ value, onChange, options = [], placeholder = 'Search...', loading = false }) {
    const [query, setQuery] = useState(value || '')
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    // sync if parent changes value externally
    useEffect(() => {
        setQuery(value || '')
    }, [value])

    // close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const filtered = options.filter(o =>
        o.toLowerCase().includes(query.toLowerCase())
    )

    const handleSelect = (option) => {
        setQuery(option)
        onChange(option)
        setIsOpen(false)
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value)
        onChange(e.target.value) // keep parent in sync while typing
        setIsOpen(true)
    }

    return (
        <div className="relative" ref={ref}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={loading ? 'Loading...' : placeholder}
                    disabled={loading}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:opacity-50"
                />
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-transform pointer-events-none ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && filtered.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                    {filtered.map((option) => (
                        <li key={option}>
                            <button
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-700 dark:hover:text-sky-400 ${option === value ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && query.length > 0 && filtered.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-400">
                    No matches found for "{query}"
                </div>
            )}
        </div>
    )
}
