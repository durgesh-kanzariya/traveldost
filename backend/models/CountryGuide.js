const pool = require('../config/db');

const CountryGuide = {
  // Find a country by name (Case Insensitive)
  findByName: async (countryName) => {
    const query = 'SELECT * FROM country_guides WHERE country_name ILIKE $1';
    const result = await pool.query(query, [countryName]);
    return result.rows[0];
  },

  // (Optional) Create a new country guide - useful for an Admin Panel later
  create: async (data) => {
    const query = `
      INSERT INTO country_guides 
      (country_name, police_number, ambulance_number, fire_number, embassy_number, local_rules)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [
      data.country_name, 
      data.police_number, 
      data.ambulance_number, 
      data.fire_number, 
      data.embassy_number, 
      data.local_rules
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = CountryGuide;