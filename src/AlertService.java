// /src/AlertService.java

import java.sql.*;
import java.time.LocalDateTime;
import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;

public class AlertService {
    private static final String DB_URL = "jdbc:postgresql://localhost:5432/Assigment2";
    private static final String WEBHOOK_URL = "https://webhook.site/ae61a75a-48bb-435a-a291-27a5864c9322";

    public static void sendEmailAlert(String threat, int riskScore) {
        final String from = "alerts@shopsmart.com";
        final String to = "admin@shopsmart.com";
        final String username = "your-email";
        final String password = "your-password";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.your-email.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
            new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject("Critical Cybersecurity Alert");
            message.setText("High-Risk Threat Detected: " + threat + " with Risk Score " + riskScore);
            Transport.send(message);
            System.out.println("? Email alert sent.");
        } catch (MessagingException e) {
            System.out.println("? Email sending failed: " + e.getMessage());
        }
    }

    public static void sendWebhookAlert(String threat, int riskScore) {
        try {
            URL url = new URL(WEBHOOK_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String jsonPayload = String.format("{\"threat\": \"%s\", \"risk_score\": %d}", threat, riskScore);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();
            if (status == 200 || status == 204) {
                System.out.println("? Webhook alert sent.");
            } else {
                System.out.println("? Webhook failed with status: " + status);
            }
        } catch (Exception e) {
            System.out.println("? Webhook error: " + e.getMessage());
        }
    }

    public static void logAlert(String threat, int riskScore) {
        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            String sql = "INSERT INTO alerts (threat, risk_score, timestamp) VALUES (?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, threat);
            pstmt.setInt(2, riskScore);
            pstmt.setString(3, LocalDateTime.now().toString());
            pstmt.executeUpdate();
            System.out.println("? Alert logged to database.");
        } catch (SQLException e) {
            System.out.println("? DB error: " + e.getMessage());
        }
    }

    public static void handleThreat(String threat, int riskScore) {
        if (riskScore > 20) {
            sendEmailAlert(threat, riskScore);
            sendWebhookAlert(threat, riskScore);
            logAlert(threat, riskScore);
        } else {
            System.out.println("?? Risk score too low, no alert triggered.");
        }
    }

    public static void main(String[] args) {
        handleThreat("SQL Injection", 25);
    }
}