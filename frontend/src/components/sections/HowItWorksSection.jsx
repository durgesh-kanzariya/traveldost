import { UserPlus, Radio, Compass } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    code: 'STEP_01',
    phase: 'INITIALIZATION',
    title: 'Initialize Traveler ID',
    description:
      'Register your traveler profile to unlock personal itinerary ledgers, customs checklists, and customized emergency telemetry.',
  },
  {
    code: 'STEP_02',
    icon: Radio,
    phase: 'GEOLOCATION_LOCK',
    title: 'Authorize Telemetry',
    description:
      'Enable browser coordinate tracking. TravelDost matches latitude & longitude against national geospatial boundaries in real-time.',
  },
  {
    code: 'STEP_03',
    icon: Compass,
    phase: 'AUTONOMOUS_DISPATCH',
    title: 'Commence Field Operations',
    description:
      'Access local emergency hotlines, legal rules, currency parity, and survival phrases tailored specifically to where your feet are.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
            PROTOCOL_PIPELINE // EXECUTION
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            How Telemetry Coordinates
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Three straightforward stages establish high-accuracy traveler intelligence.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.code}
                className="p-6 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-wider">
                      {item.code}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                    {item.phase}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-[10px] text-zinc-400">
                  <span>PIPELINE VERIFIED</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}