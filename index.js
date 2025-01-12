const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");


const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: "*",
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => {
  console.error("MongoDB Connection Failed:", err);
  // Don't exit process on Vercel
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err.message);
});

// Routes
app.use("/api", authRoutes);


// Test endpoint
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend is live!" });
// });

// Root endpoint
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the API" });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something broke!", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

module.exports = app;



// For local development only

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app for Vercel
// module.exports = app;