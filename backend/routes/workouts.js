const express = require('express');
const { Workout } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/workouts
router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts
router.post('/', protect, async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/workouts/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
