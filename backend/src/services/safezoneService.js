const axios = require('axios');

const constructOverpassQuery = (lat, lng, policeRadius, hospitalRadius) => {
    return `
      [out:json][timeout:25];
      (
        nwr["amenity"="police"](around:${policeRadius}, ${lat}, ${lng});
        nwr["amenity"="hospital"](around:${hospitalRadius}, ${lat}, ${lng});
      );
      out center;
    `;
};

const parseOverpassResponse = (data) => {
    if (!data || !Array.isArray(data.elements)) return [];
    return data.elements.map(el => {
        const latitude = (el.lat !== null && el.lat !== undefined)
            ? el.lat
            : (el.center && el.center.lat !== null && el.center.lat !== undefined ? el.center.lat : null);
        const longitude = (el.lon !== null && el.lon !== undefined)
            ? el.lon
            : (el.center && el.center.lon !== null && el.center.lon !== undefined ? el.center.lon : null);

        return {
            id: el.id,
            lat: latitude,
            lng: longitude,
            type: el.tags && el.tags.amenity,
            name: (el.tags && el.tags.name) || (el.tags && el.tags.amenity === 'police' ? 'Unnamed Police Station' : 'Unnamed Hospital')
        };
    }).filter(z => z.lat !== null && z.lat !== undefined && z.lng !== null && z.lng !== undefined);
};

exports.getSafeZones = async (lat, lng, policeRadius = 5000, hospitalRadius = 2000) => {
    const query = constructOverpassQuery(lat, lng, policeRadius, hospitalRadius);
    const url = `https://overpass-api.de/api/interpreter`;

    try {
        const response = await axios.post(url, `data=${encodeURIComponent(query)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'TravelDost/1.0 (https://github.com/traveldost)'
            },
            timeout: 5000
        });

        if (typeof response.data === 'string') {
            console.warn('Overpass API returned HTML/String instead of JSON. Likely rate limited or timeout.');
            return [];
        }

        if (!response.data || !response.data.elements) {
            return [];
        }

        return parseOverpassResponse(response.data);
    } catch (error) {
        console.warn('Overpass API Warning:', error.message);
        // Graceful fallback: return empty array rather than failing the entire map view
        return [];
    }
};
