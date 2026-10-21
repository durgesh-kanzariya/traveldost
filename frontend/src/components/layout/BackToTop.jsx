import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (!isVisible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-md backdrop-blur-xs transition-all animate-in fade-in duration-200"
            aria-label="Back to top"
        >
            <ArrowUp className="w-4 h-4" />
        </button>
    )
}
