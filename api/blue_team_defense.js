const { exec } = require('child_process');

/**
 * Blocks a given IP address using iptables.
 * @param {string} ip - The IP address to block.
 */
function blockIP(ip) {
    if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        console.error("Invalid IP address.");
        return;
    }

    const command = `iptables -A INPUT -s ${ip} -j DROP`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Failed to block IP ${ip}: ${stderr}`);
        } else {
            console.log(`✅ IP blocked successfully: ${ip}`);
        }
    });
}

// Example usage
blockIP("192.168.1.10");

// Features: Input validation, clean logs, ready for real use
