const pool = require('../config/db');

const CountryGuide = {
  // Find a country by name (Case Insensitive)
  findByName: async (countryName) => {
    const query = 'SELECT * FROM country_guides WHERE country_name ILIKE $1';
    const result = await pool.query(query, [countryName]);
    return result.rows[0];
  },

  // Count all guides
  count: async () => {
    const query = 'SELECT COUNT(*) FROM country_guides';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
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
  },

  // Find all guides (for Admin)
  findAll: async () => {
    const query = 'SELECT * FROM country_guides ORDER BY country_name ASC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Find only names (for dropdowns)
  findAllNames: async () => {
    const query = 'SELECT country_name FROM country_guides ORDER BY country_name ASC';
    const result = await pool.query(query);
    return result.rows.map(row => row.country_name);
  },

  // Update guide
  update: async (id, data) => {
    const query = `
      UPDATE country_guides 
      SET country_name = $1, police_number = $2, ambulance_number = $3, fire_number = $4, embassy_number = $5, local_rules = $6
      WHERE id = $7
      RETURNING *`;
    const values = [
      data.country_name,
      data.police_number,
      data.ambulance_number,
      data.fire_number,
      data.embassy_number,
      data.local_rules,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete guide
  delete: async (id) => {
    const query = 'DELETE FROM country_guides WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = CountryGuide;