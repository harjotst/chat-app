const express = require('express');

const config = require('./config/config');

const connectDB = require('./config/db');

const { sessionConfig } = require('./config/redis');

const authRoutes = require('./routes/auth');

const roomRoutes = require('./routes/room/room');

const messagesRoutes = require('./routes/room/messages');

const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use(sessionConfig);

connectDB();

app.use('/api/auth', authRoutes);

app.use('/api/room', roomRoutes);

app.use('/api/room', messagesRoutes);

app.use('/api/user', userRoutes);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
