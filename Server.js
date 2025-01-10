const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
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
    res.status(400).json({ message: "Error saving registration", error });
  }
});

// Default Route for Testing
app.get("/", (req, res) => {
  res.send("Backend is live!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // For Vercel
