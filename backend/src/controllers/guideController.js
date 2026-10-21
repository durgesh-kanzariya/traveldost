const CountryGuide = require('../models/CountryGuide');

const getGuideByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const guide = await CountryGuide.findByName(country);

    if (!guide) {
      return res.json({
        country_name: country,
        police_number: null,
        ambulance_number: null,
        fire_number: null,
        embassy_number: null,
        local_rules: ['Respect local laws and verify local emergency contacts with local authorities.'],
        source: 'fallback',
        provenance: '112 Universal Emergency Number — Available in EU and select global networks (verify local carrier)',
        is_verified: false
      });
    }

    res.json({
      id: guide.id,
      country_name: guide.country_name,
      police_number: guide.police_number && guide.police_number.trim() ? guide.police_number.trim() : null,
      ambulance_number: guide.ambulance_number && guide.ambulance_number.trim() ? guide.ambulance_number.trim() : null,
      fire_number: guide.fire_number && guide.fire_number.trim() ? guide.fire_number.trim() : null,
      embassy_number: guide.embassy_number && guide.embassy_number.trim() ? guide.embassy_number.trim() : null,
      local_rules: guide.local_rules || [],
      source: 'database',
      provenance: 'Listed Regional Contact',
      is_verified: false
    });
  } catch (err) {
    console.error('Error fetching country guide:', err.message);
    res.status(500).json({ error: 'Failed to retrieve country emergency guide' });
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