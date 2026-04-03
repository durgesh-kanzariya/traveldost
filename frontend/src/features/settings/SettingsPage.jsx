import { useState, useEffect } from 'react'
import { Bell, Lock, User, Save, AlertCircle } from 'lucide-react'
import { DashboardLayout, Breadcrumbs } from '../../components/layout'
import { updateUserProfile, changePassword } from '../../shared/services/authService'
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
  'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Zulu'
]

export function SettingsPage() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', nativeLanguage: 'English', defaultCurrency: 'USD' })
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: false,
  })

  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load initial user data from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser({
        firstName: parsed.firstName || parsed.first_name || '',
        lastName: parsed.lastName || parsed.last_name || '',
        email: parsed.email || '',
        nativeLanguage: parsed.nativeLanguage || parsed.native_language || 'English',
        defaultCurrency: parsed.defaultCurrency || parsed.default_currency || 'USD',
      })
    }
  }, [])

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const updatedUser = await updateUserProfile(user)
      // Update LocalStorage
      const stored = JSON.parse(localStorage.getItem('user'))
      const newStored = { ...stored, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(newStored))

      setUser(newStored)
      setMessage('Profile updated successfully!')
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
      setMessage(res.message)
      setPasswords({ oldPassword: '', newPassword: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your account and preferences
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Account Settings */}
      <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <User className="h-5 w-5" />
          Account Settings
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 focus:outline-none cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Native Language</label>
              <div className="mt-1">
                <SearchableSelect
                  value={user.nativeLanguage}
                  onChange={(val) => setUser({ ...user, nativeLanguage: val })}
                  options={LANGUAGES}
                  placeholder="Search language..."
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Currency</label>
              <select
                value={user.defaultCurrency}
                onChange={(e) => setUser({ ...user, defaultCurrency: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 dark:hover:bg-sky-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Lock className="h-5 w-5" />
          Security
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-6 py-2 font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Preferences (Static for now as requested only Name/Password dynamic) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Bell className="h-5 w-5" />
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Notifications</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for emergency updates</p>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Location Tracking</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Auto-detect your location</p>
            </div>
            <button
              onClick={() => toggleSetting('locationTracking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.locationTracking ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.locationTracking ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
