const fs = require('fs');
require('dotenv').config();
const { Pool } = require('pg');

const log = (msg) => {
    fs.appendFileSync('db_test.log', msg + '\n');
};

log('Starting script...');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const testConn = async () => {
    try {
        log('Connecting to pool...');
        const client = await pool.connect();
        log('Connected successfully.');
        const res = await client.query('SELECT current_user');
        log('User: ' + JSON.stringify(res.rows));

        const tables = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public'`);
        log('Tables: ' + JSON.stringify(tables.rows));

        client.release();
    } catch (e) {
        log('Error: ' + e.message);
    } finally {
        pool.end();
    }
}
testConn();
