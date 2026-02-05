const axios = require('axios');
const pool = require('./config/db');

// The Raw JSON URL
const GIST_URL = 'https://gist.githubusercontent.com/immujahidkhan/58c2e7402ad1df43ac4e03d025d7fed5/raw';

const seedGist = async () => {
  try {
    console.log('📡 Fetching data from GitHub Gist...');
    const response = await axios.get(GIST_URL);
    let data = response.data;

    // Handle stringified JSON response
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { }
    }

    // Locate the array (handle if it's wrapped in a "data" property)
    let countries = [];
    if (Array.isArray(data)) countries = data;
    else if (data.data && Array.isArray(data.data)) countries = data.data;
    else countries = Object.values(data);

    console.log(`✅ Fetched ${countries.length} items.`);

    // 🧹 CLEANUP: Wipe old data to remove the "Zombie" rows
    console.log('🧹 Wiping old table data...');
    await pool.query('TRUNCATE TABLE country_guides RESTART IDENTITY');

    console.log('🚀 Starting insertion...');
    
    let successCount = 0;

    for (const item of countries) {
      // 1. EXTRACT NAME (Deeply nested in item.Country.Name)
      let name = null;
      if (item.Country && item.Country.Name) {
          name = item.Country.Name;
      } else if (item.name) {
          name = item.name; // Fallback
      }

      if (!name) continue; // Skip if no name found

      // 2. EXTRACT NUMBERS (Deeply nested in item.Police.All[0])
      const extract = (obj) => {
          if (!obj) return '112';
          if (obj.All && Array.isArray(obj.All)) return obj.All[0] || '112';
          return '112';
      };

      const police = extract(item.Police);
      const ambulance = extract(item.Ambulance);
      const fire = extract(item.Fire);

      // 3. INSERT
      const query = `
        INSERT INTO country_guides 
        (country_name, police_number, ambulance_number, fire_number, embassy_number, local_rules)
        VALUES ($1, $2, $3, $4, 'Check Local', ARRAY['Respect local laws'])
      `;

      await pool.query(query, [name, police, ambulance, fire]);
      process.stdout.write('.'); // Progress dot
      successCount++;
    }

    console.log(`\n\n🎉 Success! Seeded ${successCount} countries correctly.`);
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Seeding Failed:', err.message);
    process.exit(1);
  }
};

seedGist();