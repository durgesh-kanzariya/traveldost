const express = require('express');
const router = express.Router();

router.get('/reverse', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Missing lat or lng parameters' });
        }

        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch geocode data');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Geocode API Error:', error.message);
        res.status(500).json({ message: 'Failed to reverse geocode location' });
    }
});

module.exports = router;
