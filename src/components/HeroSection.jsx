import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Shield, Languages } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Explore the World{' '}
              <span className="text-sky-600">Without Fear</span>
            </h1>
            <p className="text-pretty text-lg text-slate-600 sm:text-xl">
              Your smart travel companion that auto-detects your location to
              provide instant emergency numbers, regional rules, language tools,
              and local insights. Travel safe, travel smart.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-sky-700"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md rounded-3xl bg-gradient-to-br from-sky-600 to-teal-500 p-1 shadow-2xl">
              <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-3xl bg-white p-8">
                <div className="flex items-center gap-3 rounded-full bg-sky-100 px-4 py-2">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <span className="text-sm font-medium text-sky-700">
                    Location Detected: Tokyo, Japan
                  </span>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="rounded-xl bg-red-50 p-4 text-center">
                    <Shield className="mx-auto h-8 w-8 text-red-500" />
                    <p className="mt-2 text-xs font-medium text-red-700">
                      Emergency: 110
                    </p>
                  </div>
                  <div className="rounded-xl bg-teal-50 p-4 text-center">
                    <Languages className="mx-auto h-8 w-8 text-teal-500" />
                    <p className="mt-2 text-xs font-medium text-teal-700">
                      Language: Japanese
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500">
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