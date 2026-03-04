const geocodeService = require('../services/geocodeService');

exports.reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Missing lat or lng parameters' });
        }

        const data = await geocodeService.reverseGeocode(lat, lng);
        res.json(data);
    } catch (error) {
        console.error('Geocode API Error:', error.message);
        res.status(500).json({ message: 'Failed to reverse geocode location' });
    }
};
