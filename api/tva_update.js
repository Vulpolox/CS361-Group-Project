const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define SQLite DB location (you can adjust this path if necessary)
const DB_PATH = path.join(__dirname, 'your-database-file.db'); // Path to your SQLite DB file

/**
 * Updates Threat-Vulnerability-Asset (TVA) Mapping in SQLite database.
 * @param {number} assetId - The ID of the asset to update.
 * @param {string} threatName - The name of the detected threat.
 * @param {string} description - The vulnerability description.
 */
async function updateTVAMapping(assetId, threatName, description) {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            return;
        }
    });

    const query = `UPDATE tva_mapping SET threat_name = ?, vulnerability_description = ? WHERE asset_id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [threatName, description, assetId], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                reject('Database update failed');
            } else {
                console.log('TVA Mapping updated successfully.');
                resolve(`TVA Mapping updated for asset ID ${assetId}`);
            }
        });
    }).finally(() => {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
        });
    });
}

module.exports = { updateTVAMapping };

