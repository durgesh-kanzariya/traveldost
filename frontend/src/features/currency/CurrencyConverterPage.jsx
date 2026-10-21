import { ArrowRightLeft, RefreshCw, TrendingUp, DollarSign } from 'lucide-react'
import { DashboardLayout } from '../../components/layout'
import { useCurrency } from '../../shared/hooks'

export function CurrencyConverterPage() {
  const {
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
    convertedAmount,
  } = useCurrency()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ════════════════════════════════════════
            HEADER & TITLE
        ═════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Foreign Exchange Engine
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Real-time multi-currency conversion, spot parity, and travel cash forecasting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchRates}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'INDEXING...' : 'SYNC RATES'}</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            MAIN CONVERSION TERMINAL (Bento Grid)
        ═════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Conversion Controls (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Transaction Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 text-xl font-mono font-bold rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-zinc-400">
                  {fromCurrency}
                </span>
              </div>
            </div>

            {/* Currency Swap Controls */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Base Currency
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                title="Swap base and target currencies"
                aria-label="Swap currencies"
                className="p-2 mb-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Target Currency
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Result Output HUD (5 cols) */}
          <div className="lg:col-span-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Converted Output
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                  Spot Verified
                </span>
              </div>

              <div className="py-5">
                {loading ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 py-3">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating foreign exchange...</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-mono text-zinc-400">
                      {amount} {fromCurrency} =
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white">
                        {convertedAmount}
                      </span>
                      <span className="text-lg font-mono text-zinc-400 font-semibold">
                        {toCurrency}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 space-y-1.5 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Parity Rate:</span>
                <span className="text-zinc-200">
                  1 {fromCurrency} = {exchangeRate || '—'} {toCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Last Synced:</span>
                <span className="text-zinc-400">{lastUpdated || 'Current Session'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            GLOBAL REFERENCE TICKER CARDS
        ═════════════════════════════════════════ */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Common Travel Currency Pairs
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { pair: 'USD / EUR', desc: 'United States & Eurozone', from: 'USD', to: 'EUR' },
              { pair: 'USD / INR', desc: 'United States & India', from: 'USD', to: 'INR' },
              { pair: 'EUR / GBP', desc: 'Eurozone & United Kingdom', from: 'EUR', to: 'GBP' },
              { pair: 'USD / JPY', desc: 'United States & Japan', from: 'USD', to: 'JPY' },
            ].map((p) => (
              <button
                key={p.pair}
                type="button"
                onClick={() => {
                  setFromCurrency(p.from)
                  setToCurrency(p.to)
                }}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white">
                    {p.pair}
                  </span>
                  <DollarSign className="w-3 h-3 text-zinc-400" />
                </div>
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 truncate">
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}