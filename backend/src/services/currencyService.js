const currencyCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getExchangeRates = async (base) => {
    const now = Date.now();
    const cached = currencyCache.get(base);

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        currencyCache.set(base, { data, timestamp: now });

        return data;
    } catch (error) {
        console.error(`Error fetching rates for ${base}:`, error.message);
        // If we have any cached data at all, even expired, fallback to it on error
        if (cached) return cached.data;
        throw error;
    }
};

const convertCurrency = async (amount, from, to) => {
    if (from === to) return amount;

    const rates = await getExchangeRates(from);
    const rate = rates.rates[to];

    if (!rate) {
        throw new Error(`Exchange rate not found from ${from} to ${to}`);
    }

    return amount * rate;
};

module.exports = {
    getExchangeRates,
    convertCurrency
};
