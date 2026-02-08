import { Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold text-white">TravelDost</span>
          </a>
          <p className="text-center text-slate-400 dark:text-slate-500">
            Your trusted companion for safe and informed travel experiences
            worldwide.
          </p>
          <div className="flex flex-col items-center gap-2 pt-4 text-sm text-slate-500 dark:text-slate-600">
            <p>&copy; {new Date().getFullYear()} TravelDost. All rights reserved.</p>
            <p>Made with love in India</p>
          </div>
        </div>
      </div>
    </footer>
  )
}