#!/usr/bin/env node

/**
 * Merge Duplicate Countries Script
 *
 * Fixes the issue where JSON used common country names (e.g., "United Kingdom")
 * but the database uses official ISO names (e.g., "United Kingdom of Great Britain...").
 *
 * This script:
 * 1. Finds the 13 common-name entries inserted by the previous seed script
 * 2. Transfers their local_rules to the corresponding official ISO entries
 * 3. Deletes the common-name duplicate rows
 *
 * Result: Back to exactly 249 countries (or whatever the original count was),
 *         with 111 countries now having detailed rules in their official-named rows.
 *
 * Usage:
 *   node merge-duplicate-countries.js
 *
 * WARNING: This modifies data. Make a backup first if needed.
 *   pg_dump -t country_guides backup.sql
 */

const { Pool } = require('pg');
require('dotenv').config();

// Mapping: JSON/common name → official ISO name in database
const DUPLICATE_MAPPING = [
  ['South Korea', 'Korea, Republic of'],
  ['Vietnam', 'Viet Nam'],
  ['Laos', 'Lao People\'s Democratic Republic'],
  ['United Kingdom', 'United Kingdom of Great Britain and Northern Ireland'],
  ['Russia', 'Russian Federation'],
  ['Tanzania', 'Tanzania, United Republic of'],
  ['Ivory Coast', 'Côte d\'Ivoire'],
  ['Syria', 'Syrian Arab Republic'],
  ['Iran', 'Iran, Islamic Republic of'],
  ['Palestine', 'Palestine, State of'],
  ['Micronesia', 'Micronesia, Federated States of'],
  ['Venezuela', 'Venezuela, Bolivarian Republic of'],
  ['Bolivia', 'Bolivia, Plurinational State of']
];

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'traveldost_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function mergeDuplicates() {
  const client = await pool.connect();

  try {
    console.log('🔍 Starting duplicate country merge...\n');

    // Begin transaction
    await client.query('BEGIN');

    // Count before
    const before = await client.query('SELECT COUNT(*) as total FROM country_guides');
    console.log(`📊 Total rows before: ${before.rows[0].total}`);

    let merged = 0;
    let errors = [];

    // Process each duplicate pair
    for (const [commonName, officialName] of DUPLICATE_MAPPING) {
      try {
        // 1. Check if common name exists (should have rules)
        const commonResult = await client.query(
          'SELECT id, local_rules FROM country_guides WHERE country_name = $1',
          [commonName]
        );

        if (commonResult.rows.length === 0) {
          console.log(`  ⚠️  Skipping: "${commonName}" not found in database`);
          continue;
        }

        const commonRow = commonResult.rows[0];
        const rules = commonRow.local_rules;

        if (!rules || rules.length === 0) {
          console.log(`  ⚠️  Skipping: "${commonName}" has no rules`);
          continue;
        }

        // 2. Check if official name exists
        const officialResult = await client.query(
          'SELECT id FROM country_guides WHERE country_name = $1',
          [officialName]
        );

        if (officialResult.rows.length === 0) {
          console.log(`  ❌ Official entry "${officialName}" not found for "${commonName}". Skipping.`);
          errors.push({ commonName, officialName, error: 'Official entry not found' });
          continue;
        }

        const officialId = officialResult.rows[0].id;

        // 3. Update official entry with rules from common entry
        await client.query(
          'UPDATE country_guides SET local_rules = $1 WHERE id = $2',
          [rules, officialId]
        );

        // 4. Delete the duplicate common entry
        await client.query('DELETE FROM country_guides WHERE id = $1', [commonRow.id]);

        merged++;
        console.log(`  ✅ Merged: "${commonName}" → "${officialName}" (${rules.length} rules)`);
      } catch (err) {
        console.error(`  ❌ Error processing ${commonName}:`, err.message);
        errors.push({ commonName, officialName, error: err.message });
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    // Count after
    const after = await client.query('SELECT COUNT(*) as total FROM country_guides');
    const rowCountChange = parseInt(after.rows[0].total) - parseInt(before.rows[0].total);

    console.log('\n✅ Merge Complete!');
    console.log(`   Rows before: ${before.rows[0].total}`);
    console.log(`   Rows after:  ${after.rows[0].total}`);
    console.log(`   Change:      ${rowCountChange} (should be -${merged} if successful)`);
    console.log(`   Merged:      ${merged} duplicate entries removed`);
    if (errors.length > 0) {
      console.log(`   Errors:      ${errors.length} (see above)`);
    }

    console.log('\n📋 Verify with:');
    console.log('   SELECT COUNT(*) FROM country_guides WHERE local_rules IS NOT NULL AND array_length(local_rules, 1) > 1;');
    console.log('   -- Should still be 111\n');

    if (errors.length === 0 && rowCountChange === -merged) {
      console.log('🎉 Success! Database now has only official ISO country names with all rules preserved.\n');
    } else {
      console.log('⚠️  Some anomalies detected. Review the output above.\n');
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Fatal error, transaction rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run
mergeDuplicates().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
