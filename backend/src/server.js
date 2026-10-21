const dotenv = require('dotenv');
const createApp = require('./app');
const pool = require('./config/db');

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
});

const shutdown = () => {
    server.close(async () => {
        try {
            await pool.end();
            process.exit(0);
        } catch (err) {
            console.error('Error closing database pool:', err.message);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
