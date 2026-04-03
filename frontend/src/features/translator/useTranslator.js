import { useState, useEffect, useCallback } from 'react'
import { translateText, getCachedLocation, detectAndCacheLocation } from '../../shared/services'
import { countryToLanguage, supportedLanguages } from '../../shared/utils/countryLanguages'

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

    // Effect 1: Set source language from user profile
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const user = JSON.parse(storedUser)
            const native = (user.native_language || user.nativeLanguage || 'English').toLowerCase()
            const found = supportedLanguages.find(l => l.name.toLowerCase() === native)
            if (found) {
                setSourceLang(found.code)
            }
        }
    }, [])

    // Effect 2: Detect location and set target language
    useEffect(() => {
        let cancelled = false

        const run = async () => {
            try {
                let cachedLocation = getCachedLocation()
                if (!cachedLocation) {
                    cachedLocation = await detectAndCacheLocation()
                }
                if (cachedLocation && cachedLocation.country && countryToLanguage[cachedLocation.country]) {
                    const detectedLang = countryToLanguage[cachedLocation.country]
                    if (supportedLanguages.some(l => l.code === detectedLang)) {
                        if (!cancelled) {
                            setTargetLang(detectedLang)
                            setUserLocation(cachedLocation.country)
                        }
                    }
                }
            } catch (err) {
                if (!cancelled) console.error("Location detection failed:", err)
            }
        }

        run()
        return () => { cancelled = true }
    }, [])

    const refreshLocation = useCallback(async () => {
        try {
            setLoading(true)
            const location = await detectAndCacheLocation(true)
            if (location && location.country && countryToLanguage[location.country]) {
                const detectedLang = countryToLanguage[location.country]
                if (supportedLanguages.some(l => l.code === detectedLang)) {
                    setTargetLang(detectedLang)
                    setUserLocation(location.country)
                }
            }
        } catch (err) {
            console.error("Location refresh failed:", err)
        } finally {
            setLoading(false)
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
        setInputAndTranslate,
        refreshLocation
    }
}
