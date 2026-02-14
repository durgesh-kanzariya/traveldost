const pool = require('./config/db');

const addRoleColumn = async () => {
    try {
        const query = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
    `;
        await pool.query(query);
        console.log('✅ Added "role" column to users table.');

        // Optional: Make the first user an admin for testing
        // const updateAdmin = "UPDATE users SET role = 'admin' WHERE id = 1";
        // await pool.query(updateAdmin);
        // console.log('✅ Set User ID 1 as Admin.');

        process.exit();
    } catch (err) {
        console.error('❌ Error updating database:', err.message);
        process.exit(1);
    }
};

addRoleColumn();
