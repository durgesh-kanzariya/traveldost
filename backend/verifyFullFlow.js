const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verifyFullFlow() {
    console.log("🚀 Starting Full Flow Verification (Auth + Checklist)...\n");

    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
        name: `Test User ${randomId}`,
        email: `testuser${randomId}@example.com`,
        password: 'password123',
        nativeLanguage: 'es'
    };

    let token = '';
    let itemId = '';

    // 1. REGISTER
    try {
        process.stdout.write(`1️⃣  Registering User (${testUser.email})... `);
        const res = await axios.post(`${BASE_URL}/auth/register`, testUser);
        if (res.data.token) {
            token = res.data.token;
            console.log("✅ OK");
        } else {
            console.log("❌ FAIL (No token received)");
            process.exit(1);
        }
    } catch (e) {
        console.log(`❌ FAIL: ${e.response?.data?.message || e.message}`);
        process.exit(1);
    }

    // 2. CHECKLIST (GET - Empty)
    try {
        process.stdout.write("2️⃣  Getting Checklist (Expect Empty)... ");
        const res = await axios.get(`${BASE_URL}/checklist`, {
            headers: { 'x-auth-token': token }
        });
        if (Array.isArray(res.data) && res.data.length === 0) {
            console.log("✅ OK");
        } else {
            console.log(`❌ FAIL (Expected [], got ${JSON.stringify(res.data)})`);
        }
    } catch (e) {
        console.log(`❌ FAIL: ${e.message}`);
    }

    // 3. CHECKLIST (ADD)
    try {
        process.stdout.write("3️⃣  Adding Item 'Passport'... ");
        const res = await axios.post(`${BASE_URL}/checklist`,
            { label: 'Passport' },
            { headers: { 'x-auth-token': token } }
        );
        if (res.data.label === 'Passport') {
            console.log("✅ OK");
            itemId = res.data.id;
        } else {
            console.log("❌ FAIL");
        }
    } catch (e) {
        console.log(`❌ FAIL: ${e.message}`);
    }

    // 4. CHECKLIST (UPDATE)
    try {
        process.stdout.write("4️⃣  Checking Item (Toggle)... ");
        await axios.put(`${BASE_URL}/checklist/${itemId}`,
            { checked: true },
            { headers: { 'x-auth-token': token } }
        );
        console.log("✅ OK");
    } catch (e) {
        console.log(`❌ FAIL: ${e.message}`);
    }

    // 5. CHECKLIST (DELETE)
    try {
        process.stdout.write("5️⃣  Deleting Item... ");
        await axios.delete(`${BASE_URL}/checklist/${itemId}`, {
            headers: { 'x-auth-token': token }
        });
        console.log("✅ OK");
    } catch (e) {
        console.log(`❌ FAIL: ${e.message}`);
    }

    console.log("\n✨ Verification Complete!");
}

verifyFullFlow();
