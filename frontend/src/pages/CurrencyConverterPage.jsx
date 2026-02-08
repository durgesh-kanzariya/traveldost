import { useState, useEffect } from 'react'
import { ArrowRightLeft, RefreshCw, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function CurrencyConverterPage() {
  // 1. STATE MANAGEMENT
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // 2. LIST OF POPULAR CURRENCIES
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

  // 3. FETCH LIVE RATES
  const fetchRates = async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      const data = await res.json()

      const rate = data.rates[toCurrency]
      setExchangeRate(rate)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Failed to fetch rates:", error)
      alert("Could not fetch live rates. Check internet connection.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch when currencies change
  useEffect(() => {
    fetchRates()
  }, [fromCurrency, toCurrency])

  // 4. HANDLERS
  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Calculate Result
  const convertedAmount = exchangeRate ? (amount * exchangeRate).toFixed(2) : '...'

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Currency Converter
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Real-time exchange rates for international travel.
        </p>
      </div>

      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg dark:shadow-slate-900/50 sm:p-8 transition-colors">

        {/* INPUT SECTION */}
        <div className="space-y-6">

          {/* Amount Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 p-4 text-2xl font-bold text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">

            {/* FROM Select */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 p-3 font-medium text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* SWAP Button */}
            <button
              onClick={handleSwap}
              className="mt-6 rounded-full bg-slate-100 dark:bg-slate-800 p-3 text-slate-600 dark:text-slate-400 transition-colors hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>

            {/* TO Select */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 p-3 font-medium text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 focus:outline-none"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RESULT SECTION */}
        <div className="mt-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
          {loading ? (
            <div className="flex justify-center py-2">
              <RefreshCw className="h-6 w-6 animate-spin text-sky-600 dark:text-sky-400" />
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {amount} {fromCurrency} =
              </p>
              <p className="mt-1 text-4xl font-bold text-sky-600 dark:text-sky-400">
                {convertedAmount} <span className="text-2xl text-sky-500 dark:text-sky-500/80">{toCurrency}</span>
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <TrendingUp className="h-3 w-3" />
                <span>1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
                <span>• Updated: {lastUpdated}</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={fetchRates}
          className="mt-6 w-full rounded-xl bg-sky-600 dark:bg-sky-600 hover:bg-sky-700 dark:hover:bg-sky-500 py-3.5 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Refresh Rates
        </button>

      </div>
    </DashboardLayout>
  )
}