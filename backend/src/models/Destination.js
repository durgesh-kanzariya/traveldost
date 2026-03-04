const pool = require('../config/db');

const Destination = {
    findByName: async (cityName, dbClient = pool) => {
        const query = 'SELECT id FROM destinations WHERE city_name = $1';
        const result = await dbClient.query(query, [cityName]);
        return result.rows[0] || null;
    },

    create: async (cityName, countryName = 'Unknown', dbClient = pool) => {
        const query = 'INSERT INTO destinations (city_name, country_name) VALUES ($1, $2) RETURNING id';
        const result = await dbClient.query(query, [cityName, countryName]);
        return result.rows[0].id;
    },

    findOrCreate: async (cityName, dbClient = pool) => {
        let dest = await Destination.findByName(cityName, dbClient);
        if (dest) return dest.id;
        return await Destination.create(cityName, 'Unknown', dbClient);
    }
};

module.exports = Destination;
