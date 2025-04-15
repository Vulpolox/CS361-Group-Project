const axios = require('axios');
const { Client } = require('pg');

// API Keys (Replace with actual keys or use environment variables)
const SHODAN_API_KEY = process.env.SHODAN_API_KEY || 'HlvDD7cbdhneBv7WzGRZtZ1JSnCHQIP8'; //key from haley's shodan
const IP = '8.8.8.8'; 

// Database Connection Settings
const DB_NAME = process.env.DB_NAME || 'threat_intel';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'securepass';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';

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

// Store threat data in the database
async function storeThreatData(assetId, threatName, vulnerabilityDesc, likelihood, impact) {
    const client = new Client({
        user: DB_USER,
        host: DB_HOST,
        database: DB_NAME,
        password: DB_PASSWORD,
        port: DB_PORT,
    });

    try {
        await client.connect();
        const query = `
            INSERT INTO tva_mapping (asset_id, threat_name, vulnerability_description, likelihood, impact)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(query, [assetId, threatName, vulnerabilityDesc, likelihood, impact]);
        console.log('Threat data successfully stored.');
    } catch (error) {
        console.error('Database error:', error.message);
    } finally {
        await client.end();
    }
}

// Main flow to fetch and store data
async function main() {
    const data = await fetchShodanData(IP);
    if (data && data.ports) {
        await storeThreatData(1, 'Exposed Ports', 'Open ports detected on system', 4, 5);
    }
}

main();
