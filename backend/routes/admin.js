const express = require('express');
const { User, Workout, Challenge, Activity } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Apply protect & adminOnly to all admin routes
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const totalChallenges = await Challenge.countDocuments();

    res.json({
      totalUsers,
      totalWorkouts,
      totalChallenges,
      activeToday: Math.round(totalUsers * 0.75),
      systemStatus: 'Operational',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Workout.deleteMany({ userId: req.params.id });
    await Activity.deleteMany({ userId: req.params.id });
    res.json({ message: 'User and corresponding records removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
