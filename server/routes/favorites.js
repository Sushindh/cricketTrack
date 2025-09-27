const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all favorites for a user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
});

// Add to favorites
router.post('/', async (req, res) => {
  try {
    const { userId, itemId, type, title, data } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.favorites.some(f => f.itemId === itemId && f.type === type);
    if (exists) return res.status(400).json({ message: 'Already in favorites' });

    user.favorites.push({ itemId, type, title, data });
    await user.save();
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add favorite', error: error.message });
  }
});

// Remove from favorites
router.delete('/:userId/:itemId/:type', async (req, res) => {
  try {
    const { userId, itemId, type } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(f => !(f.itemId === itemId && f.type === type));
    if (user.favorites.length === initialLength)
      return res.status(404).json({ message: 'Favorite not found' });

    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favorite', error: error.message });
  }
});

module.exports = router;
