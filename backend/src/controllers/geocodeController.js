const geocodeService = require('../services/geocodeService');

exports.reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (lat === undefined || lat === null || lat === '' || isNaN(Number(lat)) ||
            lng === undefined || lng === null || lng === '' || isNaN(Number(lng))) {
            return res.status(400).json({ message: 'Missing or invalid lat or lng parameters' });
        }

        const data = await geocodeService.reverseGeocode(Number(lat), Number(lng));
        res.json(data);
    } catch (error) {
        console.error('Geocode API Error:', error.message);
        res.status(500).json({ message: 'Failed to reverse geocode location' });
    }
};
