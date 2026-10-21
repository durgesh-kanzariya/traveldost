const currencyCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Universal fallback USD baseline rates for all primary travel currencies
const BASE_RATES_USD = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.2,
    JPY: 154.5,
    AUD: 1.52,
    CAD: 1.38,
    AED: 3.67,
    CHF: 0.90,
    SGD: 1.35,
    THB: 36.8,
    SGD: 1.35,
    NZD: 1.66,
    CNY: 7.24,
};

function getFallbackRatesFor(base) {
    const usdRateOfBase = BASE_RATES_USD[base] || 1;
    const rates = {};
    for (const [curr, usdRate] of Object.entries(BASE_RATES_USD)) {
        rates[curr] = Number((usdRate / usdRateOfBase).toFixed(6));
    }
    return rates;
}

const getExchangeRates = async (base) => {
    const normalizedBase = (base || 'USD').toUpperCase();
    const now = Date.now();
    const cached = currencyCache.get(normalizedBase);

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    // 1. Try Primary Open API (open.er-api.com - reliable, no TLS ECONNRESET)
    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${normalizedBase}`, {
            signal: AbortSignal.timeout(4000)
        });
        if (response.ok) {
            const data = await response.json();
            if (data.rates && Object.keys(data.rates).length > 0) {
                const result = { base: normalizedBase, rates: data.rates };
                currencyCache.set(normalizedBase, { data: result, timestamp: now });
                return result;
            }
        }
    } catch (err) {
        console.warn(`Primary currency API error for ${normalizedBase}:`, err.message);
    }

    // 2. Try Secondary Frankfurter API
    try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${normalizedBase}`, {
            signal: AbortSignal.timeout(3000)
        });
        if (response.ok) {
            const data = await response.json();
            if (data.rates) {
                const combinedRates = { ...data.rates, [normalizedBase]: 1 };
                const result = { base: normalizedBase, rates: combinedRates };
                currencyCache.set(normalizedBase, { data: result, timestamp: now });
                return result;
            }
        }
    } catch (err) {
        console.warn(`Secondary currency API error for ${normalizedBase}:`, err.message);
    }

    // 3. If cached data exists (even expired), use it
    if (cached) {
        return cached.data;
    }

    // 4. Dynamic cross-rate calculation fallback (guarantees rates are never empty)
    const fallbackRates = getFallbackRatesFor(normalizedBase);
    const fallbackResult = { base: normalizedBase, rates: fallbackRates };
    currencyCache.set(normalizedBase, { data: fallbackResult, timestamp: now });
    return fallbackResult;
};

const convertCurrency = async (amount, from, to) => {
    if (from === to) return amount;

    const ratesData = await getExchangeRates(from);
    const rate = ratesData.rates[to];

    if (!rate) {
        throw new Error(`Exchange rate not found from ${from} to ${to}`);
    }

    return amount * rate;
};

module.exports = {
    getExchangeRates,
    convertCurrency
};
