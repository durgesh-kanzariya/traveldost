import { Mail, Phone, MapPin } from 'lucide-react'

function ContactCard({ icon: Icon, title, info, colorClass, iconColorClass }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-colors">
      <div className={`rounded-lg p-3 ${colorClass.replace('bg-', 'bg-opacity-100 dark:bg-opacity-20 ')} ${iconColorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{info}</p>
    </div>
  )
}

export function AboutContactSection() {
  return (
    <>
      {/* About Section */}
      <section id="about" className="bg-white dark:bg-slate-900 py-16 sm:py-24 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              About TravelDost
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Born from a 6th Semester Major Project, TravelDost aims to make tourism safer and smarter.
              We believe that lack of local knowledge shouldn't be a barrier to exploration.
              By combining geolocation technology with a curated database of local rules and emergency contacts,
              we empower travelers to visit new places with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-16 sm:py-24 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Have questions or want to contribute to our database?
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <ContactCard
              icon={Mail}
              title="Email Us"
              info="support@traveldost.com"
              colorClass="bg-sky-100"
              iconColorClass="text-sky-600"
            />
            <ContactCard
              icon={Phone}
              title="Call Us"
              info="+91 98765 43210"
              colorClass="bg-teal-100"
              iconColorClass="text-teal-600"
            />
            <ContactCard
              icon={MapPin}
              title="Visit Us"
              info="Rajkot, Gujarat, India"
              colorClass="bg-amber-100"
              iconColorClass="text-amber-600"
            />
          </div>
        </div>
      </section>
    </>
  )
}