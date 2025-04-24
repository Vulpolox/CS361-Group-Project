require('dotenv').config({ path: './srv.env' });
console.log("OPENAI_API_KEY from .env:", process.env.OPENAI_API_KEY);

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const os = require('os');

const aiThreatHunting = require('./ai_threat_hunting');
const { fetchOsintData, storeThreatData } = require('./fetch_osint');
const { sendEmailAlert, sendWebhookAlert, handleThreat } = require('./alert_manager');
const { runOsintUpdates, testShodanApi, testRiskAlert, sendAlert } = require('./api_scheduler');
const { blockIp } = require('./blue_team_defense');
const { createCbaResultsTable, logCbaResult, calculateCBA } = require('./cba_analysis');
const { checkEmail } = require('./js_script_example');
const { mapThreatToNIST } = require('./nist_mapper');
const { automatedResponse } = require('./threat_mitigation');
const { prioritizeRisks } = require('./risk_prioritization');
const { analyzeRisk } = require('./risk_analysis');
const { getThreatData } = require('./api_optimizer');
const shodanRoutes = require('./shodan_integration');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// SQLite setup
const dbPath = process.env.DB_PATH || './threat_intel.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Error opening database:", err.message);
  else console.log(`✅ Connected to SQLite database at ${dbPath}`);
});

// Table creation and schema auto-migration
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS threat_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    ports TEXT,
    hostnames TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tva_mapping (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    threat TEXT,
    vulnerability TEXT,
    asset TEXT
  )`);

  // Auto-migrate: Add all additional columns safely
  const columnsToAdd = [
    'asset_id TEXT',
    'threat_name TEXT',
    'vulnerability_description TEXT',
    'likelihood TEXT',
    'impact TEXT'
  ];

  columnsToAdd.forEach(col => {
    const colName = col.split(' ')[0];
    db.run(`ALTER TABLE tva_mapping ADD COLUMN ${col}`, err => {
      if (err && !err.message.includes("duplicate column name")) {
        console.error(`❌ Failed to add column ${colName}:`, err.message);
      } else if (!err) {
        console.log(`✅ Column ${colName} added to tva_mapping.`);
      }
    });
  });

  console.log("✅ Essential tables checked/created.");
});

// Mount routes
app.use('/api', shodanRoutes);

// Existing API routes...
app.get('/api/threats', (req, res) => {
  db.all('SELECT * FROM threat_data', [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching threat data:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    const formatted = rows.map(row => ({
      name: row.ip_address,
      vulnerability: row.hostnames || "N/A",
      risk_score: Math.floor(Math.random() * 100)
    }));
    res.json(formatted);
  });
});

app.get('/api/threat-info/:ip', async (req, res) => {
  try {
    const ip = req.params.ip;
    const data = await getThreatData(ip);
    res.json(data);
  } catch (err) {
    console.error("❌ Error in /api/threat-info:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/threat-hunt', async (req, res) => {
  try {
    const result = await aiThreatHunting.someFunction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/osint', async (req, res) => {
  try {
    const query = req.query.q;
    const data = await fetchOsintData(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-tva', async (req, res) => {
  try {
    const result = await updateTVAMapping(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/prioritize-risks', async (req, res) => {
  try {
    const result = await prioritizeRisks(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analyze-risk', async (req, res) => {
  try {
    const result = await analyzeRisk(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recommend-mitigation', async (req, res) => {
  try {
    const result = await recommendMitigation(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/incident-response', async (req, res) => {
  try {
    const result = await generateIncidentResponsePlan(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
