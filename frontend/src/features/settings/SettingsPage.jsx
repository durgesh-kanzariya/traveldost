import { useState, useEffect } from 'react'
import { User, Lock, Bell, Check, AlertCircle } from 'lucide-react'
import { DashboardLayout } from '../../components/layout'
import { updateUserProfile, changePassword } from '../../shared/services/authService'
import { getStoredUser, setStoredUser } from '../../shared/utils/authStorage'
import { SearchableSelect } from '../../components/ui'

const LANGUAGES = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Bengali', 'Bosnian',
  'Bulgarian', 'Burmese', 'Catalan', 'Chinese (Simplified)', 'Chinese (Traditional)',
  'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Estonian', 'Finnish', 'French',
  'German', 'Greek', 'Gujarati', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian',
  'Japanese', 'Kannada', 'Korean', 'Latvian', 'Lithuanian', 'Macedonian', 'Malay',
  'Malayalam', 'Marathi', 'Nepali', 'Norwegian', 'Persian', 'Polish', 'Portuguese',
  'Punjabi', 'Romanian', 'Russian', 'Serbian', 'Sinhala', 'Slovak', 'Slovenian',
  'Somali', 'Spanish', 'Swahili', 'Swedish', 'Tagalog', 'Tamil', 'Telugu', 'Thai',
  'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Zulu',
]

export function SettingsPage() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nativeLanguage: 'English',
    defaultCurrency: 'USD',
  })
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
  })

  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser({
        firstName: stored.firstName || stored.first_name || '',
        lastName: stored.lastName || stored.last_name || '',
        email: stored.email || '',
        nativeLanguage: stored.nativeLanguage || stored.native_language || 'English',
        defaultCurrency: stored.defaultCurrency || stored.default_currency || 'USD',
      })
    }
  }, [])

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const updatedUser = await updateUserProfile(user)
      const stored = getStoredUser() || {}
      const newStored = { ...stored, ...updatedUser }
      setStoredUser(newStored)
      setUser(newStored)
      setMessage('Profile settings updated successfully.')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await changePassword(passwords)
      setMessage(res.message || 'Security credentials updated.')
      setPasswords({ oldPassword: '', newPassword: '' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* ════════════════════════════════════════
            HEADER
        ═════════════════════════════════════════ */}
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Account & System Preferences
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Manage your personal traveler identity, localized presets, and security authentication.
          </p>
        </div>

        {/* Feedback Notifications */}
        {message && (
          <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-xs font-mono text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ════════════════════════════════════════
            PROFILE & LOCALIZATION SETTINGS
        ═════════════════════════════════════════ */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <User className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Traveler Profile & Presets
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Email Address
                </label>
                <span className="text-[10px] font-mono text-zinc-400">Verified Identity</span>
              </div>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Native Dialect
                </label>
                <SearchableSelect
                  id="settings-native-language"
                  value={user.nativeLanguage}
                  onChange={(val) => setUser({ ...user, nativeLanguage: val })}
                  options={LANGUAGES}
                  placeholder="Select dialect..."
                  ariaLabel="Native Language"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Default Currency
                </label>
                <select
                  id="settings-default-currency"
                  value={user.defaultCurrency}
                  onChange={(e) => setUser({ ...user, defaultCurrency: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                >
                  {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
            >
              <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* ════════════════════════════════════════
            SECURITY CREDENTIALS
        ═════════════════════════════════════════ */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Lock className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Authentication & Security
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !passwords.oldPassword || !passwords.newPassword}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-mono font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
            >
              <span>Update Credentials</span>
            </button>
          </form>
        </div>

        {/* ════════════════════════════════════════
            SYSTEM TELEMETRY PREFERENCES
        ═════════════════════════════════════════ */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Bell className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              System Telemetry & Signals
            </h2>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Regional Emergency Notifications
                </p>
                <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  Receive live crisis updates and geopolitical travel advisories
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleSetting('notifications')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                  settings.notifications ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 shadow-sm transition duration-200 ease-in-out ${
                    settings.notifications ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3.5">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Geospatial GPS Background Polling
                </p>
                <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  Continuous coordinate resolution for automated local emergency number matching
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleSetting('locationTracking')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                  settings.locationTracking ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 shadow-sm transition duration-200 ease-in-out ${
                    settings.locationTracking ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
