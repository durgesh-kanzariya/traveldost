const axios = require('axios');

async function testAPIs() {
    console.log("🧪 Testing Free Translation APIs...\n");

    // 1. MyMemory API
    // Limit: 5000 chars/day free.
    try {
        console.log("1️⃣  Testing MyMemory API...");
        const res = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: 'Hello World',
                langpair: 'en|es'
            }
        });
        if (res.data && res.data.responseData) {
            console.log(`   ✅ Success! Translated: "${res.data.responseData.translatedText}"`);
        } else {
            console.log("   ❌ Failed (Unexpected format)");
        }
    } catch (e) {
        console.log(`   ❌ Error: ${e.message}`);
    }

    // 2. Lingva Translate (Scrapes Google, unofficial but free)
    // Public instance
    try {
        console.log("\n2️⃣  Testing Lingva Scraper (via simple GET)...");
        const res = await axios.get('https://lingva.ml/api/v1/en/es/Hello%20World');
        if (res.data && res.data.translation) {
            console.log(`   ✅ Success! Translated: "${res.data.translation}"`);
        } else {
            console.log("   ❌ Failed (Unexpected format)");
        }
    } catch (e) {
        console.log(`   ❌ Error: ${e.message}`);
    }
}

testAPIs();
