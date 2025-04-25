// Required libraries
const axios = require('axios');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const assert = require('assert');

const SHODAN_API_KEY = process.env.SHODAN_API_KEY || 'your_shodan_api_key';
const IP = "8.8.8.8";

async function runOsintUpdates() {
    console.log("Fetching latest threat intelligence data...");
    const data = await fetchShodanData(IP);
    if (data) {
        console.log("Data fetched and stored successfully.");
    }
}

// Schedule the OSINT update every 6 hours
schedule.scheduleJob('0 */6 * * *', () => {
    runOsintUpdates();
    console.log("Scheduler is running...");
});

// Task 4: Implementing an Alert System for High-Risk Threats
function sendAlert(threat, riskScore) {
    if (riskScore <= 20) {
        console.log(`Threat detected: ${threat}, but score ${riskScore} is not critical.`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'smtp.your-email.com',  
        port: 587,
        secure: false,
        auth: {
            user: 'your-email', 
            pass: 'your-password' 
        }
    });

    const mailOptions = {
        from: 'alerts@shopsmart.com',
        to: 'admin@shopsmart.com',
        subject: 'Critical Cybersecurity Alert',
        text: `High-Risk Threat Detected: ${threat} with Risk Score ${riskScore}`
    };

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

function testRiskAlert() {
    assert.doesNotThrow(() => sendAlert("SQL Injection", 25), "Alert failed for high-risk score");
    assert.doesNotThrow(() => sendAlert("Port Scan", 10), "Alert sent incorrectly for low-risk score");
}
