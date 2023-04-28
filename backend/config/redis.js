const RedisStore = require('connect-redis').default;
const session = require('express-session');
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.connect().catch(console.error);

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
