import { useState } from 'react'
import { Bell, Lock, User } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: false,
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
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

      {/* Account Settings */}
      <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <User className="h-5 w-5" />
          Account Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <button className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 dark:hover:bg-sky-500">
            Save Changes
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Lock className="h-5 w-5" />
          Security
        </h2>
        <button className="rounded-lg border border-slate-300 dark:border-slate-600 px-6 py-2 font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
          Change Password
        </button>
      </div>

      {/* Preferences */}
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
