const express = require('express');
const router = express.Router();
const User = require('../models/User');

// done & tested
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  user = new User({ username, email, password });

  await user.save();

  req.session.user = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  res.cookie('connect.sid', req.sessionID, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false, // set this to true in production
  });

  res.status(201).json({ user: req.session.user });
});

// done & tested
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  req.session.user = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  res.cookie('connect.sid', req.sessionID, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false, // set this to true in production
  });

  res.status(200).json({ user: req.session.user });
});

// done & tested
router.post('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ msg: 'Error logging out' });
      }

      res.clearCookie('connect.sid', { path: '/' });

      return res.status(200).json({ msg: 'Logged out successfully' });
    });
  } else {
    return res.status(400).json({ msg: 'No active session found' });
  }
});

module.exports = router;
