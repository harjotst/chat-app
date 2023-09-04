const express = require('express');

const { sessionConfig } = require('./redis');

const corsConfig = require('./cors');

const authRoutes = require('../routes/auth');

const roomRoutes = require('../routes/room/room');

const messagesRoutes = require('../routes/room/messages');

const userRoutes = require('../routes/user');

const expressApp = express();

expressApp.use(express.json());

expressApp.use(sessionConfig);

expressApp.use(corsConfig);

expressApp.use('/api/auth', authRoutes);

expressApp.use('/api/room', roomRoutes);

expressApp.use('/api/room', messagesRoutes);

expressApp.use('/api/user', userRoutes);

module.exports = expressApp;
