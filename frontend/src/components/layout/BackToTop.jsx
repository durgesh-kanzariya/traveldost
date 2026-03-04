import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
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

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 rounded-full bg-sky-600 p-3 text-white shadow-lg transition-transform hover:bg-sky-700 hover:-translate-y-1 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-500 animate-fade-in"
                    aria-label="Back to top"
                >
                    <ArrowUp className="h-6 w-6" />
                </button>
            )}
        </>
    )
}
