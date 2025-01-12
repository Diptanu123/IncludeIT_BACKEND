const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  userid: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  college: { 
    type: String, 
    required: true 
  },
  semester: { 
    type: String, 
    required: true 
  },
  batch: { 
    type: String, 
    required: true 
  },
  message: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

module.exports = Enrollment;