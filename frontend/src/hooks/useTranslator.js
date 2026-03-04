import { useState, useEffect, useCallback } from 'react'
import { translateText, getCachedLocation } from '../services'
import { countryToLanguage, supportedLanguages } from '../utils/countryLanguages'

export function useTranslator() {
    const [inputText, setInputText] = useState('')
    const [translatedText, setTranslatedText] = useState('')
    const [sourceLang, setSourceLang] = useState('en')
    const [targetLang, setTargetLang] = useState('es')
    const [loading, setLoading] = useState(false)
    const [userLocation, setUserLocation] = useState(null)
    const [cache, setCache] = useState(() => {
        const stored = localStorage.getItem('translationCache')
        return stored ? JSON.parse(stored) : {}
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const user = JSON.parse(storedUser)
            const native = user.nativeLanguage?.toLowerCase()
            const found = supportedLanguages.find(l => l.name.toLowerCase() === native)
            if (found) setSourceLang(found.code)
        }

        const cachedLocation = getCachedLocation()
        if (cachedLocation && cachedLocation.country && countryToLanguage[cachedLocation.country]) {
            const detectedLang = countryToLanguage[cachedLocation.country]
            if (detectedLang !== sourceLang) {
                setTargetLang(detectedLang)
                setUserLocation(cachedLocation.country)
            }
        }
    }, [])

    const handleTranslate = useCallback(async (textOverride = null) => {
        const textToTranslate = textOverride || inputText
        if (!textToTranslate.trim()) return

        const cacheKey = `${sourceLang}-${targetLang}-${textToTranslate.toLowerCase().trim()}`
        if (cache[cacheKey]) {
            setTranslatedText(cache[cacheKey])
            return
        }

        setLoading(true)
        try {
            const data = await translateText(textToTranslate, sourceLang, targetLang);
            if (data.translatedText) {
                setTranslatedText(data.translatedText)
                const newCache = { ...cache, [cacheKey]: data.translatedText }
                setCache(newCache)
                localStorage.setItem('translationCache', JSON.stringify(newCache))
            }
        } catch (err) {
            console.error('Translation error:', err)
            setTranslatedText('[Translation unavailable]')
        } finally {
            setLoading(false)
        }
    }, [inputText, sourceLang, targetLang, cache])

    const handleSpeak = (text) => {
        if (!text) return
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = targetLang
        window.speechSynthesis.speak(utterance)
    }

    const handleSwap = () => {
        setSourceLang(targetLang)
        setTargetLang(sourceLang)
        setInputText(translatedText)
        setTranslatedText(inputText)
    }

    const setInputAndTranslate = (text, translated = null) => {
        setInputText(text)
        if (translated) {
            setTranslatedText(translated)
            const cacheKey = `${sourceLang}-${targetLang}-${text.toLowerCase().trim()}`
            const newCache = { ...cache, [cacheKey]: translated }
            setCache(newCache)
            localStorage.setItem('translationCache', JSON.stringify(newCache))
        } else {
            handleTranslate(text)
        }
    }

    return {
        inputText,
        setInputText,
        translatedText,
        setTranslatedText,
        sourceLang,
        setSourceLang,
        targetLang,
        setTargetLang,
        loading,
        userLocation,
        handleTranslate,
        handleSpeak,
        handleSwap,
        setInputAndTranslate
    }
}
