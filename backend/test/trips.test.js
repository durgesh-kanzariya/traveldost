const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const tripService = require('../src/services/tripService');
const pool = require('../src/config/db');

describe('Trip Service & Ownership Verification', () => {
    it('should reject trip deletion and abort transaction if trip does not belong to user', async () => {
        const originalConnect = pool.connect;

        let rolledBack = false;
        let released = false;

        // Mock client connection
        const mockClient = {
            query: async (sql, params) => {
                if (sql === 'BEGIN') return;
                if (sql.includes('SELECT id FROM trips WHERE id = $1 AND user_id = $2 FOR UPDATE')) {
                    // Simulates 0 rows found for user_id
                    return { rowCount: 0, rows: [] };
                }
                if (sql === 'ROLLBACK') {
                    rolledBack = true;
                    return;
                }
                throw new Error(`Unexpected SQL executed: ${sql}`);
            },
            release: () => {
                released = true;
            }
        };

        pool.connect = async () => mockClient;

        try {
            await assert.rejects(
                async () => {
                    await tripService.deleteTrip(999, 10, 'move_to_general');
                },
                (err) => {
                    assert.equal(err.message, 'Trip not found');
                    assert.equal(err.statusCode, 404);
                    return true;
                }
            );

            assert.equal(rolledBack, true, 'Transaction must execute ROLLBACK on ownership mismatch');
            assert.equal(released, true, 'Client connection must be released back to the pool');
        } finally {
            pool.connect = originalConnect;
        }
    });

    it('should complete atomic transaction on successful trip deletion', async () => {
        const originalConnect = pool.connect;

        const executedQueries = [];
        let committed = false;
        let released = false;

        const mockClient = {
            query: async (sql, params) => {
                executedQueries.push({ sql, params });
                if (sql === 'BEGIN') return;
                if (sql.includes('SELECT id FROM trips WHERE id = $1 AND user_id = $2 FOR UPDATE')) {
                    return { rowCount: 1, rows: [{ id: 10 }] };
                }
                if (sql.includes('UPDATE custom_checklists')) {
                    return { rowCount: 2 };
                }
                if (sql.includes('DELETE FROM trips')) {
                    return { rowCount: 1 };
                }
                if (sql === 'COMMIT') {
                    committed = true;
                    return;
                }
                throw new Error(`Unexpected SQL: ${sql}`);
            },
            release: () => {
                released = true;
            }
        };

        pool.connect = async () => mockClient;

        try {
            await tripService.deleteTrip(1, 10, 'move_to_general');

            assert.equal(committed, true, 'Transaction must be committed');
            assert.equal(released, true, 'Client must be released back to the pool');
            assert.ok(executedQueries.some(q => q.sql.includes('FOR UPDATE')), 'Ownership lock must be requested');
            assert.ok(executedQueries.some(q => q.sql.includes('DELETE FROM trips')), 'Trip delete query must be executed');
        } finally {
            pool.connect = originalConnect;
        }
    });
});
