/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    // 1. Initialize from localStorage or System Preference
    const [theme, setTheme] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('theme')
                if (stored) return stored
            }
        } catch { /* storage inaccessible */ }

        if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
            return 'dark'
        }
        return 'light'
    })

    // 2. Apply theme to <html> tag
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
                ? 'dark'
                : 'light'
            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
        try {
            localStorage.setItem('theme', theme)
        } catch { /* ignore storage error */ }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
