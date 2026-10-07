const express = require('express');
const { Activity } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/activities (Today's activity)
router.get('/', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let activity = await Activity.findOne({ userId: req.user._id, date: today });
    if (!activity) {
      activity = await Activity.create({
        userId: req.user._id,
        date: today,
        stepGoal: req.user.stepGoal || 10000,
        calorieGoal: req.user.calorieGoal || 500,
      });
    }
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/activities (Log or update steps/activity)
router.post('/', protect, async (req, res) => {
  try {
    const today = req.body.date || new Date().toISOString().split('T')[0];
    const activity = await Activity.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/activities/history (7-day activity history)
router.get('/history', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
