const express = require('express');
const router = express.Router();
const User = require('../models/User');

// done & tested
router.post('/register', async (req, res) => {
  const { username, email, password, preferredLanguage } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      msg: `A user with email '${email}' already exists. Please use another email.`,
    });
  }

  user = new User({ username, email, password, preferredLanguage });

  await user.save();

  req.session.user = {
    id: user._id,
    name: user.username,
    email: user.email,
    preferredLanguage,
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
    name: user.username,
    email: user.email,
    pfp: user.profilePicture,
    preferredLanguage: user.preferredLanguage,
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

// done & tested
router.get('/validate-session', (req, res) => {
  const sessionId = req.sessionID;

  req.sessionStore.get(sessionId, (err, session) => {
    if (err || !session) {
      return res.status(401).json({ msg: 'Invalid session' });
    }

    return res.status(200).json({ msg: 'Valid session', user: session.user });
  });
});

module.exports = router;
