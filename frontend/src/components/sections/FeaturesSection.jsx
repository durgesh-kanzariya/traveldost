import { MapPin, ShieldAlert, ScrollText, Languages, CheckSquare, Coins } from 'lucide-react'

const capabilities = [
  {
    code: 'MOD_01',
    icon: MapPin,
    title: 'Autonomous Geo Telemetry',
    description:
      'Identifies country and regional boundaries on boot to instantly align all emergency protocols, language tools, and local currencies.',
  },
  {
    code: 'MOD_02',
    icon: ShieldAlert,
    title: 'Emergency SOS Telephony',
    description:
      'One-tap cellular dispatch to verified national police, fire department, paramedic, and consular emergency switches worldwide.',
  },
  {
    code: 'MOD_03',
    icon: ScrollText,
    title: 'Cultural & Legal Protocols',
    description:
      'Curated jurisdiction guidelines covering unwritten social etiquette, transit regulations, tipping customs, and critical local fines.',
  },
  {
    code: 'MOD_04',
    icon: Languages,
    title: 'Dual-Engine Phrasebook',
    description:
      'Offline-first survival lexicon with native phonetics, synthesized speech playback, and custom bilingual scenario translation.',
  },
  {
    code: 'MOD_05',
    icon: Coins,
    title: 'Institutional FX Engine',
    description:
      'Live exchange parity backed by automated cross-rate fallback matrices to calculate travel burn rates with zero network dropouts.',
  },
  {
    code: 'MOD_06',
    icon: CheckSquare,
    title: 'Smart Packing Manifest',
    description:
      'Trip-scoped packing checklists with categorical readiness progress tracking, customs reminders, and document verifications.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
            CORE_SUBSYSTEMS // ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Engineered for Uncompromising Readiness
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Six mission-critical modules built directly into the traveler console for zero-friction exploration.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.code}
                className="group p-5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-wider">
                      {item.code}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>TELEMETRY VERIFIED</span>
                  <span className="text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}