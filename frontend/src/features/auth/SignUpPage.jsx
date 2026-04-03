import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../shared/services/authService';
import { supportedLanguages } from '../../shared/utils/countryLanguages';
import { Mail, Lock, ArrowRight, User, Languages, ArrowLeft } from 'lucide-react'

export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('en')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const selectedLang = supportedLanguages.find(l => l.code === nativeLanguage)
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      nativeLanguage: selectedLang ? selectedLang.name : 'English'
    }

    try {

      const data = await registerUser(userData); // Replaced fetch call

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const nativeLang = data.user.native_language || data.user.nativeLanguage;
      if (nativeLang) {
        localStorage.setItem('nativeLanguage', nativeLang);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error("Signup Error:", error) // <--- Now 'error' is used!
      alert(error.message || 'Signup failed. Please try again.'); // Modified alert to use error.message
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">

        {/* NEW: Back Button */}
        <Link to="/" className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-xl dark:shadow-slate-900/50">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Join us to explore the world safely</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 pl-10 pr-4 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 pl-10 pr-4 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Native Language</label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 pl-10 pr-4 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="" disabled>Select your language</option>
                  {supportedLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 pl-10 pr-4 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 py-3 pl-10 pr-4 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 py-3 font-medium text-white transition-colors"
            >
              Create Account
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}