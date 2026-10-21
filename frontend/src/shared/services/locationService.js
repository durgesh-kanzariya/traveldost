import axios from 'axios';

const LOCATION_CACHE_KEY = 'traveldost_user_location';
const LOCATION_CACHE_DURATION = 24 * 60 * 60 * 1000;

export const getCachedLocation = () => {
    try {
        const cached = sessionStorage.getItem(LOCATION_CACHE_KEY);
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
        sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
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

    // Fast fallback using BigDataCloud's IP geolocation when GPS is denied, timed out, or unprompted
    const fetchIpLocation = async () => {
        try {
            const response = await axios.get(
                'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en',
                { timeout: 5000 }
            );
            const data = response.data;
            const location = {
                lat: data.latitude || 28.6139,
                lng: data.longitude || 77.2090,
                country: data.countryName || 'India',
                city: data.city || data.locality || ''
            };
            setCachedLocation(location);
            return location;
        } catch {
            const defaultLocation = {
                lat: 28.6139,
                lng: 77.2090,
                country: 'India',
                city: 'New Delhi'
            };
            return defaultLocation;
        }
    };

    return new Promise((resolve) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            fetchIpLocation().then(resolve);
            return;
        }

        let settled = false;
        const handleFailure = async () => {
            if (settled) return;
            settled = true;
            const loc = await fetchIpLocation();
            resolve(loc);
        };

        // Safety timer: resolve with IP location if browser permission prompt hangs or is ignored
        const safetyTimer = setTimeout(() => {
            handleFailure();
        }, 4500);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                if (settled) return;
                clearTimeout(safetyTimer);
                settled = true;
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await axios.get(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
                        { timeout: 5000 }
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
                } catch {
                    const fallbackLoc = await fetchIpLocation();
                    resolve(fallbackLoc);
                }
            },
            () => {
                clearTimeout(safetyTimer);
                handleFailure();
            },
            {
                enableHighAccuracy: false,
                timeout: 4000,
                maximumAge: 5 * 60 * 1000
            }
        );
    });
};
