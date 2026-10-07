const express = require('express');
const { Challenge } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/challenges
router.get('/', protect, async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('participants', 'name avatar');
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/challenges
router.post('/', protect, async (req, res) => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      participants: [req.user._id],
    });
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/challenges/:id/join
router.post('/:id/join', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    if (!challenge.participants.includes(req.user._id)) {
      challenge.participants.push(req.user._id);
      await challenge.save();
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
