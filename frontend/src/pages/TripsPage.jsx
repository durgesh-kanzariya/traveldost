import { useState } from 'react'
import { Plus, Plane, X, AlertTriangle, ListChecks } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { TripCard } from '../components/trips/TripCard'
import { Modal } from '../components/ui/Modal'
import { useTrips } from '../hooks/useTrips'

const INITIAL_FORM = {
  destination: '',
  start_date: '',
  end_date: '',
  budget: '',
  currency: 'USD'
}

export function TripsPage() {
  const { trips, loading, addTrip, removeTrip, getChecklistItemCount } = useTrips()
  
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tripToDelete, setTripToDelete] = useState(null)
  const [checklistItemCount, setChecklistItemCount] = useState(0)
  const [deleteOption, setDeleteOption] = useState('move_to_general')
  const [formData, setFormData] = useState(INITIAL_FORM)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addTrip(formData)
      setShowModal(false)
      setFormData(INITIAL_FORM)
    } catch (err) {
      alert('Failed to create trip')
    }
  }

  const handleDeleteClick = async (trip) => {
    setTripToDelete(trip)
    const count = await getChecklistItemCount(trip.id)
    setChecklistItemCount(count)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return
    try {
      await removeTrip(tripToDelete.id, deleteOption)
      setShowDeleteModal(false)
      setTripToDelete(null)
      setChecklistItemCount(0)
      setDeleteOption('move_to_general')
    } catch (err) {
      alert('Failed to delete trip')
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Breadcrumbs />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl flex items-center gap-3">
              <Plane className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              My Trips
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Plan and manage your travel trips
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Plane className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">No trips planned yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Plan Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Plan New Trip">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Destination *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                placeholder="e.g., Japan, France, USA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium transition-colors"
            >
              Create Trip
            </button>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={`Delete ${tripToDelete?.destination}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
          </div>

          {checklistItemCount > 0 && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  This trip has {checklistItemCount} checklist item{checklistItemCount > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                  <input
                    type="radio"
                    name="deleteOption"
                    value="move_to_general"
                    checked={deleteOption === 'move_to_general'}
                    onChange={(e) => setDeleteOption(e.target.value)}
                    className="h-4 w-4 text-sky-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Move to General checklist
                  </span>
                </label>
                
                <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                  <input
                    type="radio"
                    name="deleteOption"
                    value="delete_items"
                    checked={deleteOption === 'delete_items'}
                    onChange={(e) => setDeleteOption(e.target.value)}
                    className="h-4 w-4 text-sky-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Delete checklist items too
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setTripToDelete(null)
                setChecklistItemCount(0)
                setDeleteOption('move_to_general')
              }}
              className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}
