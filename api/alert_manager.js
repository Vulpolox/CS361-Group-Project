
const nodemailer = require("nodemailer");
const axios = require("axios");

// Email setup (replace with real credentials or use .env)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password"
    }
});

/**
 * Sends an email alert.
 */
async function sendEmailAlert(threat) {
    const mailOptions = {
        from: '"Threat Monitor" <your-email@gmail.com>',
        to: "security-team@example.com",
        subject: `High Risk Threat Detected (Score: ${threat.riskScore})`,
        text: `A high-risk threat has been detected:\n\nIP: ${threat.ip}\nScore: ${threat.riskScore}\nDetails: ${threat.details}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email alert sent.");
    } catch (err) {
        console.error("Email error:", err);
    }
}

/**
 * Sends a webhook alert to your SIEM, Slack, or other system.
 */
async function sendWebhookAlert(threat) {
    const webhookUrl = "https://your-webhook-url.com/alert"; // Replace with real URL

    try {
        await axios.post(webhookUrl, {
            type: "THREAT_ALERT",
            threat
        });
        console.log("Webhook alert sent.");
    } catch (err) {
        console.error("Webhook error:", err.message);
    }
}

/**
 * Triggers alerts if threat score exceeds threshold.
 */
async function handleThreat(threat) {
    if (threat.riskScore > 20) {
        await sendEmailAlert(threat);
        await sendWebhookAlert(threat);
    } else {
        console.log(`Risk Score ${threat.riskScore} is below alert threshold.`);
    }
}

// Example usage
const threat = {
    ip: "10.0.0.5",
    riskScore: 35,
    details: "Multiple failed login attempts and blacklisted IP"
};

handleThreat(threat);

/** Git Commit Message
Implemented email and webhook alerts for threats with Risk Score > 20 in /src/alert_manager.js

