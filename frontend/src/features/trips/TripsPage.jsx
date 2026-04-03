import { useState, useEffect } from 'react'
import { Plus, Plane } from 'lucide-react'
import { DashboardLayout, Breadcrumbs } from '../../components/layout'
import { TripCard, TripForm, DeleteTripModal } from './'
import { Modal } from '../../components/ui'
import { useTrips } from './useTrips'
import { getAllGuides } from '../../shared/services'

export function TripsPage() {
  const { trips, loading, addTrip, editTrip, removeTrip, getChecklistItemCount } = useTrips()

  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [tripToDelete, setTripToDelete] = useState(null)
  const [tripToEdit, setTripToEdit] = useState(null)
  const [checklistItemCount, setChecklistItemCount] = useState(0)
  const [deleteOption, setDeleteOption] = useState('move_to_general')

  const [countries, setCountries] = useState([])
  const [countriesLoading, setCountriesLoading] = useState(false)

  useEffect(() => {
    setCountriesLoading(true)
    getAllGuides()
      .then(setCountries)
      .finally(() => setCountriesLoading(false))
  }, [])

  const handleCreateSubmit = async (formData) => {
    try {
      await addTrip(formData)
      setShowModal(false)
    } catch (err) {
      alert('Failed to create trip')
    }
  }

  const handleEditSubmit = async (formData) => {
    try {
      await editTrip(tripToEdit.id, formData)
      setShowEditModal(false)
      setTripToEdit(null)
    } catch (err) {
      alert('Failed to update trip')
    }
  }

  const handleDeleteClick = async (trip) => {
    setTripToDelete(trip)
    const count = await getChecklistItemCount(trip.id)
    setChecklistItemCount(count)
    setShowDeleteModal(true)
  }

  const handleEditClick = (trip) => {
    setTripToEdit(trip)
    setShowEditModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeTrip(tripToDelete.id, deleteOption)
      setShowDeleteModal(false)
      setTripToDelete(null)
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
            <TripCard key={trip.id} trip={trip} onEdit={handleEditClick} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Plan New Trip">
          <TripForm
            onSubmit={handleCreateSubmit}
            countries={countries}
            countriesLoading={countriesLoading}
            submitLabel="Create Trip"
          />
        </Modal>
      )}

      {/* Edit Trip Modal */}
      {showEditModal && tripToEdit && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Trip">
          <TripForm
            initialData={{
              destinations: tripToEdit.destinations?.length > 0 ? tripToEdit.destinations : [tripToEdit.destination || ''],
              start_date: tripToEdit.start_date?.split('T')[0] || '',
              end_date: tripToEdit.end_date?.split('T')[0] || '',
              budget: tripToEdit.budget || '',
              currency: tripToEdit.currency || 'USD',
            }}
            onSubmit={handleEditSubmit}
            countries={countries}
            countriesLoading={countriesLoading}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTripModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        trip={tripToDelete}
        checklistCount={checklistItemCount}
        deleteOption={deleteOption}
        setDeleteOption={setDeleteOption}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  )
}
