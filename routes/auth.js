const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Enrollment = require("../models/Enrollment");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Simplified response utility function
const createResponse = (status, message, data = null) => ({ 
  status, 
  message,
  data 
});

// Register Route
router.post("/enroll", async (req, res) => {
  try {
    const { password, userid, email, ...otherData } = req.body;

    // Input validation
    if (!userid || !password || !email) {
      return res.status(400).json(createResponse(
        false, 
        "UserID, password, and email are required"
      ));
    }

    // Check if user already exists
    const existingUser = await Enrollment.findOne({
      $or: [
        { userid: userid.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json(createResponse(
          false,
          "This email is already registered"
        ));
      }
      if (existingUser.userid === userid.toLowerCase()) {
        return res.status(400).json(createResponse(
          false,
          "This User ID is already registered"
        ));
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new Enrollment({
      ...otherData,
      userid: userid.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json(createResponse(
      true,
      "Registration successful!"
    ));
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json(createResponse(
      false,
      "An unexpected error occurred. Please try again later."
    ));
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { userid, password } = req.body;

    if (!userid || !password) {
      return res.status(400).json(createResponse(
        false,
        "UserID and password are required"
      ));
    }

    const user = await Enrollment.findOne({ 
      userid: userid.toLowerCase() 
    });

    if (!user) {
      return res.status(401).json(createResponse(
        false,
        "Invalid User ID or password"
      ));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(createResponse(
        false,
        "Invalid User ID or password"
      ));
    }

    const token = jwt.sign(
      {
        id: user._id,
        userid: user.userid,
        email: user.email,
        college:user.college
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json(createResponse(
      true,
      "Login successful",
      {
        token,
        userData: {
          userid: user.userid,
          email: user.email,
          name: user.name,
          college:user.college
        }
      }
    ));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(createResponse(
      false,
      "An unexpected error occurred. Please try again later."
    ));
  }
});

// Protected Route
// Protected Route
router.get("/protected", verifyToken, async (req, res) => {
  try {
    const user = await Enrollment.findById(req.user.id)
      .select("-password");  // Exclude password from the response

    if (!user) {
      return res.status(404).json(createResponse(
        false,
        "User not found"
      ));
    }

    return res.json(createResponse(
      true,
      "Data retrieved successfully",
      user
    ));
  } catch (error) {
    console.error("Protected route error:", error);
    return res.status(500).json(createResponse(
      false,
      "An unexpected error occurred. Please try again later."
    ));
  }
});


module.exports = router;