const User = require('./models/User');

(async () => {
    try {
        console.log('Testing findByEmail...');
        const user = await User.findByEmail('durgesh@example.com');
        console.log('Found user:', user);
    } catch (e) {
        console.error('Error finding user:', e);
    }
    process.exit();
})();
