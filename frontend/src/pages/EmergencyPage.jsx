import { ShieldAlert, Phone, Ambulance } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'

const emergencyServices = [
  { id: 1, name: 'Police', number: '100', icon: ShieldAlert, color: 'bg-red-100 text-red-600' },
  { id: 2, name: 'Ambulance', number: '108', icon: Ambulance, color: 'bg-orange-100 text-orange-600' },
  { id: 3, name: 'Fire Brigade', number: '101', icon: ShieldAlert, color: 'bg-red-100 text-red-600' },
  { id: 4, name: 'Women Helpline', number: '1091', icon: Phone, color: 'bg-pink-100 text-pink-600' },
]

export function EmergencyPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Emergency Services
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">
            Rajkot, Gujarat
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {emergencyServices.map((service) => (
          <div key={service.id} className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-lg p-3 ${service.color}`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {service.name}
              </h2>
            </div>
            <a
              href={`tel:${service.number}`}
              className="block w-full rounded-lg bg-red-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-red-700"
            >
              <span className="text-2xl">{service.number}</span>
            </a>
            <p className="mt-3 text-center text-xs text-slate-500">
              Tap to call
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Important Tips
        </h2>
        <ul className="space-y-2 text-slate-700">
          <li>• Always dial the correct emergency number for your location</li>
          <li>• Provide accurate location details when calling</li>
          <li>• Stay calm and follow the operator's instructions</li>
          <li>• Keep emergency numbers saved in your phone</li>
        </ul>
      </div>
    </DashboardLayout>
  )
}
