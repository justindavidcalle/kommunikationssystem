const express = require('express');
const router = express.Router();
const Chat = require('../models/chatmodel');

// Send a chat message
router.post('/send', async (req, res) => {
  try {
    const { fromUsername, toUsername, text } = req.body;

    if (!fromUsername || !toUsername || !text) {
      return res.status(400).json({ error: 'Please provide fromUsername, toUsername, and text' });
    }

    const newChatMessage = new Chat({
      fromUsername,
      toUsername,
      text,
    });

    const savedChatMessage = await newChatMessage.save();

    res.json(savedChatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Retrieve chat messages between two users
router.get('/retrieve', async (req, res) => {
  try {
    const { fromUsername, toUsername } = req.query;

    if (!fromUsername || !toUsername) {
      return res.status(400).json({ error: 'Please provide fromUsername and toUsername' });
    }

    const chatMessages = await Chat.find({
      $or: [
        { fromUsername, toUsername },
        { fromUsername: toUsername, toUsername: fromUsername },
      ],
    }).sort({ timestamp: 1 });

    res.json(chatMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
