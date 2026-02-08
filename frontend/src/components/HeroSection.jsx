import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Shield, Languages } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Explore the World{' '}
              <span className="text-sky-600 dark:text-sky-500">Without Fear</span>
            </h1>
            <p className="text-pretty text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
              Your smart travel companion that auto-detects your location to
              provide instant emergency numbers, regional rules, language tools,
              and local insights. Travel safe, travel smart.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md rounded-3xl bg-gradient-to-br from-sky-600 to-teal-500 p-1 shadow-2xl dark:shadow-sky-900/20">
              <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-3xl bg-white dark:bg-slate-900 p-8">
                <div className="flex items-center gap-3 rounded-full bg-sky-100 dark:bg-sky-900/30 px-4 py-2">
                  <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                    Location Detected: Tokyo, Japan
                  </span>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-center">
                    <Shield className="mx-auto h-8 w-8 text-red-500 dark:text-red-400" />
                    <p className="mt-2 text-xs font-medium text-red-700 dark:text-red-300">
                      Emergency: 110
                    </p>
                  </div>
                  <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 p-4 text-center">
                    <Languages className="mx-auto h-8 w-8 text-teal-500 dark:text-teal-400" />
                    <p className="mt-2 text-xs font-medium text-teal-700 dark:text-teal-300">
                      Language: Japanese
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Tip: Tipping is not customary and can be considered rude in
                  Japan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}