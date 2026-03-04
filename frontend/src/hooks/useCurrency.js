import { useState, useEffect, useCallback } from 'react'
import { api } from '../services'

export function useCurrency() {
    const [amount, setAmount] = useState(1)
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('INR')
    const [exchangeRate, setExchangeRate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)

    const currencies = [
        { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
        { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
        { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
        { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
        { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
        { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    ]

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
        fetchRates()
    }, [fetchRates])

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
        currencies,
        fetchRates,
        handleSwap,
        convertedAmount
    }
}
