const express = require('express');
const { Sleep } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/sleep
router.get('/', protect, async (req, res) => {
  try {
    const sleepLogs = await Sleep.find({ userId: req.user._id }).sort({ date: -1 }).limit(14);
    res.json(sleepLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/sleep
router.post('/', protect, async (req, res) => {
  try {
    const today = req.body.date || new Date().toISOString().split('T')[0];
    const sleep = await Sleep.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(sleep);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
