import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../../shared/services/authService'
import { setAuthToken, setStoredUser } from '../../shared/utils/authStorage'
import { supportedLanguages } from '../../shared/utils/countryLanguages'
import { Mail, Lock, ArrowRight, User, Languages, ArrowLeft, Plane, AlertCircle } from 'lucide-react'

export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('en')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const selectedLang = supportedLanguages.find((l) => l.code === nativeLanguage)
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      nativeLanguage: selectedLang ? selectedLang.name : 'English',
    }

    try {
      const data = await registerUser(userData)
      setAuthToken(data.token)
      setStoredUser(data.user)

      const nativeLang = data.user.native_language || data.user.nativeLanguage
      if (nativeLang) {
        sessionStorage.setItem('nativeLanguage', nativeLang)
      }

      navigate('/dashboard')
    } catch (err) {
      console.error('Signup Error:', err)
      setError(err.message || 'Registration failed. Please check inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-8 text-zinc-900 dark:text-zinc-100 antialiased">
      <div className="w-full max-w-sm space-y-4">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </Link>

        {/* Card */}
        <div className="p-6 rounded-lg bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
              <Plane className="w-3.5 h-3.5 text-white dark:text-zinc-950 -rotate-45" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              TravelDost
            </span>
          </div>

          <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Create your account
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Join the smart travel companion platform.
          </p>

          {error && (
            <div className="mt-3.5 p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs font-mono text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    autoFocus
                    className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Native Language
              </label>
              <div className="relative">
                <Languages className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                <select
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 px-3 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline font-mono"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}