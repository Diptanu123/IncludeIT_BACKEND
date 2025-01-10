const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Add more detailed CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test route - place this before MongoDB connection
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is live!", timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    // Log error but don't exit
    console.error(err);
  });

mongoose.connection.on('error', (err) => {
  console.error("MongoDB Error:", err.message);
});

// Define Schema and Model
const EnrollmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  college: String,
  semester: String,
  batch: String,
  message: String,
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

// API Endpoint
app.post("/api/enroll", async (req, res) => {
  try {
    const enrollmentData = new Enrollment(req.body);
    await enrollmentData.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(400).json({ message: "Error saving registration", error: error.message });
  }
});

// Catch-all route for API
app.all("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found",
    requestedPath: req.path,
    method: req.method
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

module.exports = app;