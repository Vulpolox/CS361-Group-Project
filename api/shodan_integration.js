const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");
require("dotenv").config({ path: "./.env" });

const router = express.Router();

// PostgreSQL Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
});

// Shodan API Route
router.get("/shodan/:ip", async (req, res) => {
    const { ip } = req.params;
    const SHODAN_API_KEY = process.env.SHODAN_API_KEY;

    if (!SHODAN_API_KEY) {
        return res.status(500).json({ error: "❌ Shodan API key is missing" });
    }

    const SHODAN_URL = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;

    try {
        // Fetch data from Shodan API
        const response = await axios.get(SHODAN_URL);
        const data = response.data;

        // Extract relevant data
        const ip_address = data.ip_str;
        const ports = data.ports ? data.ports.join(", ") : "None";
        const hostnames = data.hostnames ? data.hostnames.join(", ") : "None";

        // Insert data into PostgreSQL
        const query = `
            INSERT INTO threat_data (ip_address, ports, hostnames)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [ip_address, ports, hostnames];

        const result = await pool.query(query, values);

        res.json({
            message: "✅ Shodan data stored successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("❌ Error fetching from Shodan:", error.message);
        res.status(500).json({ error: "Failed to retrieve Shodan data" });
    }
});

module.exports = router;
