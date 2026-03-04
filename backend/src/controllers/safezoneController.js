const safezoneService = require('../services/safezoneService');

exports.getSafeZones = async (req, res) => {
    try {
        const { lat, lng, policeRadius = 5000, hospitalRadius = 2000 } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Missing lat or lng parameters' });
        }

        const zones = await safezoneService.getSafeZones(lat, lng, policeRadius, hospitalRadius);
        res.json(zones);
    } catch (error) {
        console.error('SafeZones API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch safe zones' });
    }
};
