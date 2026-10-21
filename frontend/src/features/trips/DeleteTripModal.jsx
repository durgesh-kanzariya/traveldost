import { Modal } from '../../components/ui'
import { AlertTriangle, ListChecks } from 'lucide-react'

export function DeleteTripModal({
  isOpen,
  onClose,
  trip,
  checklistCount,
  deleteOption,
  setDeleteOption,
  onConfirm,
}) {
  if (!trip) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${trip.destination || 'Trip'}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-md bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <p className="text-xs text-rose-700 dark:text-rose-300">
            This will permanently remove this itinerary from your active itineraries.
          </p>
        </div>

        {checklistCount > 0 && (
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md">
            <div className="flex items-center gap-2 mb-2.5">
              <ListChecks className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Associated Checklist ({checklistCount} {checklistCount === 1 ? 'item' : 'items'})
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <label className="flex items-center gap-2.5 p-2 rounded border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deleteOption"
                  value="move_to_general"
                  checked={deleteOption === 'move_to_general'}
                  onChange={(e) => setDeleteOption(e.target.value)}
                  className="accent-zinc-900 dark:accent-zinc-100"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Move items to General Checklist
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deleteOption"
                  value="delete_items"
                  checked={deleteOption === 'delete_items'}
                  onChange={(e) => setDeleteOption(e.target.value)}
                  className="accent-zinc-900 dark:accent-zinc-100"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Delete associated checklist items
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-3 text-xs font-medium rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}
