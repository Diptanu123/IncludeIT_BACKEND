const Enrollment = require('../models/Enrollment');


const createEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createEnrollment };
