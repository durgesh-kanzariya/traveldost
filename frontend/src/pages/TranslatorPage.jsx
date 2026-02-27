import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { translateText } from '../services/translationService';
import { getCachedLocation } from '../utils/locationService';
import { Languages, Volume2, ArrowRightLeft, RefreshCw, Star } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { countryToLanguage, supportedLanguages } from '../utils/countryLanguages'

// Pre-defined accurate translations for common travel phrases
const quickPhrases = [
  { id: 1, text: 'Hello', category: 'Greetings', translations: { es: 'Hola', fr: 'Bonjour', de: 'Hallo', ja: 'こんにちは', zh: '你好', ar: 'مرحبا', hi: 'नमस्ते', ru: 'Привет', pt: 'Olá', th: 'สวัสดี' } },
  { id: 2, text: 'Thank you', category: 'Greetings', translations: { es: 'Gracias', fr: 'Merci', de: 'Danke', ja: 'ありがとう', zh: '谢谢', ar: 'شكرا', hi: 'धन्यवाद', ru: 'Спасибо', pt: 'Obrigado', th: 'ขอบคุณ' } },
  { id: 3, text: 'Where is the hospital?', category: 'Emergency', translations: { es: '¿Dónde está el hospital?', fr: 'Où est l\'hôpital?', de: 'Wo ist das Krankenhaus?', ja: '病院はどこですか？', zh: '医院在哪里？', ar: 'أين المستشفى؟', hi: 'अस्पताल कहाँ है?', ru: 'Где больница?', pt: 'Onde fica o hospital?', th: 'โรงพยาบาลอยู่ที่ไหน?' } },
  { id: 4, text: 'I need help', category: 'Emergency', translations: { es: 'Necesito ayuda', fr: 'J\'ai besoin d\'aide', de: 'Ich brauche Hilfe', ja: '助けて', zh: '我需要帮助', ar: 'أحتاج للمساعدة', hi: 'मुझे मदद चाहिए', ru: 'Мне нужна помощь', pt: 'Preciso de ajuda', th: 'ฉันต้องการความช่วยเหลือ' } },
  { id: 5, text: 'How much is this?', category: 'Shopping', translations: { es: '¿Cuánto cuesta esto?', fr: 'Combien ça coûte?', de: 'Wie viel kostet das?', ja: 'これはいくらですか？', zh: '这个多少钱？', ar: 'كم سعر هذا؟', hi: 'यह कितने का है?', ru: 'Сколько это стоит?', pt: 'Quanto custa isso?', th: 'นี่ราคาเท่าไหร่?' } },
  { id: 6, text: 'Water please', category: 'Food', translations: { es: 'Agua por favor', fr: 'De l\'eau s\'il vous plaît', de: 'Wasser bitte', ja: '水をください', zh: '请给我水', ar: 'ماء من فضلك', hi: 'पानी दीजिए', ru: 'Вода пожалуйста', pt: 'Água por favor', th: 'น้ำหน่อยครับ' } },
  { id: 7, text: 'Goodbye', category: 'Greetings', translations: { es: 'Adiós', fr: 'Au revoir', de: 'Auf Wiedersehen', ja: 'さようなら', zh: '再见', ar: 'مع السلامة', hi: 'अलविदा', ru: 'До свидания', pt: 'Adeus', th: 'ลาก่อน' } },
  { id: 8, text: 'Please', category: 'Greetings', translations: { es: 'Por favor', fr: 'S\'il vous plaît', de: 'Bitte', ja: 'お願いします', zh: '请', ar: 'من فضلك', hi: 'कृपया', ru: 'Пожалуйста', pt: 'Por favor', th: 'กรุณา' } },
  { id: 9, text: 'Yes', category: 'Greetings', translations: { es: 'Sí', fr: 'Oui', de: 'Ja', ja: 'はい', zh: '是', ar: 'نعم', hi: 'हाँ', ru: 'Да', pt: 'Sim', th: 'ใช่' } },
  { id: 10, text: 'No', category: 'Greetings', translations: { es: 'No', fr: 'Non', de: 'Nein', ja: 'いいえ', zh: '不', ar: 'لا', hi: 'नहीं', ru: 'Нет', pt: 'Não', th: 'ไม่' } },
  { id: 11, text: 'I don\'t understand', category: 'Emergency', translations: { es: 'No entiendo', fr: 'Je ne comprends pas', de: 'Ich verstehe nicht', ja: 'わかりません', zh: '我不明白', ar: 'لا أفهم', hi: 'मुझे समझ नहीं आया', ru: 'Я не понимаю', pt: 'Não entendo', th: 'ฉันไม่เข้าใจ' } },
  { id: 12, text: 'Call the police', category: 'Emergency', translations: { es: 'Llame a la policía', fr: 'Appelez la police', de: 'Rufen Sie die Polizei', ja: '警察を呼んでください', zh: '请报警', ar: 'اتصل بالشرطة', hi: 'पुलिस को बुलाओ', ru: 'Вызовите полицию', pt: 'Chame a polícia', th: 'เรียกตำรวจ' } },
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
      const native = user.nativeLanguage?.toLowerCase()
      const found = supportedLanguages.find(l => l.name.toLowerCase() === native)
      if (found) setSourceLang(found.code)
    }

    // B. Detect Location for Target Language (using cached location)
    const cachedLocation = getCachedLocation()
    if (cachedLocation && cachedLocation.country && countryToLanguage[cachedLocation.country]) {
      const detectedLang = countryToLanguage[cachedLocation.country]
      if (detectedLang !== sourceLang) {
        setTargetLang(detectedLang)
        setUserLocation(cachedLocation.country)
      }
    }

    // C. Load Translation Cache
    const storedCache = localStorage.getItem('translationCache')
    if (storedCache) setCache(JSON.parse(storedCache))

  }, []) // Run once on mount

  // --- 2. TRANSLATE FUNCTION ---
  // Steps:
  // 1. Check if we already have this translation in Cache (LocalStorage)
  // 2. If not, call our Backend API (/api/translate)
  // 3. Save result to Cache for next time
  const handleTranslate = async (textOverride = null) => {
    const textToTranslate = textOverride || inputText
    if (!textToTranslate.trim()) return

    // A. Check Cache First (Instant Result)
    const cacheKey = `${sourceLang}-${targetLang}-${textToTranslate.toLowerCase().trim()}`
    if (cache[cacheKey]) {
      console.log("⚡ Serving from Cache")
      setTranslatedText(cache[cacheKey])
      return // Skip API call
    }

    // B. Call API (Server handles the translation via MyMemory)
    setLoading(true)
    try {

      const data = await translateText(textToTranslate, sourceLang, targetLang);

      if (data.translatedText) {
        setTranslatedText(data.translatedText)

        // C. Save to Cache
        const newCache = { ...cache, [cacheKey]: data.translatedText }
        setCache(newCache)
        localStorage.setItem('translationCache', JSON.stringify(newCache))
      }
    } catch (err) {
      console.error('Translation error:', err.message)
      setTranslatedText('[Translation unavailable. Please try again.]')
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
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl flex items-center gap-3 mt-2">
          <Languages className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          AI Translator
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {userLocation ? `Detected location: ${userLocation}. Translating to local language.` : 'Translate text instantly.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* CONTROLS */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-slate-800/50 shadow-sm">
          {/* FROM */}
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-medium focus:ring-2 focus:ring-sky-500/20 outline-none bg-white/50 dark:bg-slate-800 dark:text-white"
          >
            {supportedLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          {/* SWAP */}
          <button onClick={handleSwap} className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowRightLeft className="h-5 w-5" />
          </button>

          {/* TO */}
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-medium focus:ring-2 focus:ring-sky-500/20 outline-none bg-white/50 dark:bg-slate-800 dark:text-sky-300"
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
              className="w-full h-48 p-4 text-lg rounded-2xl border border-white/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none shadow-sm transition-all dark:text-white dark:placeholder-slate-500"
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* OUTPUT */}
          <div className="relative bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-slate-700/50 h-48 p-4 flex flex-col justify-between group shadow-inner">
            {loading ? (
              <div className="flex items-center justify-center h-full text-sky-600 dark:text-sky-400 gap-2">
                <RefreshCw className="h-6 w-6 animate-spin" />
                Translating...
              </div>
            ) : (
              <>
                <p className="text-xl font-medium text-slate-800 dark:text-slate-100 break-words overflow-y-auto">
                  {translatedText || <span className="text-slate-400 dark:text-slate-500 italic">Translation will appear here...</span>}
                </p>

                {translatedText && (
                  <div className="flex justify-end pt-2 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
                    <button
                      onClick={() => handleSpeak(translatedText)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-600 hover:text-sky-700 dark:hover:text-sky-300 hover:border-sky-200 dark:hover:border-sky-500/50 transition-all shadow-sm"
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
          className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-all active:scale-[0.99]"
        >
          Translate Text
        </button>

        {/* QUICK PHRASES (As requested) */}
        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            Quick Phrases
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickPhrases.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => {
                  setInputText(phrase.text)
                  // Use pre-defined translation if available, otherwise call API
                  if (phrase.translations && phrase.translations[targetLang]) {
                    const translated = phrase.translations[targetLang]
                    setTranslatedText(translated)
                    // Also save to cache
                    const cacheKey = `${sourceLang}-${targetLang}-${phrase.text.toLowerCase().trim()}`
                    const newCache = { ...cache, [cacheKey]: translated }
                    setCache(newCache)
                    localStorage.setItem('translationCache', JSON.stringify(newCache))
                  } else {
                    handleTranslate(phrase.text) // Fall back to API
                  }
                }}
                className="text-left px-4 py-3 rounded-xl border border-white/60 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 hover:bg-sky-50/80 dark:hover:bg-slate-800 hover:border-sky-200 dark:hover:border-sky-900 backdrop-blur-sm transition-all group shadow-sm"
              >
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 mb-1">
                  {phrase.category}
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
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