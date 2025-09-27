const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
});

// Create alert
router.post('/', auth, async (req, res) => {
  try {
    const { matchId, alertType, message, triggerTime } = req.body;

    const alert = new Alert({
      userId: req.userId,
      matchId,
      alertType,
      message,
      triggerTime: new Date(triggerTime)
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create alert', error: error.message });
  }
});

// Delete alert
router.delete('/:alertId', auth, async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const deleted = await Alert.findOneAndDelete({
      _id: alertId,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete alert', error: error.message });
  }
});

module.exports = router;
