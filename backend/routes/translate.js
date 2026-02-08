const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route   GET /api/translate
// @desc    Translate text using MyMemory API
// @access  Public (or Protected if you want)
router.get('/', async (req, res) => {
    try {
        const { text, from, to } = req.query;

        if (!text || !from || !to) {
            return res.status(400).json({ message: 'Missing parameters: text, from, to' });
        }

        // MyMemory API URL
        // Format: https://api.mymemory.translated.net/get?q=Hello World&langpair=en|it
        const apiUrl = 'https://api.mymemory.translated.net/get';

        const response = await axios.get(apiUrl, {
            params: {
                q: text,
                langpair: `${from}|${to}`,
                de: 'TravelDostUser@example.com' // Valid email helps with rate limits
            }
        });

        if (response.data && response.data.responseData) {
            return res.json({
                translatedText: response.data.responseData.translatedText,
                match: response.data.responseData.match
            });
        }

        res.status(500).json({ message: 'Translation API error' });

    } catch (err) {
        console.error('Translation Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
