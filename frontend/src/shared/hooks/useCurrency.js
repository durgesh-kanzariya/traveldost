import { useState, useEffect, useCallback } from 'react'
import { api } from '../services'

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
]

export function useCurrency() {
    const [amount, setAmount] = useState(1)
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('INR')
    const [exchangeRate, setExchangeRate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchRates = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get(`/currency/rates/${fromCurrency}`)
            const data = res.data
            const rate = data.rates[toCurrency]
            setExchangeRate(rate)
            setLastUpdated(new Date().toLocaleTimeString())
        } catch (error) {
            console.error("Failed to fetch rates:", error)
        } finally {
            setLoading(false)
        }
    }, [fromCurrency, toCurrency])

    useEffect(() => {
        let cancelled = false

        async function loadRates() {
            setLoading(true)
            try {
                const res = await api.get(`/currency/rates/${fromCurrency}`)
                const data = res.data
                const rate = data.rates[toCurrency]
                if (!cancelled) {
                    setExchangeRate(rate)
                    setLastUpdated(new Date().toLocaleTimeString())
                }
            } catch (error) {
                if (!cancelled) console.error("Failed to fetch rates:", error)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadRates()

        return () => { cancelled = true }
    }, [fromCurrency, toCurrency])

    const handleSwap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
    }

    const convertedAmount = exchangeRate ? (amount * exchangeRate).toFixed(2) : '...'

    return {
        amount,
        setAmount,
        fromCurrency,
        setFromCurrency,
        toCurrency,
        setToCurrency,
        exchangeRate,
        loading,
        lastUpdated,
        currencies: CURRENCIES,
        fetchRates,
        handleSwap,
        convertedAmount
    }
}
