const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blocked_ips.db');  // Your SQLite DB file

/**
 * Creates the blocked_ips table if it doesn't exist.
 */
function createBlockedIpsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS blocked_ips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(query, (err) => {
        if (err) {
            console.error("❌ Error creating table:", err.message);
        } else {
            console.log("✅ Blocked IPs table created or already exists.");
        }
    });
}

/**
 * Logs blocked IPs into the database.
 * @param {string} ip - The IP address that was blocked.
 */
function logBlockedIP(ip) {
    const query = `INSERT INTO blocked_ips (ip) VALUES (?)`;
    db.run(query, [ip], function (err) {
        if (err) {
            console.error("❌ Error logging blocked IP:", err.message);
        } else {
            console.log(`✅ IP ${ip} logged to database.`);
        }
    });
}

/**
 * Blocks a given IP address using iptables and logs it in SQLite.
 * @param {string} ip - The IP address to block.
 */
function blockIP(ip) {
    // Validate the IP address format
    if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        console.error("❌ Invalid IP address format.");
        return;
    }

    // Construct iptables command
    const command = `iptables -A INPUT -s ${ip} -j DROP`;
    
    // Execute the iptables command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error blocking IP ${ip}: ${stderr}`);
            return;
        }

        // Log the success message
        console.log(`✅ IP ${ip} has been blocked successfully.`);
        
        // Log blocked IP into SQLite
        logBlockedIP(ip);
    });
}

// Example usage
const ipToBlock = "192.168.1.10";
blockIP(ipToBlock);

// Initialize the database (create table if not exists)
createBlockedIpsTable();
