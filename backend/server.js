const dotenv = require('dotenv');
const createApp = require('./app');

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

app.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});
