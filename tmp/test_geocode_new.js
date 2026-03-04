const axios = require('axios');

async function test() {
    console.log('Testing reverse geocode with new coordinates...');
    try {
        const lat = 30.135484054726493;
        const lng = 66.99050903320312;
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

        console.log(`Calling: ${url}`);
        const response = await axios.get(url, { timeout: 10000 });

        console.log('Success!');
        console.log('City:', response.data.city);
        console.log('Country:', response.data.countryName);
    } catch (err) {
        console.error('Test Failed.');
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
}

test();
