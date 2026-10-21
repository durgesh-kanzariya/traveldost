const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/authMiddleware');
const pool = require('../src/config/db');

describe('Auth Middleware & Security Checks', () => {
    it('should reject requests without an x-auth-token header with 401', async () => {
        let statusCode = null;
        let responseJson = null;

        const req = {
            header: () => null
        };
        const res = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        responseJson = data;
                    }
                };
            }
        };
        const next = () => {
            assert.fail('next() should not be called when token is missing');
        };

        await authMiddleware(req, res, next);
        assert.equal(statusCode, 401);
        assert.equal(responseJson.message, 'No token, authorization denied');
    });

    it('should reject requests with invalid token signatures with 401', async () => {
        let statusCode = null;
        let responseJson = null;

        const req = {
            header: () => 'invalid.jwt.token'
        };
        const res = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        responseJson = data;
                    }
                };
            }
        };
        const next = () => {
            assert.fail('next() should not be called with an invalid token');
        };

        await authMiddleware(req, res, next);
        assert.equal(statusCode, 401);
        assert.equal(responseJson.message, 'Token is not valid');
    });

    it('should reject expired tokens with 401 and an explicit expiration message', async () => {
        let statusCode = null;
        let responseJson = null;

        const secret = process.env.JWT_SECRET || 'test_secret_key';
        process.env.JWT_SECRET = secret;

        // Generate an expired token
        const expiredToken = jwt.sign(
            { id: 999, email: 'expired@example.com' },
            secret,
            { expiresIn: -10 }
        );

        const req = {
            header: () => expiredToken
        };
        const res = {
            status: (code) => {
                statusCode = code;
                return {
                    json: (data) => {
                        responseJson = data;
                    }
                };
            }
        };
        const next = () => {
            assert.fail('next() should not be called with an expired token');
        };

        await authMiddleware(req, res, next);
        assert.equal(statusCode, 401);
        assert.match(responseJson.message, /expired/i);
    });

    it('should route database connection failures to next(err) returning 500 instead of 401', async () => {
        const secret = process.env.JWT_SECRET || 'test_secret_key';
        process.env.JWT_SECRET = secret;

        const validToken = jwt.sign({ id: 123 }, secret, { expiresIn: '1h' });

        // Stub pool.query to simulate database lookup failure
        const originalQuery = pool.query;
        pool.query = async () => {
            throw new Error('Database connection failed');
        };

        let nextCalledWithError = null;
        const req = {
            header: () => validToken
        };
        const res = {
            status: () => {
                assert.fail('res.status() should not be called directly on DB failure; next(err) must be used');
            }
        };
        const next = (err) => {
            nextCalledWithError = err;
        };

        try {
            await authMiddleware(req, res, next);
            assert.ok(nextCalledWithError, 'next() must be called with database error');
            assert.equal(nextCalledWithError.message, 'Database connection failed');
        } finally {
            pool.query = originalQuery;
        }
    });

    it('should reject token when account is deleted/deactivated in database with 401', async () => {
        const secret = process.env.JWT_SECRET || 'test_secret_key';
        process.env.JWT_SECRET = secret;

        const validToken = jwt.sign({ id: 456 }, secret, { expiresIn: '1h' });

        const originalQuery = pool.query;
        // User not found in database
        pool.query = async () => ({ rowCount: 0, rows: [] });

        let statusCode = null;
        let responseJson = null;

        const req = { header: () => validToken };
        const res = {
            status: (code) => {
                statusCode = code;
                return { json: (data) => { responseJson = data; } };
            }
        };
        const next = () => assert.fail('next() should not be called when user row does not exist');

        try {
            await authMiddleware(req, res, next);
            assert.equal(statusCode, 401);
            assert.match(responseJson.message, /User account no longer exists/i);
        } finally {
            pool.query = originalQuery;
        }
    });
});
