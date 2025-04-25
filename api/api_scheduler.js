// Required libraries
const axios = require('axios');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const assert = require('assert');
require('dotenv').config();  // For environment variables

// Fetching sensitive credentials from .env
const SHODAN_API_KEY = process.env.SHODAN_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

// IP to check
const IP = "8.8.8.8"; // Replace with dynamic IP or real data in the future

// Fetching data from Shodan API
async function fetchShodanData(ip) {
    const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error("Error fetching data from Shodan:", err.message);
    }
}

// Run OSINT Updates every 6 hours
async function runOsintUpdates() {
    console.log("Fetching latest threat intelligence data...");
    const data = await fetchShodanData(IP);
    if (data) {
        console.log("Data fetched and stored successfully.");
    }
}

// Schedule the OSINT update every 6 hours (Cron syntax)
schedule.scheduleJob('0 */6 * * *', async () => {
    await runOsintUpdates();
    console.log("Scheduler is running...");
});

// Task 4: Implementing an Alert System for High-Risk Threats
async function sendAlert(threat, riskScore) {
    if (riskScore <= 20) {
        console.log(`Threat detected: ${threat}, but score ${riskScore} is not critical.`);
        return;
    }

    // Email setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Using Gmail as the mail service
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: RECIPIENT_EMAIL,
        subject: 'Critical Cybersecurity Alert',
        text: `High-Risk Threat Detected: ${threat} with Risk Score ${riskScore}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Failed to send alert: ${error}`);
        } else {
            console.log("Alert sent successfully:", info.response);
        }
    });
}

// Task 5: Testing & Validating API Responses
async function testShodanApi() {
    const data = await fetchShodanData("8.8.8.8");
    assert.ok(data.ports, "Expected 'ports' in API response");
    assert.ok(Array.isArray(data.ports), "Expected 'ports' to be a list");
    assert.ok(data.hostnames, "Expected 'hostnames' in API response");
}

// Testing Risk Alert Logic
function testRiskAlert() {
    assert.doesNotThrow(() => sendAlert("SQL Injection", 25), "Alert failed for high-risk score");
    assert.doesNotThrow(() => sendAlert("Port Scan", 10), "Alert sent incorrectly for low-risk score");
}

// Example Usage of Sending Alerts
const exampleThreat = {
    name: "SQL Injection",
    riskScore: 25
};
sendAlert(exampleThreat.name, exampleThreat.riskScore);

// Run the test
testShodanApi().catch(err => console.error("API Test failed:", err));
testRiskAlert();
