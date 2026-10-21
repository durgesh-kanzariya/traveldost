import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Search...',
  loading = false,
  id,
  externalId,
  ariaLabel,
  disabled = false,
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

  if (value !== prevValue) {
    setPrevValue(value || '')
    setQuery(value || '')
  }

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

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

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

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const activeOptionId =
    isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined

  return (
    <div className="relative" ref={ref}>
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
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
          className="w-full pl-8 pr-12 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 disabled:opacity-50 transition-colors"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 pointer-events-none ${
              isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-300' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel || placeholder}
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg py-1 animate-in fade-in duration-100 text-xs font-mono"
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
                className={`px-3 py-1.5 cursor-pointer select-none transition-colors flex items-center justify-between ${
                  isHighlighted
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50'
                    : isSelected
                    ? 'bg-zinc-100/60 dark:bg-zinc-900/60 font-semibold text-zinc-950 dark:text-zinc-50'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <span>{option}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0" />}
              </li>
            )
          })}
        </ul>
      )}

      {isOpen && query.length > 0 && filtered.length === 0 && (
        <div
          id={listboxId}
          role="status"
          className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg px-3 py-2 text-[11px] font-mono text-zinc-400"
        >
          No results for "{query}"
        </div>
      )}
    </div>
  )
}
