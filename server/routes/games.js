// server/routes/games.js

const express = require('express');
const router = express.Router();
const Game = require('../models/game'); // Import Game model

// Create a new game
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    const newGame = new Game({ player1: username });
    await newGame.save();

    res.status(201).json({ gameId: newGame._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific game by ID
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a game
router.patch('/:gameId/join', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    const game = await Game.findById(req.params.gameId);

    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.status !== 'Open') return res.status(400).json({ message: 'Game is not open for joining' });
    if (game.player2) return res.status(400).json({ message: 'Game already has a second player' });

    game.player2 = username;
    game.status = 'Active';
    game.updatedAt = new Date();

    await game.save();

    res.json({ message: 'Joined game successfully', gameId: game._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Games API is working!' });
});

module.exports = router;
