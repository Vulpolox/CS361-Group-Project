const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// API Keys (Replace with actual keys or use environment variables)
const SHODAN_API_KEY = process.env.SHODAN_API_KEY || 'your_shodan_api_key';
const IP = '8.8.8.8';

// SQLite Database File Path (Use an environment variable or default to a file)
const DB_PATH = process.env.DB_PATH || './threat_intel.db';

// Initialize SQLite database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Successfully connected to the SQLite database');
    }
});

// Fetch threat data from Shodan API
async function fetchShodanData(ip) {
    const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Shodan:', error.message);
        return null;
    }
}

// Store threat data in the SQLite database
async function storeThreatData(assetId, threatName, vulnerabilityDesc, likelihood, impact) {
    const query = `
        INSERT INTO tva_mapping (asset_id, threat_name, vulnerability_description, likelihood, impact)
        VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.run(query, [assetId, threatName, vulnerabilityDesc, likelihood, impact], function (err) {
            if (err) {
                console.error('Error storing data:', err.message);
                reject(err);
            } else {
                console.log('Threat data successfully stored.');
                resolve();
            }
        });
    });
}

// Main flow to fetch and store data
async function main() {
    const data = await fetchShodanData(IP);
    if (data && data.ports) {
        await storeThreatData(1, 'Exposed Ports', 'Open ports detected on system', 4, 5);
    }
}

main();
