const axios = require('axios');
require('dotenv').config();

async function test() {
  try {
    const key = process.env.GEMINI_API_KEY;
    console.log('Using key:', key);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await axios.get(geminiUrl);
    console.log('Available models:', response.data.models.map(m => m.name));
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
  }
}

test();
