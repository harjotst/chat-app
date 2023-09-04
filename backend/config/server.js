const http = require('http');

const expressApp = require('../config/express');

const httpServer = http.createServer(expressApp);

module.exports = httpServer;
