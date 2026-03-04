exports.reverseGeocode = async (lat, lng) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch geocode data');
    }
    return await response.json();
};
