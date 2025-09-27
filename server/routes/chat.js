const express = require('express');
const { generateResponse, generatePrediction } = require('../services/geminiAI');
const { getMatchDetails } = require('../services/cricketAPI');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const cricketPrompt = `You are a cricket expert assistant. Please provide helpful and accurate information about cricket. User question: ${message}`;
    const response = await generateResponse(cricketPrompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate response', error: error.message });
  }
});

router.post('/prediction', async (req, res) => {
  try {
    const { matchId, message } = req.body;
    if (!matchId || !message) {
      return res.status(400).json({ message: 'Match ID and message are required' });
    }
    const matchData = await getMatchDetails(matchId);
    const prediction = await generatePrediction(matchData, message);
    res.json({ response: prediction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate prediction', error: error.message });
  }
});

router.post('/recommendations', async (req, res) => {
  try {
    const { favorites } = req.body;
    if (!favorites || favorites.length === 0) {
      return res.json({ recommendations: [] });
    }
    const prompt = `Based on these cricket favorites: ${JSON.stringify(favorites.slice(0, 5))}, provide 3 personalized recommendations for cricket content, matches to watch, or players to follow. Format as JSON array with title and description fields.`;
    const response = await generateResponse(prompt);
    try {
      const recommendations = JSON.parse(response);
      res.json({ recommendations });
    } catch {
      res.json({
        recommendations: [
          {
            title: "Personalized Cricket Content",
            description: response.substring(0, 200) + "..."
          }
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
  }
});

module.exports = router;
