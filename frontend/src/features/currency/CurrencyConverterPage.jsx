import { ArrowRightLeft, RefreshCw, TrendingUp } from 'lucide-react'
import { DashboardLayout, Breadcrumbs } from '../../components/layout'
import { useCurrency } from '../../shared/hooks'

export function CurrencyConverterPage() {
  const {
    amount, setAmount,
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    exchangeRate,
    loading,
    lastUpdated,
    currencies,
    fetchRates,
    handleSwap,
    convertedAmount
  } = useCurrency()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Currency Converter
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Real-time exchange rates for international travel.
          </p>
        </div>

        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg sm:p-8 transition-colors">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 p-4 text-2xl font-bold text-slate-900 dark:text-white dark:bg-slate-800 focus:border-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-3 font-medium outline-none focus:border-sky-500 transition-colors">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
              <button onClick={handleSwap} className="mt-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-600 hover:text-sky-600 transition-colors">
                <ArrowRightLeft className="h-5 w-5" />
              </button>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-3 font-medium outline-none focus:border-sky-500 transition-colors">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
            {loading ? (
              <div className="flex justify-center py-2">
                <RefreshCw className="h-6 w-6 animate-spin text-sky-600" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-500">{amount} {fromCurrency} =</p>
                <p className="mt-1 text-4xl font-bold text-sky-600 dark:text-sky-400">{convertedAmount} <span className="text-2xl text-sky-500">{toCurrency}</span></p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
                  <span>• Updated: {lastUpdated}</span>
                </div>
              </>
            )}
          </div>

          <button onClick={fetchRates} className="mt-6 w-full rounded-xl bg-sky-600 hover:bg-sky-700 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-[1.01]">
            Refresh Rates
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}