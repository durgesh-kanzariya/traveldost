import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Search } from 'lucide-react'

/**
 * Reusable accessible searchable dropdown component.
 * Props:
 *  - value: currently selected value (string)
 *  - onChange: callback(newValue)
 *  - options: array of strings
 *  - placeholder: input placeholder string
 *  - loading: bool
 *  - id: optional id
 *  - ariaLabel: accessible label for screen readers
 */
export function SearchableSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Search...',
    loading = false,
    id: externalId,
    ariaLabel,
    disabled = false
}) {
    const generatedId = useId()
    const inputId = externalId || `combobox-${generatedId}`
    const listboxId = `listbox-${generatedId}`

    const [query, setQuery] = useState(value || '')
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const ref = useRef(null)
    const listRef = useRef(null)

    // sync if parent changes value externally
    useEffect(() => {
        setQuery(value || '')
    }, [value])

    // close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false)
                setHighlightedIndex(-1)
            }
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
        setHighlightedIndex(-1)
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value)
        onChange(e.target.value) // keep parent in sync while typing
        setIsOpen(true)
        setHighlightedIndex(0)
    }

    const handleKeyDown = (e) => {
        if (disabled || loading) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!isOpen) {
                setIsOpen(true)
                setHighlightedIndex(0)
            } else if (filtered.length > 0) {
                setHighlightedIndex((prev) => (prev + 1) % filtered.length)
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (!isOpen) {
                setIsOpen(true)
                setHighlightedIndex(filtered.length - 1)
            } else if (filtered.length > 0) {
                setHighlightedIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1))
            }
        } else if (e.key === 'Enter') {
            if (isOpen && highlightedIndex >= 0 && highlightedIndex < filtered.length) {
                e.preventDefault()
                handleSelect(filtered[highlightedIndex])
            }
        } else if (e.key === 'Escape') {
            if (isOpen) {
                e.preventDefault()
                e.stopPropagation()
                setIsOpen(false)
                setHighlightedIndex(-1)
            }
        } else if (e.key === 'Tab') {
            setIsOpen(false)
            setHighlightedIndex(-1)
        }
    }

    // Scroll active item into view
    useEffect(() => {
        if (isOpen && highlightedIndex >= 0 && listRef.current) {
            const activeEl = listRef.current.children[highlightedIndex]
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest' })
            }
        }
    }, [highlightedIndex, isOpen])

    const activeOptionId = isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined

    return (
        <div className="relative" ref={ref}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                    id={inputId}
                    type="text"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? listboxId : undefined}
                    aria-activedescendant={activeOptionId}
                    aria-label={ariaLabel || placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setIsOpen(true)
                        if (filtered.length > 0) setHighlightedIndex(0)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={loading ? 'Loading...' : placeholder}
                    disabled={disabled || loading}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:opacity-50"
                />
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-transform pointer-events-none ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && filtered.length > 0 && (
                <ul
                    id={listboxId}
                    role="listbox"
                    aria-label={ariaLabel || placeholder}
                    ref={listRef}
                    className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg"
                >
                    {filtered.map((option, idx) => {
                        const isSelected = option === value
                        const isHighlighted = idx === highlightedIndex
                        return (
                            <li
                                key={option}
                                id={`${listboxId}-option-${idx}`}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                        isHighlighted
                                            ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200'
                                            : isSelected
                                            ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-medium'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    {option}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}

            {isOpen && query.length > 0 && filtered.length === 0 && (
                <div
                    id={listboxId}
                    role="status"
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-400"
                >
                    No matches found for "{query}"
                </div>
            )}
        </div>
    )
}
