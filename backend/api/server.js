const env = require('../config/env');
require('dotenv').config({ path: '../../srv.env' });
console.log("OPENAI_API_KEY from .env:", process.env.OPENAI_API_KEY);

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const aiThreatHunting = require('./ai_threat_hunting');
const { fetchOsintData } = require('./fetch_osint');
const { prioritizeRisks } = require('./risk_prioritization');
const { analyzeRisk } = require('./risk_analysis');
const { getThreatData } = require('./api_optimizer');
const shodanRoutes = require('./shodan_integration');

const app = express();
const port = 3000;

// CORS for React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

const path = require('path');

// Absolute path resolution
const dbPath = path.resolve(__dirname, '../../db/threat_intel.db');

console.log(`📁 Using absolute SQLite DB path: ${dbPath}`);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) {
    console.error("❌ SQLite connection error:", err.message);
  } else {
    console.log(`✅ Successfully connected to SQLite at ${dbPath}`);
  }
});

// Basic route for the API
app.get('/', (req, res) => {
    res.send('Threat Intelligence Platform API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
