const geocodeService = require('../backend/src/services/geocodeService');

async function test() {
    console.log('Testing reverse geocode with axios...');
    try {
        const lat = 30.411558275294254;
        const lng = 67.939453125;
        const data = await geocodeService.reverseGeocode(lat, lng);
        console.log('Success!');
        console.log('City:', data.city);
        console.log('Country:', data.countryName);
        console.log('Full Data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

test();
