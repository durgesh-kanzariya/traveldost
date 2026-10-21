import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Shield, Phone, Radio, Activity, Terminal } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-150">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>TD_ENGINE // BORDERLESS TRAVEL OPERATING SYSTEM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 text-balance leading-[1.08]">
              Precision Telemetry for the Global Wayfarer.
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              TravelDost coordinates mission-critical travel intelligence into a unified command plane. Auto-detecting regional boundaries to dispatch local emergency hotlines, legal protocols, live cross-currency parity, and trip manifests.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-zinc-900 dark:bg-zinc-100 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs"
              >
                <span>Launch Free Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Explore Architecture</span>
              </a>
            </div>

            {/* Quick stats strip */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <span className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-100 block">
                  190+
                </span>
                <span className="font-mono text-[10px] uppercase text-zinc-500">
                  Global Jurisdictions
                </span>
              </div>
              <div>
                <span className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-100 block">
                  0 ms
                </span>
                <span className="font-mono text-[10px] uppercase text-zinc-500">
                  Offline Fallback Cache
                </span>
              </div>
              <div>
                <span className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-100 block">
                  99.9%
                </span>
                <span className="font-mono text-[10px] uppercase text-zinc-500">
                  SOS Parity Uptime
                </span>
              </div>
            </div>
          </div>

          {/* Right Live Telemetry Terminal Mockup (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  <span>NODE_TOKYO // LIVE</span>
                </div>
              </div>

              {/* Window Content */}
              <div className="p-5 space-y-4 font-mono">
                {/* Active Scope Pill */}
                <div className="p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-zinc-500" />
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block">Geo Scope</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Tokyo, JP (Kanto)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">
                    LOCKED
                  </span>
                </div>

                {/* Dispatch Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
                    <span className="text-[9px] text-zinc-400 uppercase block">Police Hotline</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-red-500" />
                      110
                    </span>
                  </div>
                  <div className="p-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
                    <span className="text-[9px] text-zinc-400 uppercase block">Medical / Fire</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 mt-0.5">
                      <Shield className="w-3 h-3 text-amber-500" />
                      119
                    </span>
                  </div>
                </div>

                {/* FX Spot Ticker */}
                <div className="p-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase block">Spot Parity</span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      1 USD = 154.20 JPY
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    OPEN_EXCHANGE
                  </span>
                </div>

                {/* Cultural Protocol Chip */}
                <div className="p-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-0.5">
                    Protocol Alert #01:
                  </span>
                  Tipping is strictly non-customary and may be refused. Keep transit passes accessible at metro gates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}