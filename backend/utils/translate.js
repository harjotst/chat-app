const axios = require('axios');

const config = require('../config/config');

const translateMessage = async (originalMessage, originalLanguage, targetLanguage) => {
	try {
		const response = await axios.post(
			`http://${config.LIBRETRANSLATE_HOST}:${config.LIBRETRANSLATE_PORT}/translate`,
			{
				q: originalMessage,
				source: originalLanguage,
				target: targetLanguage,
			}
		);

		return response.data.translatedText;
	} catch (error) {
		console.error(error);

		throw error;
	}
};

module.exports = { translateMessage };
