import { MapPin, ShieldAlert, ScrollText, Languages, ClipboardList, Sparkles } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Smart Location Detection',
    description:
      'Automatically detects your location and provides region-specific information instantly.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: ShieldAlert,
    title: 'Emergency SOS',
    description:
      'One-tap access to local emergency numbers for police, ambulance, and fire services.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: ScrollText,
    title: 'Uncommon Rules',
    description:
      'Learn about local laws and customs that tourists often miss, avoiding fines and embarrassment.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Languages,
    title: 'Language Tools',
    description:
      'Essential phrases, pronunciation guides, and real-time translation for seamless communication.',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    icon: ClipboardList,
    title: 'Trip Checklist',
    description:
      'Customized packing lists and travel document reminders based on your destination.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Sparkles,
    title: 'Local Gems',
    description:
      'Discover hidden spots, local favorites, and authentic experiences off the tourist trail.',
    color: 'bg-pink-100 text-pink-600',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white dark:bg-slate-900 py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything You Need to Travel Safe
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Powerful features designed to keep you informed, prepared, and
            confident wherever your adventures take you.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-all hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-lg dark:hover:shadow-slate-900/50"
            >
              <div
                className={`inline-flex rounded-xl p-3 ${feature.color.replace('bg-', 'bg-opacity-100 dark:bg-opacity-20 ')}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}