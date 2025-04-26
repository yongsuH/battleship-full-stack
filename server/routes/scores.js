const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username wins losses');
    let scores = users.map(user => ({
      username: user.username,
      wins: user.wins,
      losses: user.losses
    }));

    scores.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return a.username.localeCompare(b.username);
    });

    res.json(scores);
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
