// routes/favorites.js
const express = require('express');
const router = express.Router();

// Temporary in-memory storage (replace with MongoDB later)
let favorites = [];

// Get all favorites
router.get('/', (req, res) => {
  try {
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
});

// Add to favorites
router.post('/', (req, res) => {
  try {
    const { itemId, type, title, data } = req.body;
    
    // Check if already exists
    const existingIndex = favorites.findIndex(f => f.itemId === itemId && f.type === type);
    
    if (existingIndex !== -1) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = {
      id: Date.now().toString(),
      itemId,
      type,
      title,
      data,
      createdAt: new Date().toISOString()
    };

    favorites.push(favorite);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add favorite', error: error.message });
  }
});

// Remove from favorites
router.delete('/:itemId/:type', (req, res) => {
  try {
    const { itemId, type } = req.params;
    
    const initialLength = favorites.length;
    favorites = favorites.filter(f => !(f.itemId === itemId && f.type === type));
    
    if (favorites.length === initialLength) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favorite', error: error.message });
  }
});

module.exports = router;
