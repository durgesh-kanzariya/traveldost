import { useState } from 'react'
import { useTranslator } from './useTranslator'
import { supportedLanguages } from '../../shared/utils/countryLanguages'
import { quickPhrases } from '../../shared/data/quickPhrases'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import {
  Languages,
  RefreshCw,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  X,
  Compass,
} from 'lucide-react'

export function TranslatorPage() {
  const {
    inputText,
    setInputText,
    translatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    loading,
    userLocation,
    handleTranslate,
    handleSpeak,
    handleSwap,
    setInputAndTranslate,
    refreshLocation,
  } = useTranslator()

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!translatedText) return
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════
            HEADER & ACTIONS
        ═════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Language Translation
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {userLocation
                ? `Detected region: ${userLocation}. Dynamic translation tuned to destination language.`
                : 'Direct multilingual translation and situational traveler phrasebook.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshLocation}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'CALIBRATING...' : 'SYNC REGION'}</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            LANGUAGE SELECTOR TOOLBAR
        ═════════════════════════════════════════ */}
        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
              Source Dialect
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap source and target dialects"
            aria-label="Swap languages"
            className="mt-4 p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
              Target Dialect
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ════════════════════════════════════════
            TRANSLATION EDITORS (Split Columns)
        ═════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Source Input */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between relative focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste phrase to translate..."
                rows={6}
                className="w-full text-sm font-sans bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  aria-label="Clear source text"
                  className="absolute top-0 right-0 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>{inputText.length} characters</span>
              <button
                type="button"
                onClick={() => handleTranslate()}
                disabled={!inputText.trim() || loading}
                className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>

          {/* Translated Output */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 flex flex-col justify-between">
            <div className="overflow-y-auto min-h-[120px] max-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-28 text-xs font-mono text-zinc-500 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>Synthesizing translation...</span>
                </div>
              ) : translatedText ? (
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed font-sans">
                  {translatedText}
                </p>
              ) : (
                <p className="text-xs font-mono text-zinc-400 italic">
                  Translation output will appear here...
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {targetLang} Output
              </span>

              {translatedText && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeak(translatedText)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Pronounce</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            QUICK SITUATIONAL PHRASEBOOK
        ═════════════════════════════════════════ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-zinc-500" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Situational Phrasebook
              </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Tap to auto-translate
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {quickPhrases.map((phrase) => (
              <button
                key={phrase.id}
                type="button"
                onClick={() => setInputAndTranslate(phrase.text, phrase.translations?.[targetLang])}
                className="text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-pointer flex flex-col justify-between"
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  {phrase.category}
                </span>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white leading-snug">
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