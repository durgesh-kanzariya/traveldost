#!/usr/bin/env node

/**
 * Normalize Country Names Script
 *
 * Updates all country_name values in country_guides to use common, user-friendly
 * English names instead of official ISO long names.
 *
 * Examples:
 *   "Korea, Republic of" → "South Korea"
 *   "United Kingdom of Great Britain and Northern Ireland" → "United Kingdom"
 *   "Russian Federation" → "Russia"
 *   "Viet Nam" → "Vietnam"
 *
 * This is a one-time data cleanup. After this, your country names will match
 * what geocoding APIs (like BigDataCloud) return and what users expect.
 *
 * Usage:
 *   node normalize-country-names.js
 *
 * WARNING: This modifies data. Make a backup first if needed.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Mapping: Official/formal names → Common user-friendly names
// Only includes countries that need renaming. Names not in this map are kept as-is.
const NAME_MAPPING = {
  // Asia
  'Korea, Republic of': 'South Korea',
  "Korea, Democratic People's Republic of": 'North Korea',
  'Viet Nam': 'Vietnam',
  "Lao People's Democratic Republic": 'Laos',
  'Brunei Darussalam': 'Brunei',
  'Myanmar': 'Myanmar',  // Already common, but officially "Myanmar" is fine
  'Timor-Leste': 'East Timor',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Cape Verde': 'Cabo Verde',  // Actually official is Cabo Verde, but both used
  // Note: "Macao" and "Hong Kong" are fine as they are special administrative regions

  // Europe
  "Russian Federation": 'Russia',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  'Czech Republic': 'Czechia',  // Short name is now official
  'Moldova, Republic of': 'Moldova',
  'Macedonia, the former Yugoslav Republic of': 'North Macedonia',
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina',  // Already short
  'Serbia': 'Serbia',  // Fine

  // Middle East / Central Asia
  'Iran, Islamic Republic of': 'Iran',
  'Syrian Arab Republic': 'Syria',
  'Palestine, State of': 'Palestine',
  "Korea, Democratic People's Republic of": 'North Korea',
  'Türkiye': 'Turkey',  // If stored as Türkiye, change to Turkey
  'Turkiye': 'Turkey',   // Alternative spelling
  'UAE': 'United Arab Emirates',  // Abbreviation
  'United Arab Emirates': 'United Arab Emirates', // Already fine

  // Africa
  'Central African Republic': 'Central African Republic', // OK
  'Congo, the Democratic Republic of the': 'Democratic Republic of the Congo',
  'Congo': 'Republic of the Congo',  // Might be separate entry
  'São Tomé and Príncipe': 'Sao Tome and Principe',
  'Libyan Arab Jamahiriya': 'Libya',  // Old name
  'Swaziland': 'Eswatini',  // Renamed in 2018

  // Americas
  'Venezuela, Bolivarian Republic of': 'Venezuela',
  'Bolivia, Plurinational State of': 'Bolivia',
  'Antigua and Barbuda': 'Antigua and Barbuda', // OK
  'Saint Kitts and Nevis': 'Saint Kitts and Nevis', // OK
  'Trinidad and Tobago': 'Trinidad and Tobago', // OK
  'Bahamas': 'The Bahamas', // Often "The Bahamas" but Bahamas is fine
  'Gambia': 'The Gambia', // Should be "The Gambia"
  'Mauritania': 'Mauritania', // OK
  'Micronesia, Federated States of': 'Micronesia',
  'Marshall Islands': 'Marshall Islands', // OK
  'Palau': 'Palau', // OK
  'Nauru': 'Nauru', // OK
  'Tuvalu': 'Tuvalu', // OK
  'Kiribati': 'Kiribati', // OK
  'Tonga': 'Tonga', // OK
  'Samoa': 'Samoa', // OK
  'Vanuatu': 'Vanuatu', // OK
  'Solomon Islands': 'Solomon Islands', // OK
  'Papua New Guinea': 'Papua New Guinea', // OK
  'Fiji': 'Fiji', // OK
  'Australia': 'Australia', // OK
  'New Zealand': 'New Zealand', // OK
  'United States': 'United States', // OK (not "United States of America" needed)
  'Canada': 'Canada', // OK
  'Mexico': 'Mexico', // OK
  'Guatemala': 'Guatemala', // OK
  'Belize': 'Belize', // OK
  'Honduras': 'Honduras', // OK
  'El Salvador': 'El Salvador', // OK
  'Nicaragua': 'Nicaragua', // OK
  'Costa Rica': 'Costa Rica', // OK
  'Panama': 'Panama', // OK
  'Colombia': 'Colombia', // OK
  'Ecuador': 'Ecuador', // OK
  'Peru': 'Peru', // OK
  'Chile': 'Chile', // OK
  'Argentina': 'Argentina', // OK
  'Brazil': 'Brazil', // OK
  'Uruguay': 'Uruguay', // OK
  'Paraguay': 'Paraguay', // OK
  'Guyana': 'Guyana', // OK
  'Suriname': 'Suriname', // OK
  'Jamaica': 'Jamaica', // OK
  'Haiti': 'Haiti', // OK
  'Cuba': 'Cuba', // OK
  'Dominican Republic': 'Dominican Republic', // OK
  'Bahamas': 'Bahamas', // OK (sometimes "The Bahamas")
  'Trinidad and Tobago': 'Trinidad and Tobago', // OK
  'Barbados': 'Barbados', // OK

  // Europe (continued)
  'Germany': 'Germany', // OK
  'France': 'France', // OK
  'Italy': 'Italy', // OK
  'Spain': 'Spain', // OK
  'Portugal': 'Portugal', // OK
  'Netherlands': 'Netherlands', // OK (sometimes "The Netherlands")
  'Belgium': 'Belgium', // OK
  'Switzerland': 'Switzerland', // OK
  'Austria': 'Austria', // OK
  'Poland': 'Poland', // OK
  'Hungary': 'Hungary', // OK
  'Romania': 'Romania', // OK
  'Bulgaria': 'Bulgaria', // OK
  'Greece': 'Greece', // OK
  'Turkey': 'Turkey', // OK (note: already in mapping if stored as Turkiye)
  'Ukraine': 'Ukraine', // OK
  'Belarus': 'Belarus', // OK
  'Lithuania': 'Lithuania', // OK
  'Latvia': 'Latvia', // OK
  'Estonia': 'Estonia', // OK
  'Finland': 'Finland', // OK
  'Sweden': 'Sweden', // OK
  'Norway': 'Norway', // OK
  'Denmark': 'Denmark', // OK
  'Iceland': 'Iceland', // OK
  'Ireland': 'Ireland', // OK
  'United Kingdom': 'United Kingdom', // OK (already normalized)
  'Slovenia': 'Slovenia', // OK
  'Croatia': 'Croatia', // OK
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina', // OK
  'Serbia': 'Serbia', // OK
  'Montenegro': 'Montenegro', // OK
  'Albania': 'Albania', // OK
  'Greece': 'Greece', // OK
  'Cyprus': 'Cyprus', // OK
  'Malta': 'Malta', // OK
  'Slovakia': 'Slovakia', // OK
  'Czechia': 'Czechia', // OK (or Czech Republic)

  // Asia (continued)
  'Japan': 'Japan', // OK
  'China': 'China', // OK
  'India': 'India', // OK
  'Pakistan': 'Pakistan', // OK
  'Bangladesh': 'Bangladesh', // OK
  'Sri Lanka': 'Sri Lanka', // OK
  'Nepal': 'Nepal', // OK
  'Bhutan': 'Bhutan', // OK
  'Maldives': 'Maldives', // OK
  'Singapore': 'Singapore', // OK
  'Malaysia': 'Malaysia', // OK
  'Indonesia': 'Indonesia', // OK
  'Philippines': 'Philippines', // OK
  'Thailand': 'Thailand', // OK
  'Myanmar': 'Myanmar', // OK
  'Cambodia': 'Cambodia', // OK
  'Mongolia': 'Mongolia', // OK
  'Taiwan': 'Taiwan', // OK (might be "Taiwan, Province of China" in some lists)
  'Afghanistan': 'Afghanistan', // OK
  'Kazakhstan': 'Kazakhstan', // OK
  'Uzbekistan': 'Uzbekistan', // OK
  'Turkmenistan': 'Turkmenistan', // OK
  'Kyrgyzstan': 'Kyrgyzstan', // OK
  'Tajikistan': 'Tajikistan', // OK

  // Middle East
  'Saudi Arabia': 'Saudi Arabia', // OK
  'Oman': 'Oman', // OK
  'Yemen': 'Yemen', // OK
  'United Arab Emirates': 'United Arab Emirates', // OK
  'Qatar': 'Qatar', // OK
  'Bahrain': 'Bahrain', // OK
  'Kuwait': 'Kuwait', // OK
  'Iraq': 'Iraq', // OK
  'Jordan': 'Jordan', // OK
  'Lebanon': 'Lebanon', // OK
  'Israel': 'Israel', // OK
  'Palestine': 'Palestine', // OK (already normalized if stored as State of Palestine)
  'Egypt': 'Egypt', // OK
  'Sudan': 'Sudan', // OK
  'South Sudan': 'South Sudan', // OK
  'Ethiopia': 'Ethiopia', // OK
  'Somalia': 'Somalia', // OK
  'Kenya': 'Kenya', // OK
  'Uganda': 'Uganda', // OK
  'Tanzania': 'Tanzania', // OK (already normalized if stored as United Republic)
  'Rwanda': 'Rwanda', // OK
  'Burundi': 'Burundi', // OK
  'Democratic Republic of the Congo': 'Democratic Republic of the Congo', // OK (long but accurate)
  'Republic of the Congo': 'Republic of the Congo', // OK
  'Gabon': 'Gabon', // OK
  'Equatorial Guinea': 'Equatorial Guinea', // OK
  'Cameroon': 'Cameroon', // OK
  'Nigeria': 'Nigeria', // OK
  'Ghana': 'Ghana', // OK
  'Ivory Coast': 'Ivory Coast', // OK (already normalized if stored as Côte d'Ivoire)
  'Senegal': 'Senegal', // OK
  'Mali': 'Mali', // OK
  'Mauritania': 'Mauritania', // OK
  'Niger': 'Niger', // OK
  'Chad': 'Chad', // OK
  'Central African Republic': 'Central African Republic', // OK
  'Eritrea': 'Eritrea', // OK
  'Djibouti': 'Djibouti', // OK
  'Angola': 'Angola', // OK
  'Zambia': 'Zambia', // OK
  'Malawi': 'Malawi', // OK
  'Mozambique': 'Mozambique', // OK
  'Zimbabwe': 'Zimbabwe', // OK
  'Botswana': 'Botswana', // OK
  'Namibia': 'Namibia', // OK
  'South Africa': 'South Africa', // OK
  'Lesotho': 'Lesotho', // OK
  'Eswatini': 'Eswatini', // OK (formerly Swaziland)
  'Madagascar': 'Madagascar', // OK
  ' Mauritius': 'Mauritius', // Trim space
  'Seychelles': 'Seychelles', // OK
  'Comoros': 'Comoros', // OK
  'Cape Verde': 'Cape Verde', // OK (or Cabo Verde)
  'Sao Tome and Principe': 'Sao Tome and Principe', // OK (trimmed)

  // Oceania
  'Papua New Guinea': 'Papua New Guinea', // OK
  'Fiji': 'Fiji', // OK
  'Solomon Islands': 'Solomon Islands', // OK
  'Vanuatu': 'Vanuatu', // OK
  'New Caledonia': 'New Caledonia', // Territory, OK
  'French Polynesia': 'French Polynesia', // Territory, OK
  'Samoa': 'Samoa', // OK
  'American Samoa': 'American Samoa', // Territory, OK
  'Guam': 'Guam', // Territory, OK
  'Northern Mariana Islands': 'Northern Mariana Islands', // Territory, OK
  'Micronesia': 'Micronesia', // OK (normalized from Federated States)
  'Marshall Islands': 'Marshall Islands', // OK
  'Palau': 'Palau', // OK
  'Nauru': 'Nauru', // OK
  'Kiribati': 'Kiribati', // OK
  'Tuvalu': 'Tuvalu', // OK
  'Tonga': 'Tonga', // OK
  'Cook Islands': 'Cook Islands', // Territory, OK
  'Niue': 'Niue', // Territory, OK
  'Australia': 'Australia', // OK
  'New Zealand': 'New Zealand', // OK
  'Antarctica': 'Antarctica', // Continent, OK

  // Special territories that should remain as their common names
  'Åland Islands': 'Åland Islands', // OK
  'American Samoa': 'American Samoa', // OK
  'Bermuda': 'Bermuda', // Territory, OK
  'British Virgin Islands': 'British Virgin Islands', // Territory, OK
  'Cayman Islands': 'Cayman Islands', // Territory, OK
  'Falkland Islands': 'Falkland Islands', // Territory, OK
  'Gibraltar': 'Gibraltar', // Territory, OK
  'Guernsey': 'Guernsey', // Territory, OK
  'Isle of Man': 'Isle of Man', // Territory, OK
  'Jersey': 'Jersey', // Territory, OK
  'Macao': 'Macao', // Special Administrative Region, OK
  'Hong Kong': 'Hong Kong', // Special Administrative Region, OK
  'Montserrat': 'Montserrat', // Territory, OK
  'Pitcairn Islands': 'Pitcairn Islands', // Territory, OK
  'Saint Helena': 'Saint Helena', // Territory, OK
  'Turks and Caicos Islands': 'Turks and Caicos Islands', // Territory, OK
  'US Virgin Islands': 'US Virgin Islands', // Territory, OK
  'Wallis and Futuna': 'Wallis and Futuna', // Territory, OK
  'Western Sahara': 'Western Sahara', // OK (disputed)
};

// Count of changes expected
const totalMappings = Object.keys(NAME_MAPPING).length;
console.log(`Loaded ${totalMappings} name mappings.`);

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'traveldost_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function normalizeNames() {
  const client = await pool.connect();

  try {
    console.log('\n🔧 Starting country name normalization...\n');

    await client.query('BEGIN');

    // Get all country names
    const allResult = await client.query(
      'SELECT id, country_name FROM country_guides ORDER BY country_name'
    );

    const allCountries = allResult.rows;
    console.log(`📊 Total countries in DB: ${allCountries.length}`);

    let updated = 0;
    let unchanged = 0;
    let errors = [];

    // Process each country
    for (const row of allCountries) {
      const { id, country_name } = row;
      const newName = NAME_MAPPING[country_name];

      if (!newName) {
        // No mapping needed - name is already fine
        unchanged++;
        continue;
      }

      try {
        // Update to normalized name
        await client.query(
          'UPDATE country_guides SET country_name = $1 WHERE id = $2',
          [newName, id]
        );
        updated++;
        console.log(`  ✏️  "${country_name}" → "${newName}"`);
      } catch (err) {
        console.error(`  ❌ Error updating ${country_name}:`, err.message);
        errors.push({ id, old: country_name, new: newName, error: err.message });
      }
    }

    await client.query('COMMIT');

    // Verify uniqueness after updates
    const uniqueCheck = await client.query(
      'SELECT COUNT(*) as total, COUNT(DISTINCT country_name) as unique_names FROM country_guides'
    );

    console.log('\n✅ Normalization Complete!');
    console.log(`   Updated:    ${updated} country names changed`);
    console.log(`   Unchanged:  ${unchanged} country names already correct`);
    console.log(`   Total rows: ${allCountries.length}`);
    console.log(`   Unique names: ${uniqueCheck.rows[0].unique_names} (should equal total rows)`);

    if (errors.length > 0) {
      console.log(`   Errors:     ${errors.length}`);
    }

    // Check for duplicates that might have been created
    const duplicateCheck = await client.query(`
      SELECT country_name, COUNT(*) as cnt
      FROM country_guides
      GROUP BY country_name
      HAVING COUNT(*) > 1
    `);

    if (duplicateCheck.rows.length > 0) {
      console.log('\n⚠️  WARNING: Duplicate country names found:');
      duplicateCheck.rows.forEach(r => {
        console.log(`   "${r.country_name}" appears ${r.cnt} times`);
      });
    } else {
      console.log('\n🎉 No duplicates - all country names are unique!');
    }

    console.log('\n📋 Sample queries to verify:');
    console.log('   SELECT country_name FROM country_guides ORDER BY country_name LIMIT 10;');
    console.log('   SELECT COUNT(*) FROM country_guides WHERE country_name = \'South Korea\';');
    console.log('   SELECT COUNT(*) FROM country_guides WHERE country_name = \'Russia\';');

    // Show a few transformed examples
    console.log('\n✅ Verification - check these exist with new names:');
    const verifyList = ['South Korea', 'United Kingdom', 'Russia', 'Vietnam', 'Iran', 'Tanzania', 'Ivory Coast', 'Laos', 'Syria', 'Palestine', 'Micronesia', 'Venezuela', 'Bolivia'];
    for (const name of verifyList) {
      const count = await client.query(
        'SELECT COUNT(*) as cnt FROM country_guides WHERE country_name = $1',
        [name]
      );
      if (count.rows[0].cnt > 0) {
        console.log(`   ✓ ${name} exists`);
      } else {
        console.log(`   ✗ ${name} NOT FOUND`);
      }
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
normalizeNames().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
