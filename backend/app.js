const httpServer = require('./config/server');

const config = require('./config/config');

const connectDB = require('./config/db');

const initiateSockets = require('./config/socket');

connectDB();

initiateSockets();

httpServer.listen(config.PORT, () => {
	console.log(`Server running on port ${config.PORT}`);
});
