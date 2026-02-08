import { useState, useEffect } from 'react'
import { Languages, Volume2, ArrowRightLeft, RefreshCw, Star } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { countryToLanguage, supportedLanguages } from '../utils/countryLanguages'

// Common Phrases (User requested to keep these)
const quickPhrases = [
  { id: 1, text: 'Hello', category: 'Greetings' },
  { id: 2, text: 'Thank you', category: 'Greetings' },
  { id: 3, text: 'Where is the hospital?', category: 'Emergency' },
  { id: 4, text: 'I need help', category: 'Emergency' },
  { id: 5, text: 'How much is this?', category: 'Shopping' },
  { id: 6, text: 'Water please', category: 'Food' },
]

export function TranslatorPage() {
  // --- STATE ---
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('en') // Default English
  const [targetLang, setTargetLang] = useState('es') // Default Spanish (until geo-detected)
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Cache for translations to save API calls (User Request)
  const [cache, setCache] = useState({})

  // --- 1. INITIALIZE (Load User & Location) ---
  useEffect(() => {
    // A. Get User's Native Language
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      // Map user's "Gujarati" string to "gu" code if possible, else default to 'en'
      // Simple lookup for now:
      const native = user.nativeLanguage?.toLowerCase()
      const found = supportedLanguages.find(l => l.name.toLowerCase() === native)
      if (found) setSourceLang(found.code)
    }

    // B. Detect Location for Target Language
    // We try to find the "Dashboard" location from localStorage or just detect anew
    // (Simulating location detection for now as Dashboard saves it usually)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`)
        const data = await res.json()
        const country = data.countryName

        if (country && countryToLanguage[country]) {
          const detectedLang = countryToLanguage[country]
          // Only set if different from source
          if (detectedLang !== sourceLang) {
            setTargetLang(detectedLang)
            setUserLocation(country)
          }
        }
      } catch (e) {
        console.log("Geo-language detection failed", e)
      }
    })

    // C. Load Cache
    const storedCache = localStorage.getItem('translationCache')
    if (storedCache) setCache(JSON.parse(storedCache))

  }, []) // Run once on mount

  // --- 2. TRANSLATE FUNCTION ---
  const handleTranslate = async (textOverride = null) => {
    const textToTranslate = textOverride || inputText
    if (!textToTranslate.trim()) return

    // A. Check Cache First
    const cacheKey = `${sourceLang}-${targetLang}-${textToTranslate.toLowerCase().trim()}`
    if (cache[cacheKey]) {
      console.log("⚡ Serving from Cache")
      setTranslatedText(cache[cacheKey])
      return // Skip API
    }

    // B. Call API
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/translate?text=${encodeURIComponent(textToTranslate)}&from=${sourceLang}&to=${targetLang}`)
      const data = await res.json()

      if (data.translatedText) {
        setTranslatedText(data.translatedText)

        // C. Save to Cache
        const newCache = { ...cache, [cacheKey]: data.translatedText }
        setCache(newCache)
        localStorage.setItem('translationCache', JSON.stringify(newCache))
      }
    } catch (err) {
      console.error(err)
      alert("Translation failed. Check backend.")
    } finally {
      setLoading(false)
    }
  }

  // --- 3. SPEECH SYNTHESIS ---
  const handleSpeak = (text) => {
    if (!text) return
    const utterance = new SpeechSynthesisUtterance(text)
    // Try to match voice to target language (e.g., 'es-ES')
    utterance.lang = targetLang
    window.speechSynthesis.speak(utterance)
  }

  const handleSwap = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setInputText(translatedText)
    setTranslatedText(inputText)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
            <Languages className="h-8 w-8 text-sky-600" />
            AI Translator
          </h1>
          <p className="mt-2 text-slate-600">
            {userLocation ? `Detected location: ${userLocation}. Translating to local language.` : 'Translate text instantly.'}
          </p>
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {/* FROM */}
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500/20 outline-none"
          >
            {supportedLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          {/* SWAP */}
          <button onClick={handleSwap} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <ArrowRightLeft className="h-5 w-5" />
          </button>

          {/* TO */}
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500/20 outline-none bg-sky-50 text-sky-900 border-sky-200"
          >
            {supportedLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {/* TRANSLATION BOXES */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* INPUT */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type here..."
              className="w-full h-48 p-4 text-lg rounded-2xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none shadow-sm transition-all"
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* OUTPUT */}
          <div className="relative bg-slate-50 rounded-2xl border border-slate-200 h-48 p-4 flex flex-col justify-between group">
            {loading ? (
              <div className="flex items-center justify-center h-full text-sky-600 gap-2">
                <RefreshCw className="h-6 w-6 animate-spin" />
                Translating...
              </div>
            ) : (
              <>
                <p className="text-xl font-medium text-slate-800 break-words overflow-y-auto">
                  {translatedText || <span className="text-slate-400 italic">Translation will appear here...</span>}
                </p>

                {translatedText && (
                  <div className="flex justify-end pt-2 border-t border-slate-200/50 mt-2">
                    <button
                      onClick={() => handleSpeak(translatedText)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all shadow-sm"
                    >
                      <Volume2 className="h-4 w-4" />
                      Pronounce
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={() => handleTranslate()}
          disabled={!inputText || loading}
          className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all active:scale-[0.99]"
        >
          Translate Text
        </button>

        {/* QUICK PHRASES (As requested) */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            Quick Phrases
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickPhrases.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => {
                  setInputText(phrase.text)
                  handleTranslate(phrase.text) // Translate immediately
                }}
                className="text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all group"
              >
                <span className="block text-xs font-semibold text-slate-400 group-hover:text-sky-600 mb-1">
                  {phrase.category}
                </span>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">
                  {phrase.text}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}