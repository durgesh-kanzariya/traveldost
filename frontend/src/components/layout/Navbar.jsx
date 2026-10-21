import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react'
import { useTheme } from '../../shared/context/ThemeContext'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Capabilities', href: '#features' },
    { name: 'Architecture', href: '#how-it-works' },
    { name: 'Mission', href: '#about' },
    { name: 'Dispatch', href: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-2xs'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-900 text-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-bold transition-transform group-hover:scale-105">
            TD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              TravelDost
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
              TRAVEL OS
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800"></div>

          <Link
            to="/login"
            className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-2xs"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 px-4 py-4 md:hidden backdrop-blur-md">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                to="/login"
                className="w-full text-center px-3 py-2 text-xs font-medium rounded border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="w-full text-center px-3 py-2 text-xs font-medium rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Launch Console
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}