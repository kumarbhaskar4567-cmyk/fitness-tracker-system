const express = require('express');
const { StressLog } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/stress
router.get('/', protect, async (req, res) => {
  try {
    const logs = await StressLog.find({ userId: req.user._id }).sort({ date: -1 }).limit(14);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/stress
router.post('/', protect, async (req, res) => {
  try {
    const today = req.body.date || new Date().toISOString().split('T')[0];
    const log = await StressLog.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
