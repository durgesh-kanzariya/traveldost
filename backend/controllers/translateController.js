const translationService = require('../services/translationService');

const getTranslation = async (req, res) => {
    try {
        const { text, from, to } = req.query;

        // Validation is partly handled in Service, but good to catch early if needed.
        // However, for MVC, Controller prepares data, Service processes it.

        const result = await translationService.translateText(text, from, to);
        res.json(result);

    } catch (err) {
        console.error('Translation Controller Error:', err.message);
        if (err.message === 'Missing parameters') {
            return res.status(400).json({ message: 'Missing parameters: text, from, to' });
        }
        res.status(500).json({ message: 'Translation API error' });
    }
};

module.exports = {
    getTranslation
};
