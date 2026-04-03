import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../shared/context/ThemeContext'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm'
        : 'border-transparent bg-transparent'
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="TravelDost Logo" className="w-10 h-10 object-cover rounded-md" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">TravelDost</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-sky-600 dark:hover:text-sky-400"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            Sign Up Free
          </Link>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-slate-700 dark:text-slate-200" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 md:hidden shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-sky-600 dark:hover:text-sky-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login"
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-center text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-sky-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}