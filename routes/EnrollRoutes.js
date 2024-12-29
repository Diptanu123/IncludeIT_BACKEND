const express = require('express');
const router = express.Router();
const { createEnrollment } = require('../controllers/EnrollController');

router.post('/enroll', createEnrollment);

module.exports = router;