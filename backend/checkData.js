const pool = require('./config/db');

const check = async () => {
  try {
    console.log('🔍 Checking Database...');
    
    // 1. Count the rows
    const res = await pool.query('SELECT COUNT(*) FROM country_guides');
    const count = res.rows[0].count;
    
    console.log(`📊 Total Rows in Table: ${count}`);

    if (count > 0) {
      // 2. Show a sample
      const sample = await pool.query('SELECT country_name, police_number FROM country_guides LIMIT 3');
      console.log('👀 Sample Data:', sample.rows);
    } else {
      console.log('❌ Table is EMPTY.');
    }

    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

check();