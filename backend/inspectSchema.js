const pool = require('./config/db');

const inspectSchema = async () => {
    try {
        console.log('🔍 Inspecting Database Schema...');

        const tables = ['users', 'country_guides', 'checklists'];

        for (const table of tables) {
            const res = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table]);

            console.log(`\n📋 Table: ${table}`);
            if (res.rows.length === 0) {
                console.log('   (Table not found)');
            } else {
                res.rows.forEach(row => {
                    console.log(`   - ${row.column_name} (${row.data_type})`);
                });
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

inspectSchema();
