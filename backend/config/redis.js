const RedisStore = require('connect-redis').default;
const session = require('express-session');
const redis = require('redis');
const config = require('../config/config');

const redisClient = redis.createClient({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  // password: config.REDIS_SECRET,
  retry_strategy: function (options) {
    if (options.attempt > 10) {
      // End reconnecting after a specific number of tries and flush all commands with a individual error
      return undefined;
    }
    // Reconnect after this time
    return Math.min(options.attempt * 100, 3000);
  },
});

redisClient.connect().then(() => {
  console.log('Connected to Redis.')
}).catch(console.error);

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'chat-app:',
});

const sessionConfig = session({
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  secret: require('./config').REDIS_SECRET,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true },
});

module.exports = { redisClient, sessionConfig };
