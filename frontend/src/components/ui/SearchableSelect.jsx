import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

/**
 * Reusable accessible searchable dropdown component with polished combobox UX.
 */
export function SearchableSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Search...',
    loading = false,
    id,
    externalId,
    ariaLabel,
    disabled = false
}) {
    const generatedId = useId()
    const inputId = id || externalId || `combobox-${generatedId}`
    const listboxId = `listbox-${generatedId}`

    const [prevValue, setPrevValue] = useState(value || '')
    const [query, setQuery] = useState(value || '')
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const ref = useRef(null)
    const listRef = useRef(null)

    // Sync state during render when parent prop changes
    if (value !== prevValue) {
        setPrevValue(value || '')
        setQuery(value || '')
    }

    // Close on outside click
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

    const handleClear = (e) => {
        e.stopPropagation()
        setQuery('')
        onChange('')
        setIsOpen(false)
        setHighlightedIndex(-1)
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value)
        onChange(e.target.value)
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
            <div className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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
                    placeholder={loading ? 'Loading options...' : placeholder}
                    disabled={disabled || loading}
                    className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:opacity-50 transition-all duration-200"
                />
                <div className="absolute right-2.5 flex items-center gap-1">
                    {query && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear selection"
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 pointer-events-none ${isOpen ? 'rotate-180 text-sky-500' : ''}`}
                    />
                </div>
            </div>

            {isOpen && filtered.length > 0 && (
                <ul
                    id={listboxId}
                    role="listbox"
                    aria-label={ariaLabel || placeholder}
                    ref={listRef}
                    className="absolute z-50 w-full mt-1.5 max-h-56 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150"
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
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                className={`px-4 py-2.5 text-sm cursor-pointer select-none transition-colors flex items-center justify-between ${
                                    isHighlighted
                                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 font-medium'
                                        : isSelected
                                        ? 'bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 font-semibold'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                <span>{option}</span>
                                {isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}

            {isOpen && query.length > 0 && filtered.length === 0 && (
                <div
                    id={listboxId}
                    role="status"
                    className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl px-4 py-3 text-xs text-slate-400 animate-in fade-in duration-150"
                >
                    No matches found for "{query}"
                </div>
            )}
        </div>
    )
}
