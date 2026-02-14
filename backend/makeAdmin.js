const pool = require('./config/db');

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.log('Usage: node makeAdmin.js <email>');
        process.exit(1);
    }

    try {
        const query = "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *";
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            console.log('❌ User not found with email:', email);
        } else {
            console.log(`✅ User ${result.rows[0].name} (${email}) is now an Admin.`);
        }

        process.exit();
    } catch (err) {
        console.error('❌ Error updating user:', err.message);
        process.exit(1);
    }
};

makeAdmin();
