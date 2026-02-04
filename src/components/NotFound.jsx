import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-teal-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Don't worry, let's get you back on track!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
