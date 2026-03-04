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
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch safe zones from Overpass API');
    }

    const data = await response.json();
    return parseOverpassResponse(data);
};
