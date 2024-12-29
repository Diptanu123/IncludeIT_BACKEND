const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  semester: { type: String, required: true },
  batch: { type: String, required: true },
  message: { type: String },
  date: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

module.exports = Enrollment;
