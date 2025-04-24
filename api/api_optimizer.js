const redis = require("redis");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config({ path: './srv.env' });

// Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
client.connect();

// SQLite client
const dbPath = process.env.DB_PATH || './threat_intel.db';
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error("❌ SQLite connection error:", err.message);
  } else {
    console.log("✅ SQLite connected in api_optimizer");
  }
});

// Simulated OSINT fetch
async function fetchFromOSINT(ip) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
  return {
    ip,
    threat_level: "high",
    confidence: 92
  };
}

// Store to SQLite
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

// Get threat data, check Redis > SQLite > Fetch
async function getThreatData(ip) {
  // 1. Check Redis cache
  const cached = await client.get(ip);
  if (cached) {
    console.log(`🟢 Cache hit for IP: ${ip}`);
    return JSON.parse(cached);
  }

  // 2. Check SQLite
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

        // cache to Redis
        await client.setEx(ip, 3600, JSON.stringify(data));
        return resolve(data);
      }

      // 3. Fallback to external fetch
      console.log(`🔴 No match found — fetching from OSINT...`);
      const data = await fetchFromOSINT(ip);

      // Save to both Redis and SQLite
      await client.setEx(ip, 3600, JSON.stringify(data));
      storeThreatData(data.ip, data.threat_level, data.confidence);

      return resolve(data);
    });
  });
}

module.exports = {
  getThreatData,
  fetchFromOSINT,
  storeThreatData
};
