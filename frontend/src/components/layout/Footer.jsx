import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="TravelDost Logo" className="w-10 h-10 object-cover rounded-md" />
            <span className="text-xl font-bold text-white">TravelDost</span>
          </Link>
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