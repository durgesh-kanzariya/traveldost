import { useState, useEffect, useMemo } from 'react'
import { Plus, Plane, Compass } from 'lucide-react'
import { DashboardLayout } from '../../components/layout'
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
  const [countriesLoading, setCountriesLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getAllGuides()
      .then((data) => {
        if (isMounted) setCountries(data || [])
      })
      .catch((error) => {
        console.error('Failed to load country guides:', error)
        if (isMounted) setCountries([])
      })
      .finally(() => {
        if (isMounted) setCountriesLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleCreateSubmit = async (formData) => {
    try {
      await addTrip(formData)
      setShowModal(false)
    } catch {
      alert('Failed to create trip')
    }
  }

  const handleEditSubmit = async (formData) => {
    try {
      await editTrip(tripToEdit.id, formData)
      setShowEditModal(false)
      setTripToEdit(null)
    } catch {
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
    } catch {
      alert('Failed to delete trip')
    }
  }

  // Calculate summary metrics
  const stats = useMemo(() => {
    const total = trips.length
    const now = new Date()
    const active = trips.filter((t) => {
      const s = new Date(t.start_date)
      const e = new Date(t.end_date)
      return now >= s && now <= e
    }).length
    const upcoming = trips.filter((t) => new Date(t.start_date) > now).length

    return { total, active, upcoming }
  }, [trips])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════
            HEADER & ACTION BAR
        ═════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Trip Itineraries
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Active routes, multi-city waypoints, and travel budget parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Itinerary</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            METRIC STRIP
        ═════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
              Total Logged
            </span>
            <div className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {stats.total}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
              In Transit
            </span>
            <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {stats.active}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
              Upcoming
            </span>
            <div className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {stats.upcoming}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            TRIP CARDS GRID / EMPTY STATE
        ═════════════════════════════════════════ */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 animate-pulse"
              />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="py-16 text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No itineraries registered yet
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Plan your first route to track waypoints, budgets, and emergency protocols.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Itinerary</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════
            MODALS
        ═════════════════════════════════════════ */}
        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Travel Itinerary">
            <TripForm
              onSubmit={handleCreateSubmit}
              countries={countries}
              countriesLoading={countriesLoading}
              submitLabel="Register Itinerary"
            />
          </Modal>
        )}

        {showEditModal && tripToEdit && (
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit Itinerary"
          >
            <TripForm
              initialData={{
                destinations:
                  tripToEdit.destinations?.length > 0
                    ? tripToEdit.destinations
                    : [tripToEdit.destination || ''],
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

        <DeleteTripModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          trip={tripToDelete}
          checklistCount={checklistItemCount}
          deleteOption={deleteOption}
          setDeleteOption={setDeleteOption}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
