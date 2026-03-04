const axios = require('axios');

exports.reverseGeocode = async (lat, lng) => {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('BigDataCloud API Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch geocode data');
    }
};
