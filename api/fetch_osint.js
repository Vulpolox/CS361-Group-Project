// shodan_store.js
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// Environment variables
const SHODAN_API_KEY = process.env.SHODAN_API_KEY || 'your_shodan_api_key';
const IP = '8.8.8.8'; // Example IP for testing
const DB_PATH = process.env.DB_PATH || './db/threat_intel.db';

const db = require('../db/db'); // Adjust the path if needed


// Fetch data from Shodan
async function fetchShodanData(ip) {
    const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;
    try {
        const response = await axios.get(url);
        console.log('📡 Shodan data fetched successfully.');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching data from Shodan:', error.message);
        return null;
    }
}

// Store threat data into TVA mapping table
function storeThreatData(assetId, threatName, vulnerabilityDesc, likelihood, impact) {
    const query = `
        INSERT INTO tva_mapping (
            asset_id,
            threat_name,
            vulnerability_description,
            likelihood,
            impact
        ) VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [assetId, threatName, vulnerabilityDesc, likelihood, impact], function (err) {
        if (err) {
            console.error('❌ Error inserting data into tva_mapping:', err.message);
        } else {
            console.log(`✅ Threat "${threatName}" successfully stored in tva_mapping.`);
        }
    });
}

// Run the main logic
async function main() {
    const data = await fetchShodanData(IP);

    if (data && data.ports && data.ports.length > 0) {
        storeThreatData(
            'A003',
            'Exposed Ports',
            'Multiple open ports detected on system',
            'High',
            'Moderate'
        );
    } else {
        console.warn('⚠️ No port data available from Shodan, skipping DB insertion.');
    }
}

main();
