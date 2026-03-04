const CountryGuide = require('../models/CountryGuide');

const getGuideByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const guide = await CountryGuide.findByName(country);

    if (!guide) {
      return res.json({
        country_name: country,
        police_number: '112',
        ambulance_number: '112',
        fire_number: '112',
        local_rules: ['Respect local laws'],
        source: 'fallback'
      });
    }

    res.json(guide);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAllCountries = async (req, res) => {
  try {
    const names = await CountryGuide.findAllNames();
    res.json(names);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getGuideByCountry, getAllCountries };