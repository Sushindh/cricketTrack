const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET favorites for user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ error: "Error fetching favorites" });
  }
});

// ADD favorite
router.post("/add", async (req, res) => {
  const { userId, favorite } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.favorites.some(f =>
      f.itemId === favorite.itemId && f.type === favorite.type
    )) {
      user.favorites.push(favorite);
      await user.save();
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("ADD FAVORITE ERROR", err); // For debug
    res.status(500).json({ error: "Error adding favorite" });
  }
});

// REMOVE favorite
router.post("/remove", async (req, res) => {
  const { userId, favoriteId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.favorites = user.favorites.filter(f => f.itemId !== favoriteId);
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "Error removing favorite" });
  }
});

module.exports = router;
