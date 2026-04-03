#!/usr/bin/env node

/**
 * Seed Script: Import Uncommon Rules into country_guides Table
 *
 * This script reads uncommon_rules_by_country.json and populates the
 * country_guides table with detailed local rules.
 *
 * It uses INSERT ... ON CONFLICT (UPSERT) to:
 * - Insert new countries with rules
 * - Update existing countries' local_rules while preserving emergency numbers
 *
 * Usage:
 *   node seed-country-guides.js
 *
 * Prerequisites:
 *   - PostgreSQL database running (local or Neon)
 *   - .env file in backend/ with DB connection variables
 *   - uncommon_rules_by_country.json in project root
 *
 *   OR modify the connection string directly in the script.
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load .env file
require('dotenv').config();

// Read the JSON data
const jsonPath = path.join(__dirname, '..', '..', 'uncommon_rules_by_country.json');
console.log(`📖 Loading rules from: ${jsonPath}`);

let rulesData;
try {
  rulesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`✅ Loaded ${rulesData.countries.length} countries with ${rulesData.countries.reduce((sum, c) => sum + c.rules.length, 0)} rules`);
} catch (err) {
  console.error('❌ Error reading JSON file:', err.message);
  process.exit(1);
}

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'traveldost_local',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Transform JSON rules into format for local_rules ARRAY
// Format: "[Category] Rule text" to preserve category info in the text array
function formatRules(country) {
  return country.rules.map(rule => {
    const escapedRule = rule.rule.replace(/'/g, "''");
    return `[${rule.category}] ${escapedRule}`;
  });
}

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('\n🚀 Starting import...\n');

    // Start transaction
    await client.query('BEGIN');

    // Count before
    const beforeCount = await client.query(
      "SELECT COUNT(*) as total FROM country_guides WHERE local_rules IS NOT NULL AND local_rules != '{}'"
    );
    console.log(`📊 Countries with detailed rules before: ${beforeCount.rows[0].total}`);

    let inserted = 0;
    let updated = 0;

    // Process each country from JSON
    for (const country of rulesData.countries) {
      const countryName = country.country;
      const rulesArray = formatRules(country);

      // UPSERT: Insert if new, update if exists
      const upsertQuery = `
        INSERT INTO country_guides (country_name, local_rules)
        VALUES ($1, $2)
        ON CONFLICT (country_name)
        DO UPDATE SET
          local_rules = EXCLUDED.local_rules
        RETURNING (xmax = 0) AS inserted
      `;

      const result = await client.query(upsertQuery, [countryName, rulesArray]);
      if (result.rows[0].inserted) {
        inserted++;
        console.log(`  ➕ Inserted: ${countryName} (${rulesArray.length} rules)`);
      } else {
        updated++;
        console.log(`  ✏️  Updated: ${countryName} (${rulesArray.length} rules)`);
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    // Count after
    const afterCount = await client.query(
      "SELECT COUNT(*) as total FROM country_guides WHERE local_rules IS NOT NULL AND local_rules != '{}'"
    );

    console.log('\n✅ Import Complete!');
    console.log(`   Inserted: ${inserted} new countries`);
    console.log(`   Updated:  ${updated} existing countries`);
    console.log(`   Total countries with detailed rules: ${afterCount.rows[0].total}\n`);

    // Show sample queries
    console.log('📋 Verify with:');
    console.log('   SELECT country_name, array_length(local_rules, 1) as rule_count');
    console.log('   FROM country_guides WHERE local_rules IS NOT NULL LIMIT 5;\n');

    // Show a specific example
    const sampleResult = await client.query(
      'SELECT country_name, local_rules FROM country_guides WHERE country_name = $1 AND local_rules IS NOT NULL',
      ['Japan']
    );
    if (sampleResult.rows.length > 0) {
      const countryData = sampleResult.rows[0];
      console.log('🎌 Sample: Japan');
      console.log(`   Total rules: ${countryData.local_rules.length}`);
      console.log('   First 3 rules:');
      countryData.local_rules.slice(0, 3).forEach((rule, i) => {
        console.log(`     ${i + 1}. ${rule.substring(0, 100)}...`);
      });
      console.log('');
    }

    console.log('💡 Note: Emergency numbers (police, ambulance, fire, embassy) are untouched.');
    console.log('   You can populate them separately using the same country_guides table.\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during import:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run it
seedDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
