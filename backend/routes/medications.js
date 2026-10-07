const express = require('express');
const { Medication } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/medications
router.get('/', protect, async (req, res) => {
  try {
    const meds = await Medication.find({ userId: req.user._id });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/medications
router.post('/', protect, async (req, res) => {
  try {
    const med = await Medication.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/medications/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/medications/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Medication.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Medication removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
