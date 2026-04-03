import axios from 'axios';

const LOCATION_CACHE_KEY = 'traveldost_user_location';
const LOCATION_CACHE_DURATION = 24 * 60 * 60 * 1000;

export const getCachedLocation = () => {
    try {
        const cached = localStorage.getItem(LOCATION_CACHE_KEY);
        if (!cached) return null;

        const { location, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age < LOCATION_CACHE_DURATION) {
            return location;
        }
    } catch (err) {
        console.error('Error reading location cache:', err);
    }
    return null;
};

export const setCachedLocation = (location) => {
    try {
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
            location,
            timestamp: Date.now()
        }));
    } catch (err) {
        console.error('Error saving location cache:', err);
    }
};

export const detectAndCacheLocation = async (forceRefresh = false) => {
    if (!forceRefresh) {
        const cached = getCachedLocation();
        if (cached) {
            return cached;
        }
    }

    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await axios.get(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = response.data;

                    const location = {
                        lat: latitude,
                        lng: longitude,
                        country: data.countryName || 'India',
                        city: data.city || data.locality || ''
                    };

                    setCachedLocation(location);
                    resolve(location);
                } catch (err) {
                    reject(err);
                }
            },
            (err) => {
                reject(err);
            }
        );
    });
};
