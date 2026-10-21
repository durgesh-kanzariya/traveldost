import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-10 transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Mission Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-900 text-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-[10px] font-bold">
                TD
              </div>
              <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                TravelDost
              </span>
            </Link>
            <span className="font-mono text-[10px] text-zinc-400">
              // TRAVEL_OS
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 font-mono text-xs text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Architecture
            </a>
            <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Mission
            </a>
            <Link to="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Console Sign In
            </Link>
          </div>

          {/* Copyright & Status */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ALL_SYSTEMS_OPERATIONAL
            </span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}