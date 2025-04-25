const redis = require("redis");
const { promisify } = require("util");

// Redis setup
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setexAsync = promisify(client.setex).bind(client);

/**
 * Simulates fetching threat data from an external OSINT API.
 * Replace with actual API call in production.
 */
async function fetchFromOSINT(ip) {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return JSON.stringify({
        ip,
        threat_level: "high",
        confidence: 92
    });
}

/**
 * Gets threat data for the given IP address, using Redis caching.
 * 
 * @param {string} ip - IP address to look up
 * @returns {Promise<string>} - Threat data in JSON format
 */
async function getThreatData(ip) {
    const cached = await getAsync(ip);
    if (cached) {
        console.log(`Cache hit for IP: ${ip}`);
        return cached;
    } else {
        console.log(`Cache miss for IP: ${ip}, fetching from API...`);
        const data = await fetchFromOSINT(ip);
        await setexAsync(ip, 3600, data); // Cache for 1 hour
        return data;
    }
}

// Example usage
(async () => {
    const ipAddress = "192.168.1.100";
    const result = await getThreatData(ipAddress);
    console.log("Threat Data:", result);
    client.quit();
})();


/**
bash : npm install redis
 */
