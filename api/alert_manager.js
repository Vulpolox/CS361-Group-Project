const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const router = express.Router();

// Set up email transporter using environment variables
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ALERT_EMAIL_USER,  // Your email
        pass: process.env.ALERT_EMAIL_PASS,  // App-specific password
    }
});

// Initialize SQLite database
const db = new sqlite3.Database('./threat_management.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

// Create the table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS threat_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    details TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createTableQuery, (err) => {
    if (err) {
        console.error("Error creating table:", err.message);
    } else {
        console.log("Threat alerts table created or already exists.");
    }
});

/**
 * Sends an email alert for high-risk threats.
 * @param {Object} threat - The threat object containing details.
 */
async function sendEmailAlert(threat) {
    const recipient = process.env.ALERT_EMAIL_RECIPIENT || process.env.ALERT_EMAIL_USER;

    if (!recipient) {
        console.error("❌ No recipient defined for email alerts.");
        return;
    }

    const mailOptions = {
        from: `"Threat Monitor" <${process.env.ALERT_EMAIL_USER}>`,
        to: recipient,
        subject: `🚨 High Risk Threat Detected (Score: ${threat.riskScore})`,
        text: `A high-risk threat has been detected:\n\nIP: ${threat.ip}\nRisk Score: ${threat.riskScore}\nDetails: ${threat.details}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email alert sent.");
    } catch (err) {
        console.error("❌ Email sending error:", err);
    }
}

/**
 * Sends a webhook alert to a SIEM or other system.
 * @param {Object} threat - The threat object containing details.
 */
async function sendWebhookAlert(threat) {
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("⚠️ No webhook URL defined. Skipping webhook alert.");
        return;
    }

    try {
        await axios.post(webhookUrl, {
            type: "THREAT_ALERT",
            threat,
        });
        console.log("✅ Webhook alert sent.");
    } catch (err) {
        console.error("❌ Webhook sending error:", err.message);
    }
}

/**
 * Triggers alerts if the threat score exceeds a defined threshold.
 * @param {Object} threat - The threat object containing details.
 */
async function handleThreat(threat) {
    const insertQuery = `
    INSERT INTO threat_alerts (ip, risk_score, details)
    VALUES (?, ?, ?)
    `;
    db.run(insertQuery, [threat.ip, threat.riskScore, threat.details], function (err) {
        if (err) {
            console.error("❌ Error inserting into database:", err.message);
        } else {
            console.log(`✅ Threat stored in database with ID: ${this.lastID}`);
        }
    });

    // Send alerts based on risk score
    if (threat.riskScore > 20) {
        await sendEmailAlert(threat);
        await sendWebhookAlert(threat);
    } else {
        console.log(`ℹ️ Risk score of ${threat.riskScore} is below the alert threshold.`);
    }
}

/**
 * API Endpoint to trigger alerts for a given threat.
 */
router.post("/alert-threat", async (req, res) => {
    const { ip, riskScore, details } = req.body;

    if (!ip || !riskScore || !details) {
        return res.status(400).json({
            error: "Missing required fields: 'ip', 'riskScore', or 'details'."
        });
    }

    const threat = { ip, riskScore, details };

    try {
        await handleThreat(threat);
        res.status(200).json({ message: "Alert handling completed successfully." });
    } catch (error) {
        console.error("❌ Error during threat handling:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
