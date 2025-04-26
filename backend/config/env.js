const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../srv.env') });

// Log environment variables for debugging
console.log("Environment loaded from:", path.resolve(__dirname, '../srv.env'));
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Set" : "Not set");

module.exports = process.env; 