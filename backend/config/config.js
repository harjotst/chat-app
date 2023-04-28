const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_SECRET: process.env.REDIS_SECRET,
  REDIS_URL: process.env.REDIS_URL,
};

module.exports = config;
