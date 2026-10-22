const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Replicate the CORS origin checker logic from backend/src/app.js
function checkOrigin(origin, envCorsOrigins = '') {
    return new Promise((resolve, reject) => {
        if (!origin) return resolve(true);

        const allowedConfigured = (envCorsOrigins || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        const allowedProduction = [
            'https://traveldost.durgeshkanzariya.dev',
            'https://durgeshkanzariya.dev',
            'https://traveldost.vercel.app',
            'https://traveldost-git-main-durgeshjkanzariya.vercel.app',
            ...allowedConfigured
        ];

        const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        const isProjectVercel = /^https:\/\/traveldost(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
        const isCustomDomain = /^https?:\/\/([a-z0-9-]+\.)*durgeshkanzariya\.dev$/.test(origin);

        if (isLocalhost || isProjectVercel || isCustomDomain || allowedProduction.includes(origin)) {
            resolve(true);
        } else {
            reject(new Error(`CORS: origin ${origin} not allowed`));
        }
    });
}

describe('CORS Origin Validation', () => {
    it('should allow primary custom domain traveldost.durgeshkanzariya.dev', async () => {
        const allowed = await checkOrigin('https://traveldost.durgeshkanzariya.dev');
        assert.equal(allowed, true);
    });

    it('should allow root and subdomains of durgeshkanzariya.dev', async () => {
        const rootAllowed = await checkOrigin('https://durgeshkanzariya.dev');
        const subAllowed = await checkOrigin('https://www.traveldost.durgeshkanzariya.dev');
        assert.equal(rootAllowed, true);
        assert.equal(subAllowed, true);
    });

    it('should allow production Vercel domain', async () => {
        const allowed = await checkOrigin('https://traveldost.vercel.app');
        assert.equal(allowed, true);
    });

    it('should allow local development ports', async () => {
        const localhost5173 = await checkOrigin('http://localhost:5173');
        const localhost3000 = await checkOrigin('http://localhost:3000');
        assert.equal(localhost5173, true);
        assert.equal(localhost3000, true);
    });

    it('should allow requests with no origin (curl, mobile, server-to-server)', async () => {
        const allowed = await checkOrigin(null);
        assert.equal(allowed, true);
    });

    it('should reject unauthorized third-party origins', async () => {
        await assert.rejects(
            async () => {
                await checkOrigin('https://malicious-attacker.com');
            },
            {
                name: 'Error',
                message: 'CORS: origin https://malicious-attacker.com not allowed'
            }
        );
    });
});
