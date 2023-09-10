const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_SECRET: process.env.REDIS_SECRET,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_PUBLIC_BUCKET: process.env.AWS_PUBLIC_BUCKET,
  AWS_PRIVATE_BUCKET: process.env.AWS_PRIVATE_BUCKET,
  LIBRETRANSLATE_HOST: process.env.LIBRETRANSLATE_HOST,
  LIBRETRANSLATE_PORT: process.env.LIBRETRANSLATE_PORT,
};

module.exports = config;
