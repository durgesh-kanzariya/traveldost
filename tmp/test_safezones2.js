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

async function testOverpass() {
    const lat = 30.135484054726493;
    const lng = 66.99050903320312;
    const policeRadius = 5000;
    const hospitalRadius = 2000;

    const query = constructOverpassQuery(lat, lng, policeRadius, hospitalRadius);
    const url = `https://lz4.overpass-api.de/api/interpreter`;

    try {
        console.log('Testing Overpass API with fetch...');
        const response = await fetch(url, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'TravelDost/1.0 (https://github.com/traveldost)'
            }
        });

        const text = await response.text();
        console.log('Status code:', response.status);
        console.log('Response excerpt:', text.substring(0, 300));

        const data = JSON.parse(text);
        console.log('Successfully parsed JSON!');
        console.log('Elements found:', data.elements?.length || 0);
    } catch (error) {
        console.error('Test Failed.');
        console.error('Error:', error.message);
    }
}

testOverpass();
