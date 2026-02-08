const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function checkHealth() {
    console.log("🏥 Running TravelDost System Health Check...\n");

    let score = 0;
    const total = 3;

    // 1. Check Country Guides (Tests DB Connection + Guide Routes)
    try {
        process.stdout.write("1️⃣  Checking Database (via /api/guides)... ");
        const res = await axios.get(`${BASE_URL}/guides/list`);
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log("✅ UP");
            console.log(`    -> Found ${res.data.length} countries in DB.`);
            score++;
        } else {
            console.log("⚠️  DOWN or EMPTY (No countries found)");
        }
    } catch (e) {
        console.log("❌ FAIL");
        console.error(`    -> Error: ${e.message}`);
    }

    // 2. Check Translation API (Tests External API Proxy)
    try {
        process.stdout.write("2️⃣  Checking Translator (via /api/translate)... ");
        const res = await axios.get(`${BASE_URL}/translate`, {
            params: { text: "Health Check", from: "en", to: "es" }
        });
        if (res.data.translatedText) {
            console.log("✅ UP");
            console.log(`    -> 'Health Check' -> '${res.data.translatedText}'`);
            score++;
        } else {
            console.log("⚠️  FAIL (Invalid Response)");
        }
    } catch (e) {
        console.log("❌ FAIL");
        console.error(`    -> Error: ${e.message}`);
    }

    // 3. Check Checklist API (Tests Auth Middleware - Expecting 401)
    try {
        process.stdout.write("3️⃣  Checking Auth Security (via /api/checklist)... ");
        await axios.get(`${BASE_URL}/checklist`);
        console.log("⚠️  FAIL (Should be protected)");
    } catch (e) {
        if (e.response && e.response.status === 401) {
            console.log("✅ PASS (Correctly Protected)");
            score++;
        } else {
            console.log(`❌ FAIL (Unexpected status: ${e.response?.status || e.message})`);
        }
    }

    console.log(`\n🏁 Health Score: ${score}/${total}`);
    if (score === total) {
        console.log("✨ All Systems Operational!");
    } else {
        console.log("⚠️  Some systems check failed. Review logs above.");
    }
}

checkHealth();
