const axios = require('axios');

const translateText = async (text, from, to) => {
    if (!text || !from || !to) {
        throw new Error('Missing parameters');
    }

    // MyMemory API URL
    const apiUrl = 'https://api.mymemory.translated.net/get';

    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: text,
                langpair: `${from}|${to}`,
                de: 'TravelDostUser@example.com' // Valid email helps with rate limits
            }
        });

        if (response.data && response.data.responseData) {
            return {
                translatedText: response.data.responseData.translatedText,
                match: response.data.responseData.match
            };
        } else {
            throw new Error('Translation API returned invalid data');
        }
    } catch (error) {
        throw new Error(`Translation Service Error: ${error.message}`);
    }
};

module.exports = {
    translateText
};
