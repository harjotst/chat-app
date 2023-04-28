const express = require('express');

const config = require('./config/config');

const connectDB = require('./config/db');

const { sessionConfig } = require('./config/redis');

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

app.use(sessionConfig);

connectDB();

app.use('/api/auth', authRoutes);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
