import { Mail, Phone, MapPin, Globe, Terminal } from 'lucide-react'

export function AboutContactSection() {
  return (
    <>
      {/* About Section */}
      <section id="about" className="py-20 sm:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                MISSION_BRIEF // DOSSIER
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Democratizing Sovereign Travel Intelligence
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Born as a 6th Semester Major Project, TravelDost was conceived to solve a critical vulnerability: the information deficit international travelers face when crossing borders.
              </p>
              <p>
                From misremembered emergency telephone numbers to inadvertent municipal infractions, traditional travel platforms focus on bookings rather than field safety. By integrating automatic geolocation detection with curated jurisdictional protocols and offline-cached utilities, TravelDost provides confidence everywhere.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                <div className="p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                  <span className="text-[10px] uppercase text-zinc-500 block">Stack</span>
                  React 19 • Express • PostgreSQL
                </div>
                <div className="p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                  <span className="text-[10px] uppercase text-zinc-500 block">Coordinates</span>
                  Rajkot, Gujarat, India
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
              DISPATCH_SWITCH // COMMS
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Establish Communications
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Inquire about country dossier contributions, bug telemetry, or technical partnerships.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
              <div className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">Electronic Mail</span>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                support@traveldost.com
              </h3>
              <p className="text-[11px] text-zinc-500 mt-2">
                24/7 ticket routing & advisory updates
              </p>
            </div>

            <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
              <div className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 mb-3">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">Telephony Hotline</span>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                +91 98765 43210
              </h3>
              <p className="text-[11px] text-zinc-500 mt-2">
                Direct operations dispatch line
              </p>
            </div>

            <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-2xs">
              <div className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">Base of Operations</span>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Rajkot, Gujarat, India
              </h3>
              <p className="text-[11px] text-zinc-500 mt-2">
                Asia / Kolkata (UTC+05:30)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}