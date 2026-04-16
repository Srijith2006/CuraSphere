const express = require('express');
const router = express.Router();

// Basic Test Route
router.get('/test', (req, res) => {
    res.json({ message: "Patient route is working!" });
});

// ✅ THIS IS THE MOST IMPORTANT LINE
module.exports = router;