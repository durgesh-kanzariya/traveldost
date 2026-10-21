const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validationResult } = require('express-validator');

const { expenseRules, ALLOWED_CURRENCIES } = require('../src/validators/expenseValidator');
const { tripRules } = require('../src/validators/tripValidator');
const { safezoneRules } = require('../src/validators/safezoneValidator');
const { translateRules, ALLOWED_LANGUAGES } = require('../src/validators/translateValidator');
const { currencyRatesRules } = require('../src/validators/currencyValidator');

async function runValidation(rules, req) {
    for (const middleware of rules) {
        await middleware.run(req);
    }
    return validationResult(req);
}

describe('Schema & Bounds Validators', () => {
    describe('Expense Validator', () => {
        it('should accept valid expense data with supported currency', async () => {
            const req = {
                body: {
                    trip_id: 1,
                    amount: 45.50,
                    currency: 'USD',
                    category: 'Food',
                    description: 'Lunch at cafe',
                    expense_date: '2026-10-21T12:00:00Z'
                }
            };
            const result = await runValidation(expenseRules, req);
            assert.equal(result.isEmpty(), true);
        });

        it('should reject expenses with unsupported or invalid currency codes', async () => {
            const req = {
                body: {
                    trip_id: 1,
                    amount: 50,
                    currency: 'XYZ',
                    category: 'Transport',
                    expense_date: '2026-10-21T12:00:00Z'
                }
            };
            const result = await runValidation(expenseRules, req);
            assert.equal(result.isEmpty(), false);
            const errors = result.array();
            assert.ok(errors.some(e => e.path === 'currency'));
        });

        it('should reject amounts <= 0 or > 100,000,000', async () => {
            const zeroReq = {
                body: {
                    trip_id: 1,
                    amount: 0,
                    category: 'Food',
                    expense_date: '2026-10-21T12:00:00Z'
                }
            };
            const zeroResult = await runValidation(expenseRules, zeroReq);
            assert.equal(zeroResult.isEmpty(), false);

            const hugeReq = {
                body: {
                    trip_id: 1,
                    amount: 100000001,
                    category: 'Food',
                    expense_date: '2026-10-21T12:00:00Z'
                }
            };
            const hugeResult = await runValidation(expenseRules, hugeReq);
            assert.equal(hugeResult.isEmpty(), false);
        });
    });

    describe('Trip Validator', () => {
        it('should allow valid trip with destinations array and ISO currency allowlist', async () => {
            const req = {
                body: {
                    destinations: ['France', 'Spain'],
                    start_date: '2026-11-01',
                    end_date: '2026-11-10',
                    budget: 2500,
                    currency: 'EUR'
                }
            };
            const result = await runValidation(tripRules, req);
            assert.equal(result.isEmpty(), true);
        });

        it('should reject trips with end_date before start_date', async () => {
            const req = {
                body: {
                    destinations: ['Japan'],
                    start_date: '2026-12-10',
                    end_date: '2026-12-01',
                    budget: 1500,
                    currency: 'JPY'
                }
            };
            const result = await runValidation(tripRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.msg.includes('End date must be after')));
        });

        it('should reject unsupported currency code in trip', async () => {
            const req = {
                body: {
                    destinations: ['India'],
                    start_date: '2026-11-01',
                    end_date: '2026-11-10',
                    budget: 50000,
                    currency: 'FAKE'
                }
            };
            const result = await runValidation(tripRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.path === 'currency'));
        });
    });

    describe('Safezone Coordinate Validator', () => {
        it('should accept 0 as valid latitude and longitude coordinates', async () => {
            const req = {
                body: {
                    lat: 0,
                    lng: 0,
                    policeRadius: 5000,
                    hospitalRadius: 2000
                }
            };
            const result = await runValidation(safezoneRules, req);
            assert.equal(result.isEmpty(), true);
        });

        it('should reject out-of-bounds latitude (< -90 or > 90)', async () => {
            const req = {
                body: {
                    lat: 91,
                    lng: 0
                }
            };
            const result = await runValidation(safezoneRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.path === 'lat'));
        });

        it('should reject safezone radius < 100m or > 50,000m', async () => {
            const req = {
                body: {
                    lat: 20.5,
                    lng: 78.9,
                    policeRadius: 50 // below 100m
                }
            };
            const result = await runValidation(safezoneRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.path === 'policeRadius'));
        });
    });

    describe('Translate Validator', () => {
        it('should accept text <= 500 chars and ISO allowlisted language codes', async () => {
            const req = {
                query: {
                    text: 'Hello, how are you?',
                    from: 'en',
                    to: 'hi'
                }
            };
            const result = await runValidation(translateRules, req);
            assert.equal(result.isEmpty(), true);
        });

        it('should reject text exceeding 500 characters', async () => {
            const req = {
                query: {
                    text: 'a'.repeat(501),
                    from: 'en',
                    to: 'es'
                }
            };
            const result = await runValidation(translateRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.path === 'text'));
        });

        it('should reject unsupported or invalid language codes', async () => {
            const req = {
                query: {
                    text: 'Bonjour',
                    from: 'unknown_lang',
                    to: 'invalid_code'
                }
            };
            const result = await runValidation(translateRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.path === 'from' || e.path === 'to'));
        });
    });

    describe('Currency Rates Validator', () => {
        it('should accept valid base currency from allowlist', async () => {
            const req = {
                params: { base: 'USD' }
            };
            const result = await runValidation(currencyRatesRules, req);
            assert.equal(result.isEmpty(), true);
        });

        it('should reject unsupported base currency', async () => {
            const req = {
                params: { base: 'XYZ' }
            };
            const result = await runValidation(currencyRatesRules, req);
            assert.equal(result.isEmpty(), false);
            assert.ok(result.array().some(e => e.path === 'base'));
        });
    });
});
