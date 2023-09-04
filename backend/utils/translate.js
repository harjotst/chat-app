const axios = require('axios');

const translateMessage = async (
  originalMessage,
  originalLanguage,
  targetLanguage
) => {
  try {
    const response = await axios.post('http://localhost:6000/translate', {
      q: originalMessage,
      source: originalLanguage,
      target: targetLanguage,
    });

    return response.data.translatedText;
  } catch (error) {
    console.error(error);
    
    throw error;
  }
};

module.exports = { translateMessage };
