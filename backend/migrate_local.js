require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const executeMigration = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log("Starting Local DB Schema Migration...");

        // 1. Roles & User Profiles
        console.log("Creating roles and user_profiles...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                role_name VARCHAR(50) UNIQUE NOT NULL,
                permissions JSONB DEFAULT '{}'
            );
        `);
        // Insert default roles if they don't exist
        await client.query(`
            INSERT INTO roles (role_name) VALUES ('admin'), ('user') ON CONFLICT DO NOTHING;
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                native_language VARCHAR(50) DEFAULT 'English',
                default_currency VARCHAR(10) DEFAULT 'USD',
                avatar_url TEXT
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS user_roles (
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, role_id)
            );
        `);

        // Migrate Old Data -> New Tables
        console.log("Migrating users to user_profiles and user_roles...");
        const users = await client.query(`SELECT id, role, native_language FROM users`);
        for (const user of users.rows) {
            // Profile
            await client.query(`
                INSERT INTO user_profiles (user_id, native_language)
                VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING;
            `, [user.id, user.native_language || 'English']);

            // Roles
            const roleName = user.role ? user.role.toLowerCase() : 'user';
            const roleQuery = `INSERT INTO user_roles (user_id, role_id) 
                 SELECT $1, id FROM roles WHERE role_name = $2 
                 ON CONFLICT DO NOTHING`;
            await client.query(roleQuery, [user.id, roleName]);
        }

        // 2. Destinations & Trips
        console.log("Creating destinations and trip_destinations...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS destinations (
                id SERIAL PRIMARY KEY,
                city_name VARCHAR(100) NOT NULL,
                country_name VARCHAR(100) NOT NULL,
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                UNIQUE(city_name, country_name)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS trip_destinations (
                id SERIAL PRIMARY KEY,
                trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
                destination_id INTEGER REFERENCES destinations(id) ON DELETE RESTRICT,
                visit_order INTEGER DEFAULT 1,
                arrival_date DATE,
                departure_date DATE
            );
        `);

        console.log("Migrating destinations from trips...");
        const trips = await client.query(`SELECT id, destination FROM trips WHERE destination IS NOT NULL`);
        for (const trip of trips.rows) {
            let destName = trip.destination || 'Unknown';
            let destRow = await client.query(`
                INSERT INTO destinations (city_name, country_name) 
                VALUES ($1, 'Unknown') 
                ON CONFLICT (city_name, country_name) DO UPDATE SET city_name=EXCLUDED.city_name
                RETURNING id;
            `, [destName]);

            await client.query(`
                INSERT INTO trip_destinations (trip_id, destination_id) 
                VALUES ($1, $2) ON CONFLICT DO NOTHING;
            `, [trip.id, destRow.rows[0].id]);
        }

        // 3. Checklists
        console.log("Creating custom_checklists and checklist_items...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS custom_checklists (
                id SERIAL PRIMARY KEY,
                trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                list_title VARCHAR(150) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS checklist_items (
                id SERIAL PRIMARY KEY,
                checklist_id INTEGER REFERENCES custom_checklists(id) ON DELETE CASCADE,
                item_name VARCHAR(255) NOT NULL,
                is_checked BOOLEAN DEFAULT false,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Migrating old checklists...");
        const oldChecklists = await client.query(`SELECT * FROM checklists`);
        for (const item of oldChecklists.rows) {
            const defaultListQuery = await client.query(`
                INSERT INTO custom_checklists (trip_id, user_id, list_title)
                VALUES ($1, $2, 'Main Checklist')
                ON CONFLICT DO NOTHING RETURNING id;
            `, [item.trip_id, item.user_id]);

            let checklistId;
            if (defaultListQuery.rows.length > 0) {
                checklistId = defaultListQuery.rows[0].id;
            } else {
                const getList = await client.query(`SELECT id FROM custom_checklists WHERE trip_id=$1 AND user_id=$2 LIMIT 1`, [item.trip_id, item.user_id]);
                checklistId = getList.rows[0]?.id;
            }

            if (checklistId) {
                await client.query(`
                    INSERT INTO checklist_items (checklist_id, item_name, is_checked)
                    VALUES ($1, $2, $3)
                `, [checklistId, item.item, item.is_checked]);
            }
        }

        console.log("Creating expenses...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(12, 2) NOT NULL,
                currency VARCHAR(10) DEFAULT 'USD',
                category VARCHAR(50),
                description TEXT,
                expense_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 4. Drop old obsolete columns 
        console.log("Dropping obsolete columns (ignoring errors if already dropped)...");
        try { await client.query('ALTER TABLE users DROP COLUMN role;'); } catch (e) { }
        try { await client.query('ALTER TABLE users DROP COLUMN native_language;'); } catch (e) { }
        try { await client.query('ALTER TABLE trips DROP COLUMN destination;'); } catch (e) { }
        try { await client.query('DROP TABLE checklists;'); } catch (e) { }

        await client.query('COMMIT');
        console.log("Migration completed successfully!");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Migration failed!", e);
    } finally {
        client.release();
        pool.end();
    }
}

executeMigration().catch(console.error);
