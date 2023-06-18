const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_SECRET: process.env.REDIS_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_PUBLIC_BUCKET: process.env.AWS_PUBLIC_BUCKET,
  AWS_PRIVATE_BUCKET: process.env.AWS_PRIVATE_BUCKET,
};

module.exports = config;
