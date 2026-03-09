const pool = require('../config/db');

const Destination = {
    findByName: async (locationName, dbClient = pool) => {
        const query = 'SELECT id FROM destinations WHERE location_name = $1';
        const result = await dbClient.query(query, [locationName]);
        return result.rows[0] || null;
    },

    create: async (locationName, countryName = 'Unknown', locationType = 'city', dbClient = pool) => {
        const query = 'INSERT INTO destinations (location_name, country_name, location_type) VALUES ($1, $2, $3) RETURNING id';
        const result = await dbClient.query(query, [locationName, countryName, locationType]);
        return result.rows[0].id;
    },

    findOrCreate: async (locationName, dbClient = pool) => {
        let dest = await Destination.findByName(locationName, dbClient);
        if (dest) return dest.id;
        return await Destination.create(locationName, 'Unknown', 'city', dbClient);
    }
};

module.exports = Destination;
