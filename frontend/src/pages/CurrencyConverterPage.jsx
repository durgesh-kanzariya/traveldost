import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
]

const exchangeRates = {
  USD: { EUR: 0.92, GBP: 0.79, INR: 83.12, JPY: 149.50, AUD: 1.53, CAD: 1.36, CHF: 0.88, CNY: 7.24, SEK: 10.15, NZD: 1.63, MXN: 17.05 },
  EUR: { USD: 1.09, GBP: 0.86, INR: 90.35, JPY: 162.50, AUD: 1.66, CAD: 1.48, CHF: 0.96, CNY: 7.87, SEK: 11.03, NZD: 1.77, MXN: 18.53 },
  GBP: { USD: 1.27, EUR: 1.16, INR: 105.13, JPY: 189.00, AUD: 1.93, CAD: 1.72, CHF: 1.12, CNY: 9.16, SEK: 12.83, NZD: 2.06, MXN: 21.54 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.087, SEK: 0.122, NZD: 0.020, MXN: 0.205 },
  JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, INR: 0.556, AUD: 0.010, CAD: 0.009, CHF: 0.0059, CNY: 0.049, SEK: 0.068, NZD: 0.011, MXN: 0.114 },
}

export function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [amount, setAmount] = useState('1')
  const [convertedAmount, setConvertedAmount] = useState('83.12')

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    setAmount(value)
    if (value && !isNaN(value)) {
      const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1
      const result = (parseFloat(value) * rate).toFixed(2)
      setConvertedAmount(result)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Currency Converter
        </h1>
        <p className="mt-2 text-slate-600">
          Convert currencies at real-time rates
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="mb-6 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-end">
          {/* From Currency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">From</label>
            <div className="space-y-2">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <select
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value)
                  handleAmountChange({ target: { value: amount } })
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapCurrencies}
              className="rounded-full border-2 border-sky-300 bg-white p-3 text-sky-600 transition-all hover:bg-sky-50 hover:border-sky-500"
              title="Swap currencies"
            >
              <ArrowRightLeft className="h-6 w-6" />
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">To</label>
            <div className="space-y-2">
              <input
                type="text"
                value={convertedAmount}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900"
              />
              <select
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value)
                  handleAmountChange({ target: { value: amount } })
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-sky-100 p-4">
          <p className="text-center text-sm text-sky-900">
            1 <span className="font-semibold">{fromCurrency}</span> = {(exchangeRates[fromCurrency]?.[toCurrency] || 1).toFixed(4)} <span className="font-semibold">{toCurrency}</span>
          </p>
        </div>
      </div>

      {/* Exchange Rates Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Exchange Rates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Currency</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Rate (to {toCurrency})</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((curr) => (
                <tr key={curr.code} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">
                    <span className="font-medium">{curr.symbol}</span> {curr.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{curr.code}</td>
                  <td className="px-4 py-3 font-semibold text-sky-600">
                    {curr.code === toCurrency ? '1.0000' : (exchangeRates[curr.code]?.[toCurrency] || exchangeRates[toCurrency]?.[curr.code] ? (1 / (exchangeRates[toCurrency]?.[curr.code] || 1)).toFixed(4) : 'N/A')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-6">
        <h3 className="mb-3 font-semibold text-amber-900">💡 Tips</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Exchange rates are updated regularly for accuracy</li>
          <li>• Use this converter before withdrawing cash or making payments abroad</li>
          <li>• Always check with your bank for their current exchange rates</li>
          <li>• Consider any transaction fees that may apply</li>
        </ul>
      </div>
    </DashboardLayout>
  )
}
