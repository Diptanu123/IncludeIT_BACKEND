const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Export the Express app
module.exports = app;