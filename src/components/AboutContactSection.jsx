import { Mail, Phone, MapPin } from 'lucide-react'

export function AboutContactSection() {
  return (
    <>
      {/* About Section */}
      <section id="about" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              About TravelDost
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Born from a 6th Semester Major Project, TravelDost aims to make tourism safer and smarter.
              We believe that lack of local knowledge shouldn't be a barrier to exploration.
              By combining geolocation technology with a curated database of local rules and emergency contacts,
              we empower travelers to visit new places with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Have questions or want to contribute to our database?
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <div className="rounded-lg bg-sky-100 p-3 text-sky-600">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Email Us</h3>
              <p className="mt-2 text-sm text-slate-600">support@traveldost.com</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <div className="rounded-lg bg-teal-100 p-3 text-teal-600">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Call Us</h3>
              <p className="mt-2 text-sm text-slate-600">+91 98765 43210</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Visit Us</h3>
              <p className="mt-2 text-sm text-slate-600">Rajkot, Gujarat, India</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}