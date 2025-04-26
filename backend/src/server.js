// Import centralized environment variables
const env = require('./config/env');

// Import other dependencies
const express = require('express');
const cors = require('cors');

// Import centralized database connection
const db = require('./database/db');

// Import route handlers
const aiThreatHunting = require('./ai_threat_hunting');
const { fetchOsintData } = require('./fetch_osint');
const { prioritizeRisks } = require('./risk_prioritization');
const { analyzeRisk } = require('./risk_analysis');
const { getThreatData } = require('./api_optimizer');
const shodanRoutes = require('./shodan_integration');

const app = express();

// CORS for React frontend
app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// DB setup
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

  const extraCols = ['asset_id', 'threat_name', 'vulnerability_description', 'likelihood', 'impact'];
  extraCols.forEach(col => {
    db.run(`ALTER TABLE tva_mapping ADD COLUMN ${col} TEXT`, err => {
      if (err && !err.message.includes("duplicate column name")) {
        console.error(`❌ Couldn't add column ${col}:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${col}`);
      }
    });
  });

  console.log("✅ Tables checked or created");
});

// Root route (important for ZAP)
app.get('/', (req, res) => {
  res.send('✅ Server is running. Try /api/threats.');
});

// API Routes
app.use('/api', shodanRoutes);

// Get Threats
app.get('/api/threats', (req, res) => {
  db.all('SELECT * FROM threat_data', [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const data = rows.map(row => ({
      name: row.ip_address,
      vulnerability: row.hostnames || 'N/A',
      risk_score: Math.floor(Math.random() * 100),
    }));
    res.json(data);
  });
});

// Get Threat Info (OSINT)
app.get('/api/threat-info/:ip', async (req, res) => {
  try {
    const data = await getThreatData(req.params.ip);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch OSINT with query
app.get('/api/osint', async (req, res) => {
  try {
    const query = req.query.q;
    const data = await fetchOsintData(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Threat Hunt
app.post('/api/threat-hunt', async (req, res) => {
  try {
    const result = await aiThreatHunting.someFunction(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prioritize Risks
app.post('/api/prioritize-risks', async (req, res) => {
  try {
    const result = await prioritizeRisks(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze Risk
app.post('/api/analyze-risk', async (req, res) => {
  try {
    const result = await analyzeRisk(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TVA Mapping
app.get('/api/tva', (req, res) => {
  db.all('SELECT * FROM tva_mapping', [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching TVA mappings:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Alerts Viewer
app.get('/api/alerts', (req, res) => {
  db.all('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching alerts:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Manual Alert Trigger
app.post('/api/alert-threat', (req, res) => {
  const { ip, riskScore, details } = req.body;

  if (!ip || !riskScore || !details) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO alerts (message, level) VALUES (?, ?)`,
    [`Alert: ${details} from ${ip}`, riskScore > 70 ? "High" : "Medium"],
    err => {
      if (err) {
        console.error("❌ Error inserting alert:", err.message);
        return res.status(500).json({ error: "Failed to store alert" });
      }
      console.log(`✅ Alert triggered for IP: ${ip}`);
      res.json({ status: "Alert triggered successfully" });
    }
  );
});

// ZAP Scan Compatibility
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Fallback
app.use((req, res) => {
  res.status(200).send("✅ Route handled (fallback)");
});

// Start server
const PORT = env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
