import { AlertTriangle, ListChecks } from 'lucide-react'
import { Modal } from '../ui'

export function DeleteTripModal({ isOpen, onClose, trip, checklistCount, deleteOption, setDeleteOption, onConfirm }) {
    if (!trip) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${trip.destination || 'Trip'}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm text-slate-500">This action cannot be undone.</p>
            </div>

            {checklistCount > 0 && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <ListChecks className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            This trip has {checklistCount} checklist item{checklistCount > 1 ? 's' : ''}
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
                    onClick={onClose}
                    className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                    Delete
                </button>
            </div>
        </Modal>
    )
}
