//Threat-Vulnerability-Asset Mapping
const { Pool } = require('pg');
const DB_CONFIG = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
};
async function updateTVAMapping(assetId, threatName, description) {
    const pool = new Pool(DB_CONFIG);
    try {
        const query = `UPDATE tva_mapping SET threat_name=$1, vulnerability_description=$2 WHERE asset_id=$3`;
        await pool.query(query, [threatName, description, assetId]);
        console.log('TVA Mapping updated successfully.');
    } catch (error) {
        console.error('Database error:', error.message);
    } finally {
        await pool.end();
    }
}

module.exports = { updateTVAMapping };
