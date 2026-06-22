const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { getSubtitles } = require('youtube-captions-scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

app.get('/', (req, res) => {
  res.send('YouTube Summarizer API is running');
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { url, transcript } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    let fullTranscript = '';

    if (transcript && transcript.trim().length > 0) {
      fullTranscript = transcript.trim();
    } else {
      const videoId = extractVideoId(url);
      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      // Fetch transcript
      let transcriptItems;
      try {
        transcriptItems = await getSubtitles({
          videoID: videoId,
          lang: 'en'
        });
      } catch (err) {
        console.error('Transcript Error:', err.message);
        return res.status(404).json({ error: 'Could not fetch transcript automatically. The video might not have captions or is restricted. Please paste the transcript manually.' });
      }

      if (!transcriptItems || transcriptItems.length === 0) {
        return res.status(404).json({ error: 'Transcript is empty. Please paste the transcript manually.' });
      }

      // Concatenate all transcript text
      fullTranscript = transcriptItems.map(item => item.text).join(' ');
    }

    // Prepare request to Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const prompt = `You are a helpful assistant. Given the following YouTube video transcript, provide the response EXCLUSIVELY as a valid JSON object. Do NOT wrap it in markdown block quotes. The JSON must have exactly this structure:
{
  "tldr": "A one-line TLDR",
  "summary": "A concise summary (3-5 sentences)",
  "takeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4", "takeaway 5"]
}

Transcript: ${fullTranscript}`;

    try {
      const response = await axios.post(geminiUrl, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Extract Gemini response text
      const geminiResponseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!geminiResponseText) {
        throw new Error('Unexpected response format from Gemini API');
      }

      let parsedData;
      try {
        const cleanedText = geminiResponseText.replace(/```json/i, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanedText);
        parsedData.raw = geminiResponseText;
      } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr);
        // Fallback
        parsedData = { tldr: '', summary: geminiResponseText, takeaways: [], raw: geminiResponseText };
      }

      res.json(parsedData);
    } catch (apiError) {
      console.error('Gemini API Error:', apiError?.response?.data || apiError.message);
      res.status(500).json({ error: 'Failed to generate summary from Gemini API' });
    }

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
