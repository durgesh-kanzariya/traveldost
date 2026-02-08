const pool = require('./config/db');

const initDb = async () => {
  try {
    console.log('🏗️  Initializing Database Structure...');

    // ---------------------------------------------------------
    // 1. USERS TABLE
    // ---------------------------------------------------------
    // Updated to match actual DB: name (not full_name), password (not password_hash)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        native_language VARCHAR(50) DEFAULT 'English',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "users" is ready.');

    // ---------------------------------------------------------
    // 2. COUNTRY GUIDES TABLE
    // ---------------------------------------------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS country_guides (
        id SERIAL PRIMARY KEY,
        country_name VARCHAR(100) UNIQUE NOT NULL,
        police_number VARCHAR(100),
        ambulance_number VARCHAR(100),
        fire_number VARCHAR(100),
        embassy_number VARCHAR(100),
        local_rules TEXT[]
      );
    `);
    console.log('✅ Table "country_guides" is ready.');

    // ---------------------------------------------------------
    // 3. TRIPS TABLE
    // ---------------------------------------------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        destination VARCHAR(100) NOT NULL,
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10, 2),
        currency VARCHAR(10) DEFAULT 'INR',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "trips" is ready.');

    // ---------------------------------------------------------
    // 4. ITINERARY ITEMS TABLE
    // ---------------------------------------------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS itinerary_items (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
        day_number INTEGER,
        activity_name VARCHAR(200),
        location VARCHAR(200),
        time TIME,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'planned'
      );
    `);
    console.log('✅ Table "itinerary_items" is ready.');

    // ---------------------------------------------------------
    // 5. CHECKLISTS TABLE
    // ---------------------------------------------------------
    // Updated to match actual DB: user_id (not trip_id), item_name, is_checked (not is_packed), removed category
    await pool.query(`
      CREATE TABLE IF NOT EXISTS checklists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_name VARCHAR(200) NOT NULL,
        is_checked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "checklists" is ready.');

    console.log('\n🎉 Database Initialization Complete! All tables match current production schema.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
    process.exit(1);
  }
};

initDb();