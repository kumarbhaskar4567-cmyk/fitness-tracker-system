const express = require('express');
const { Nutrition } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/nutrition/today
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let record = await Nutrition.findOne({ userId: req.user._id, date: today });
    if (!record) {
      record = await Nutrition.create({
        userId: req.user._id,
        date: today,
        calorieTarget: req.user.calorieGoal ? req.user.calorieGoal * 4 : 2200,
        waterTargetCups: req.user.waterGoalCups || 10,
        meals: [],
      });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/nutrition/meal
router.post('/meal', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let record = await Nutrition.findOne({ userId: req.user._id, date: today });
    if (!record) {
      record = await Nutrition.create({
        userId: req.user._id,
        date: today,
        meals: [req.body],
      });
    } else {
      record.meals.push(req.body);
      await record.save();
    }
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/nutrition/water
router.put('/water', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { waterCups } = req.body;
    const record = await Nutrition.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $set: { waterCups } },
      { new: true, upsert: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
