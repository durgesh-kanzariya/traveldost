
import { useTranslator } from './useTranslator'
import { supportedLanguages } from '../../shared/utils/countryLanguages'
import { quickPhrases } from '../../shared/data/quickPhrases'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'
import { Languages, RefreshCw, ArrowRightLeft, Volume2, Star } from 'lucide-react'

export function TranslatorPage() {
  const {
    inputText, setInputText,
    translatedText,
    sourceLang, setSourceLang,
    targetLang, setTargetLang,
    loading,
    userLocation,
    handleTranslate,
    handleSpeak,
    handleSwap,
    setInputAndTranslate,
    refreshLocation
  } = useTranslator()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Breadcrumbs />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl flex items-center gap-3 mt-2">
              <Languages className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              AI Translator
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {userLocation ? `Detected location: ${userLocation}. Translating to local language.` : 'Translate text instantly.'}
            </p>
          </div>
          <button
            onClick={refreshLocation}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Location
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-sky-500 transition-colors">
              {supportedLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <button onClick={handleSwap} className="p-2 rounded-full hover:bg-white/50 transition-colors">
              <ArrowRightLeft className="h-5 w-5 text-slate-500" />
            </button>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300 outline-none focus:border-sky-500 transition-colors">
              {supportedLanguages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type here..."
                className="w-full h-48 p-4 text-lg rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 outline-none resize-none dark:text-white focus:border-sky-400 transition-colors"
              />
              {inputText && (
                <button onClick={() => setInputText('')} className="absolute top-4 right-4 text-slate-400">✕</button>
              )}
            </div>

            <div className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-48 p-4 flex flex-col justify-between">
              {loading ? (
                <div className="flex items-center justify-center h-full text-sky-600 gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  Translating...
                </div>
              ) : (
                <>
                  <p className="text-xl font-medium text-slate-800 dark:text-slate-100 overflow-y-auto">
                    {translatedText || <span className="text-slate-400 italic">Translation will appear here...</span>}
                  </p>
                  {translatedText && (
                    <div className="flex justify-end pt-2 border-t border-slate-200/50 mt-2">
                      <button onClick={() => handleSpeak(translatedText)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-700/50 text-sm font-medium hover:text-sky-700 transition-all shadow-sm">
                        <Volume2 className="h-4 w-4" />
                        Pronounce
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => handleTranslate()}
            disabled={!inputText || loading}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
          >
            Translate Text
          </button>

          <div className="mt-8 pt-8 border-t border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              Quick Phrases
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickPhrases.map((phrase) => (
                <button
                  key={phrase.id}
                  onClick={() => setInputAndTranslate(phrase.text, phrase.translations?.[targetLang])}
                  className="text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/40 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-200 dark:hover:border-sky-800 transition-all group shadow-sm"
                >
                  <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-sky-600 mb-1">{phrase.category}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{phrase.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}