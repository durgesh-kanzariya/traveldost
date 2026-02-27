import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
        {title && (
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}
