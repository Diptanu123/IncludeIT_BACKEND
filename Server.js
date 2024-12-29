const dotenv = require("dotenv");
dotenv.config(); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Use built-in express JSON parser

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('MongoDB Connection Failed:', err);
    process.exit(1); // Exit process if MongoDB connection fails
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

// API Endpoint for Form Submission
app.post("/api/enroll", async (req, res) => {
  try {
    const enrollmentData = new Enrollment(req.body);
    await enrollmentData.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(400).json({ message: "Error saving registration", error });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
