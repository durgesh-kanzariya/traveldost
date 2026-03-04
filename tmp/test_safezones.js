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

async function testOverpass() {
    const lat = 30.135484054726493;
    const lng = 66.99050903320312;
    const policeRadius = 5000;
    const hospitalRadius = 2000;

    const query = constructOverpassQuery(lat, lng, policeRadius, hospitalRadius);
    const url = `https://overpass.kumi.systems/api/interpreter`;

    try {
        console.log('Testing Overpass API...');
        const response = await axios.post(url, `data=${encodeURIComponent(query)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'TravelDost/1.0 (https://github.com/traveldost)'
            },
            timeout: 10000
        });
        console.log('Success! Response length:', JSON.stringify(response.data).length);
        console.log('Elements found:', response.data.elements?.length || 0);
    } catch (error) {
        console.error('Test Failed.');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testOverpass();
