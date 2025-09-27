const express = require('express');
const { getLiveMatches, getMatchSchedule, getMatchDetails } = require('../services/cricketAPI');
const auth = require('../middleware/auth');

const router = express.Router();

// Get live matches
router.get('/live', async (req, res) => {
  try {
    const matches = await getLiveMatches();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch live matches', error: error.message });
  }
});

// Get match schedule
router.get('/schedule', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const schedule = await getMatchSchedule(days);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schedule', error: error.message });
  }
});

// Get match details
router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const matchDetails = await getMatchDetails(matchId);
    res.json(matchDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch match details', error: error.message });
  }
});

module.exports = router;
