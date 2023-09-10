const cors = require('cors');

const config = require('./config');

module.exports = cors({
  origin: `http://${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
