const pool = require('./config/db');

// Your raw text data
const rawData = `
Korea 202-939-5600
Australia 202-797-3000 Lebanon 202-939-6300
Bahamas 202-319-2660 Lithuania 202-234-5860
Bangladesh 202-244-0183 Madagascar 202-265-5525
Belize 202-332-9636 Mexico 202-728-1600
Benin 202-232-6656 Myanmar 202-332-9044
Bolivia 202-483-4410 Nepal 202-667-5534
Canada 202-682-1740 Nicaragua 202-939-6570
Chad 202-462-4009 Nigeria 202-986-8400
Chile 202-785-1746 Pakistan 202-243-6500
China 202-328-2500 Philippines 202-467-9400
Colombia 202-387-8338 Russia 202-298-5700
Cote d'Ivoire 202-797-0300 Rwanda 202-232-2882
Croatia 202-588-5899 Sierra Leone 202-939-9261
D.R. of Congo 202-234-7690 South Africa 202-232-4400
Ecuador 202-234-7200 Sudan 202-338-8565
Egypt 202-895-5400 Switzerland 202-745-7900
Ethiopia 202-364-1200 Syria 202-232-6313
Fiji 202-337-8320 Tanzania 202-939-6125
France 202-944-6200 Thailand 202-944-3600
Germany 202-298-4000 Taiwan 202-895-1800
Ghana 202-686-4520 Trinidad & Tobago 202-467-6490
Haiti 202-332-4090 Tunisia 202-862-1850
Honduras 202-966-7702 Uganda 202-726-7100
India 202-939-7000 Ukraine 202-333-0606
Israel 202-364-5500 United Kingdom 202-588-7800
Jamaica 202-452-0660 Uruguay 202-331-1313
Japan 202-238-6700 Vietnam 202-861-0737
Jordan 202-966-2664 Zambia 202-265-9717
Kenya 202-387-6101 Zimbabwe 202-332-7100
`;

// Map short names to Database names (if they differ)
const nameMap = {
  "Korea": "South Korea", 
  "D.R. of Congo": "Democratic Republic of the Congo",
  "Trinidad & Tobago": "Trinidad and Tobago",
  "Russia": "Russian Federation",
  "Vietnam": "Viet Nam", // Sometimes stored as Viet Nam in ISO
  "Cote d'Ivoire": "Ivory Coast"
};

const seedEmbassies = async () => {
  try {
    console.log('📡 Parsing Embassy Data...');
    
    // Regex to find "Country Name" followed by "Phone Number"
    // Matches: "Country Name" (Letters, spaces, & ' .) + "Phone" (XXX-XXX-XXXX)
    const regex = /([a-zA-Z\s'.&]+)\s(\d{3}-\d{3}-\d{4})/g;
    let match;
    let count = 0;

    console.log('🚀 Updating Database...');

    while ((match = regex.exec(rawData)) !== null) {
      let country = match[1].trim();
      let phone = match[2].trim();

      // Fix name if it's in our map
      if (nameMap[country]) {
        country = nameMap[country];
      }

      // We use ILIKE for case-insensitive matching
      // We only UPDATE existing rows, we don't insert new ones (since we need police/fire too)
      const query = `
        UPDATE country_guides 
        SET embassy_number = $1 
        WHERE country_name ILIKE $2
      `;

      const res = await pool.query(query, [phone, country]);
      
      if (res.rowCount > 0) {
        process.stdout.write('✅ '); // Updated
      } else {
        process.stdout.write('❌ '); // Country not found in DB
        // console.log(`(Miss: ${country})`); // Uncomment to see failures
      }
      
      count++;
    }

    console.log(`\n\n🎉 Processed ${count} embassy numbers!`);
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Failed:', err.message);
    process.exit(1);
  }
};

seedEmbassies();