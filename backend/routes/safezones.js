const express = require('express');
const router = express.Router();

const constructOverpassQuery = (lat, lng) => {
    return `
      [out:json][timeout:25];
      (
        nwr["amenity"="police"](around:5000, ${lat}, ${lng});
        nwr["amenity"="hospital"](around:2000, ${lat}, ${lng});
      );
      out center;
    `
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

router.post('/safezones', async (req, res) => {
    try {
        const { lat, lng, policeRadius = 5000, hospitalRadius = 2000 } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Missing lat or lng parameters' });
        }

        const query = `
            [out:json][timeout:25];
            (
                nwr["amenity"="police"](around:${policeRadius}, ${lat}, ${lng});
                nwr["amenity"="hospital"](around:${hospitalRadius}, ${lat}, ${lng});
            );
            out center;
        `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch safe zones from Overpass API');
        }

        const data = await response.json();
        const zones = parseOverpassResponse(data);

        res.json(zones);
    } catch (error) {
        console.error('SafeZones API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch safe zones' });
    }
});

module.exports = router;
