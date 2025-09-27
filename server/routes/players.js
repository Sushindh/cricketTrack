const express = require('express');
const router = express.Router();

// Temporary mock data for players:
const players = [
  { id: '1', name: 'Virat Kohli', country: 'India', role: 'Batsman' },
  { id: '2', name: 'Rohit Sharma', country: 'India', role: 'Batsman' },
  { id: '3', name: 'Babar Azam', country: 'Pakistan', role: 'Batsman' },
  { id: '4', name: 'Kane Williamson', country: 'New Zealand', role: 'Batsman' },
];

// Route: GET /api/players
router.get('/', (req, res) => {
  res.json(players);
});

// Route: GET /api/players/:id/detail (optional)
router.get('/:id/detail', (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({ message: 'Player not found' });
  }
  // Return mock detail
  res.json({
    ...player,
    bio: `Biography of ${player.name}.`,
    matches: 100,
    runs: 4000,
    strikeRate: 135,
    wickets: 5
  });
});

module.exports = router;
