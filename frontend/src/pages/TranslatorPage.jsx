import { useState } from 'react' // Removed useEffect (not needed anymore!)
import { Languages, User } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'

const phrases = [
  { id: 1, english: 'Hello', local: 'Namaste', category: 'Greetings' },
  { id: 2, english: 'Thank you', local: 'Dhanyavaad', category: 'Greetings' },
  { id: 3, english: 'Sorry', local: 'Maafi kijiye', category: 'Greetings' },
  { id: 4, english: 'Water', local: 'Pani', category: 'Food & Drink' },
  { id: 5, english: 'Help', local: 'Madad karo', category: 'Emergency' },
  { id: 6, english: 'Hospital', local: 'Aspatal', category: 'Emergency' },
]

export function TranslatorPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // 1. PRO MOVE: Initialize state directly from LocalStorage
  // This runs only ONCE when the page loads, preventing the double-render error.
  const [userData] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  // 2. Set defaults based on the loaded data
  const userName = userData?.name || 'Traveler'
  const userLanguage = userData?.nativeLanguage || 'English'

  const filteredPhrases = phrases.filter(phrase =>
    phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.local.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Language Translator
        </h1>
        <div className="mt-2 flex items-center gap-2 text-slate-600">
           {/* Personalized Banner */}
           <User className="h-4 w-4 text-sky-600" />
           <p>
             Welcome, <span className="font-semibold text-sky-700">{userName}</span>! 
             Translating from <span className="font-bold text-sky-700">{userLanguage}</span> to Gujarati.
           </p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder={`Search ${userLanguage} phrases...`} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhrases.map((phrase) => (
          <div key={phrase.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              {phrase.category}
            </span>
            <div className="space-y-2">
              <div>
                {/* Dynamic Header */}
                <p className="text-xs font-medium text-slate-500">{userLanguage}</p>
                <p className="text-lg font-semibold text-slate-900">{phrase.english}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Local (Gujarati)</p>
                <p className="text-lg font-semibold text-sky-600">{phrase.local}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(phrase.local);
                window.speechSynthesis.speak(utterance);
              }}
              className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              🔊 Pronounce
            </button>
          </div>
        ))}
      </div>
      
      {filteredPhrases.length === 0 && (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <Languages className="mb-3 h-12 w-12 text-slate-400" />
          <p className="text-slate-600">No phrases found matching your search</p>
        </div>
      )}
    </DashboardLayout>
  )
}