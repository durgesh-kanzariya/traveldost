const axios = require('axios');

const translateText = async (text, from, to) => {
    if (!text || !from || !to) {
        throw new Error('Missing parameters');
    }

    // Use Google Translate's internal API (unofficial but reliable)
    const googleTranslate = async () => {
        try {
            const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
                params: {
                    client: 'gtx',
                    sl: from,
                    tl: to,
                    dt: 't',
                    q: text.substring(0, 1000)
                },
                timeout: 10000
            });

            if (response.data && response.data[0]) {
                const translatedParts = response.data[0].map(part => part[0]).join('');
                if (translatedParts && translatedParts.trim()) {
                    return {
                        translatedText: translatedParts,
                        match: 0.95
                    };
                }
            }
        } catch (e) {
            console.log('Google Translate failed:', e.message);
        }
        return null;
    };

    // Try Google Translate first
    const googleResult = await googleTranslate();
    if (googleResult) {
        return googleResult;
    }

    // Fallback to MyMemory
    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text.substring(0, 500),
                langpair: `${from}|${to}`
            },
            timeout: 10000
        });

        if (response.data?.responseStatus === 200 && response.data?.responseData?.translatedText) {
            const result = response.data.responseData.translatedText;
            if (result && result.trim() && result !== text) {
                return {
                    translatedText: result,
                    match: response.data.responseData.match || 0.7
                };
            }
        }
    } catch (e) {
        console.log('MyMemory also failed:', e.message);
    }

    // Last resort fallback
    throw new Error('Translation temporarily unavailable. Please try a shorter phrase.');
};

module.exports = {
    translateText
};
