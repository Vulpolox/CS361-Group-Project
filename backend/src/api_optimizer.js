// api_optimizer.js

const axios = require("axios");
const redis = require("redis");
const path = require("path");

// Import centralized environment variables
const env = require('./config/env');

// Import centralized database connection
const db = require('./database/db');

// Redis client setup
const client = redis.createClient({
  url: env.REDIS_URL || "redis://localhost:6379",
});

client.connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch((err) => console.error("❌ Redis connection error:", err.message));

// Fetch from Shodan API
async function fetchFromOSINT(ip) {
  const SHODAN_API_KEY = process.env.SHODAN_API_KEY;
  const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;

  try {
    const response = await axios.get(url);
    const threat_level = response.data.tags.includes("malicious") ? "high" : "moderate";
    const confidence = response.data.ports?.length ? Math.min(100, response.data.ports.length * 10) : 30;

    return {
      ip,
      threat_level,
      confidence
    };
  } catch (error) {
    console.error(`❌ Error fetching OSINT for ${ip}:`, error.message);
    return {
      ip,
      threat_level: "unknown",
      confidence: 0
    };
  }
}

// Store in SQLite
function storeThreatData(ip, threat_level, confidence) {
  const query = `
    INSERT INTO threat_data (ip_address, ports, hostnames)
    VALUES (?, ?, ?)
  `;
  const values = [ip, `confidence: ${confidence}`, `threat: ${threat_level}`];

  db.run(query, values, function (err) {
    if (err) {
      console.error("❌ SQLite insert error:", err.message);
    } else {
      console.log(`✅ Data for ${ip} saved to SQLite.`);
    }
  });
}

// Get threat data from Redis > SQLite > OSINT
async function getThreatData(ip) {
  try {
    // Check Redis
    const cached = await client.get(ip);
    if (cached) {
      console.log(`🟢 Redis cache hit for IP: ${ip}`);
      return JSON.parse(cached);
    }

    // Check SQLite
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM threat_data WHERE ip_address = ?", [ip], async (err, row) => {
        if (err) {
          console.error("❌ SQLite read error:", err.message);
          return reject(err);
        }

        if (row) {
          console.log(`🟡 SQLite hit for IP: ${ip}`);
          const data = {
            ip: row.ip_address,
            threat_level: row.hostnames?.split(': ')[1] || "unknown",
            confidence: parseInt(row.ports?.split(': ')[1]) || 0
          };

          await client.setEx(ip, 3600, JSON.stringify(data));
          return resolve(data);
        }

        // Fallback to OSINT
        console.log(`🔴 No data found — fetching from Shodan...`);
        const data = await fetchFromOSINT(ip);

        await client.setEx(ip, 3600, JSON.stringify(data));
        storeThreatData(data.ip, data.threat_level, data.confidence);

        return resolve(data);
      });
    });
  } catch (error) {
    console.error("❌ Error in getThreatData:", error.message);
    throw error;
  }
}

module.exports = {
  getThreatData,
  fetchFromOSINT,
  storeThreatData
};
