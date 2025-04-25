const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Path to the SQLite database file
const dbPath = process.env.DB_PATH || path.join(__dirname, 'threat_management.db');

// Open a connection to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Successfully connected to the SQLite database');
  }
});

// Exporting the database connection and utility function for queries
module.exports = {
  // Function to run queries
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  // Close the connection (optional cleanup)
  close: () => {
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      } else {
        console.log('SQLite connection closed');
      }
    });
  }
};
