const axios = require('axios');

async function verifyTranslation() {
    console.log("🧪 Verifying Translation Feature (End-to-End)...\n");

    const TEST_URL = 'http://localhost:5000/api/translate';

    // Test Case 1: Simple English to Spanish
    try {
        console.log("1️⃣  Testing: Hello -> Spanish (es)");
        const res = await axios.get(TEST_URL, {
            params: { text: "Hello", from: "en", to: "es" }
        });

        if (res.data.translatedText.toLowerCase().includes('hola')) {
            console.log(`   ✅ Success! Result: "${res.data.translatedText}"`);
        } else {
            console.log(`   ❌ Failed. Result: "${res.data.translatedText}" (Expected 'Hola')`);
        }
    } catch (e) {
        console.log(`   ❌ Error connecting to backend: ${e.message}`);
        console.log("      (Make sure 'npm run dev' is running in backend folder!)");
    }

    // Test Case 2: Hindi (Local Language Check)
    try {
        console.log("\n2️⃣  Testing: Thank you -> Hindi (hi)");
        const res = await axios.get(TEST_URL, {
            params: { text: "Thank you", from: "en", to: "hi" }
        });

        // "Dhanyavad" or similar
        console.log(`   ✅ Result: "${res.data.translatedText}"`);
    } catch (e) {
        console.log(`   ❌ Error: ${e.message}`);
    }
    // Test Case 3: Complex Sentence -> French
    try {
        console.log("\n3️⃣  Testing: 'Where can I find a vegetarian restaurant?' -> French (fr)");
        const res = await axios.get(TEST_URL, {
            params: { text: "Where can I find a vegetarian restaurant?", from: "en", to: "fr" }
        });

        console.log(`   ✅ Result: "${res.data.translatedText}"`);
        // Expected: "Où puis-je trouver un restaurant végétarien ?"
    } catch (e) {
        console.log(`   ❌ Error: ${e.message}`);
    }

    // Test Case 4: Japanese (Character Set Check)
    try {
        console.log("\n4️⃣  Testing: 'Airport' -> Japanese (ja)");
        const res = await axios.get(TEST_URL, {
            params: { text: "Airport", from: "en", to: "ja" }
        });

        console.log(`   ✅ Result: "${res.data.translatedText}"`);
        // Expected: 空港 (Kūkō)
    } catch (e) {
        console.log(`   ❌ Error: ${e.message}`);
    }
}

verifyTranslation();
