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
    return data.elements.map(el => {
        const latitude = el.lat || (el.center && el.center.lat);
        const longitude = el.lon || (el.center && el.center.lon);

        return {
            id: el.id,
            lat: latitude,
            lng: longitude,
            type: el.tags.amenity,
            name: el.tags.name || (el.tags.amenity === 'police' ? 'Unnamed Police Station' : 'Unnamed Hospital')
        };
    }).filter(z => z.lat && z.lng);
};

exports.getSafeZones = async (lat, lng, policeRadius = 5000, hospitalRadius = 2000) => {
    const query = constructOverpassQuery(lat, lng, policeRadius, hospitalRadius);
    const url = `https://lz4.overpass-api.de/api/interpreter`;

    try {
        const response = await axios.post(url, `data=${encodeURIComponent(query)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'TravelDost/1.0 (https://github.com/traveldost)'
            },
            timeout: 25000
        });

        if (typeof response.data === 'string') {
            console.error('Overpass API returned HTML/String instead of JSON. Likely rate limited or timeout.', response.data.substring(0, 200));
            throw new Error('Overpass API rate limit or timeout');
        }

        if (!response.data || !response.data.elements) {
            throw new Error('Invalid response format from Overpass API');
        }

        return parseOverpassResponse(response.data);
    } catch (error) {
        console.error('Overpass API Error Details:', error.response?.data || error.message);
        throw new Error('Failed to fetch safe zones from Overpass API');
    }
};
