const CountryGuide = require('../models/CountryGuide');
const pool = require('../config/db'); // Ensure pool is imported if not already used in this file

const getGuideByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    
    // 1. Simple DB Lookup
    const guide = await CountryGuide.findByName(country);

    if (!guide) {
      // Fallback if country is not in the Gist
      return res.json({
        country_name: country,
        police_number: '112',
        ambulance_number: '112',
        fire_number: '112',
        local_rules: ['Respect local laws'],
        source: 'fallback'
      });
    }

    // 2. Return Data
    res.json(guide);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAllCountries = async (req, res) => {
  try {
    const result = await pool.query('SELECT country_name FROM country_guides ORDER BY country_name ASC');
    // Send back just a clean array of strings: ["Afghanistan", "Albania", ...]
    const names = result.rows.map(row => row.country_name);
    res.json(names);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update exports
module.exports = { getGuideByCountry, getAllCountries };