const mongoose = require('mongoose');

const config = require('./config');

const connectDB = async () => {
	try {
		await mongoose.connect(config.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);
		// Exit the process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
