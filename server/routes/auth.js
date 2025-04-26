// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// create user and set up cookie
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    const user = new User({ username, password });
    await user.save();

    res.cookie('user', user.username, { httpOnly: true });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// log in and authicate 
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.cookie('user', user.username, { httpOnly: true });
    res.json({ message: 'Login successful',
        username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// log out and clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.json({ message: 'Logged out successfully' });
});

// return current user
router.get('/me', (req, res) => {
  const username = req.cookies.user;

  if (!username) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  res.json({ username });
});

module.exports = router;
