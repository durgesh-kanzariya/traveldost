import { UserPlus, MapPin, Compass } from 'lucide-react' // Changed Download to UserPlus

const steps = [
  {
    icon: UserPlus, // Changed icon to represent 'Sign Up'
    step: '01',
    title: 'Create Your Account', // Fixed title
    description:
      'Sign up for free on our website to access your personalized travel dashboard.', // Fixed description
  },
  {
    icon: MapPin,
    step: '02',
    title: 'Enable Location',
    description:
      'Allow location access in your browser so TravelDost can detect where you are instantly.',
  },
  {
    icon: Compass,
    step: '03',
    title: 'Start Exploring',
    description:
      'Instantly view emergency numbers, regional rules, and travel tools for your current location.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start exploring the world safely in three simple steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-sky-300 to-transparent md:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-600 shadow-lg">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}