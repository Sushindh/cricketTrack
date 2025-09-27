const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const TrackerResult = require('../models/TrackerResult'); // Define this model as shown below

// Setup Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { query, userId } = req.body;
  try {
    // Generate answer from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const geminiRes = await model.generateContent(query);
    const answer = geminiRes.response.text();

    // Save to DB
    const saved = await TrackerResult.create({
      userId,
      query,
      answer,
      createdAt: new Date()
    });

    res.json({ result: answer, tracker: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tracker error' });
  }
});

// [Optional] Get all trackers for a user (for recommendations)
router.get('/:userId', async (req, res) => {
  const results = await TrackerResult.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(results);
});

module.exports = router;
