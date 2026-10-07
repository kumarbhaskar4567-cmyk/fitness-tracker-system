const express = require('express');
const { HealthMetric } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/health
router.get('/', protect, async (req, res) => {
  try {
    const metrics = await HealthMetric.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/health
router.post('/', protect, async (req, res) => {
  try {
    const { weight } = req.body;
    const heightM = (req.user.height || 175) / 100;
    const bmi = weight ? Number((weight / (heightM * heightM)).toFixed(1)) : 22.0;

    const metric = await HealthMetric.create({
      ...req.body,
      bmi,
      userId: req.user._id,
      date: req.body.date || new Date().toISOString().split('T')[0],
    });
    res.status(201).json(metric);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
