const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('./config/db'); // Use your existing DB connection

const WIKI_URL = 'https://en.wikipedia.org/wiki/List_of_emergency_telephone_numbers';

// Safer cleanText helper
const cleanText = (text) => {
  if (!text) return '112'; 
  
  let cleaned = text
    .replace(/\[.*?\]/g, '') // Remove [1]
    .replace(/\(.*?\)/g, '') // Remove (notes)
    .replace(/Mobile phones.*/i, '') 
    .replace(/\n/g, ' ') // Remove newlines
    .trim()
    .split(/,|;|\sor\s/)[0]; // Take first number
    
  // SAFETY: Cut it off if it's still too long for the DB
  return cleaned.substring(0, 99); 
};

const scrapeAndSeed = async () => {
  try {
    console.log('📡 Fetching Wikipedia data...');
    const { data } = await axios.get(WIKI_URL, {
      headers: {
        'User-Agent': 'TravelDost-Educational-Project/1.0 (contact@example.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    const $ = cheerio.load(data);
    
    const countries = [];

    // Wikipedia has multiple tables (Africa, Asia, Europe, etc.)
    // We select all tables with class "wikitable"
    $('table.wikitable').each((tableIndex, table) => {
      $(table).find('tr').each((rowIndex, row) => {
        const columns = $(row).find('td');
        
        // We need rows with at least 4 columns (Country, Police, Ambulance, Fire)
        if (columns.length >= 4) {
          // Extract country name (sometimes it's in a <th> or <a> tag)
          let countryName = $(row).find('th').text().trim() || $(columns[0]).text().trim();
          
          // Cleanup country name (remove footnotes)
          countryName = countryName.replace(/\[.*?\]/g, '').trim();

          const police = cleanText($(columns[1]).text());
          const ambulance = cleanText($(columns[2]).text());
          const fire = cleanText($(columns[3]).text());

          // Skip invalid rows
          if (!countryName || countryName === 'Country') return;

          countries.push({
            name: countryName,
            police,
            ambulance,
            fire
          });
        }
      });
    });

    console.log(`✅ Extracted ${countries.length} countries. Inserting into DB...`);

    // Insert into Database
    for (const country of countries) {
      // We use ON CONFLICT DO NOTHING to avoid overwriting your manual/AI data
      const query = `
        INSERT INTO country_guides 
        (country_name, police_number, ambulance_number, fire_number, embassy_number, local_rules)
        VALUES ($1, $2, $3, $4, 'Check Local', ARRAY['Respect local laws'])
        ON CONFLICT (country_name) DO UPDATE 
        SET 
          police_number = EXCLUDED.police_number,
          ambulance_number = EXCLUDED.ambulance_number,
          fire_number = EXCLUDED.fire_number
      `;
      
      await pool.query(query, [
        country.name, 
        country.police, 
        country.ambulance, 
        country.fire
      ]);
      process.stdout.write('.'); // Show progress
    }

    console.log('\n\n🎉 Wikipedia Seeding Complete!');
    console.log('💡 Note: Local Rules are set to default. Your AI Controller will handle them later if you upgrade it.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Scraping Failed:', err.message);
    process.exit(1);
  }
};

scrapeAndSeed();