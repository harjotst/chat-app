const axios = require('axios');

const LIBRETRANSLATE_HOST = process.env.LIBRETRANSLATE_HOST;
const LIBRETRANSLATE_PORT = process.env.LIBRETRANSLATE_PORT;

const translateMessage = async (
  originalMessage,
  originalLanguage,
  targetLanguage
) => {
  try {
    const response = await axios.post(
      `http://${LIBRETRANSLATE_HOST}:${LIBRETRANSLATE_PORT}/translate`,
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
