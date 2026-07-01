// controllers/summarizeController.js
import axios from "axios";

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// @desc    Generate a summary for a YouTube video
// @route   POST /api/summarize
// @access  Protected
export const generateSummary = async (req, res) => {
  try {
    const { url, transcript } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });

    let fullTranscript = '';

    if (transcript && transcript.trim().length > 0) {
      fullTranscript = transcript.trim();
    } else {
      const videoId = extractVideoId(url);
      if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

      try {
        const transcriptResponse = await axios.get('https://api.supadata.ai/v1/youtube/transcript', {
          headers: { 'x-api-key': process.env.SUPADATA_API_KEY },
          params: { url: url, text: true }
        });
        fullTranscript = transcriptResponse.data.content;
      } catch (err) {
        return res.status(400).json({ error: 'Could not fetch transcript automatically. Please paste the transcript manually.' });
      }

      if (!fullTranscript) return res.status(400).json({ error: 'Could not fetch transcript.' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const prompt = `You are a helpful assistant. Given the following YouTube video transcript, provide the response EXCLUSIVELY as a valid JSON object. Do NOT wrap it in markdown block quotes. The JSON must have exactly this structure:
{
  "tldr": "A one-line TLDR",
  "summary": "A concise summary (3-5 sentences)",
  "takeaways": ["takeaway 1", "takeaway 2"]
}
Transcript: ${fullTranscript}`;

    const response = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const geminiResponseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let parsedData;
    try {
      const cleanedText = geminiResponseText.replace(/```json/i, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseErr) {
      parsedData = { tldr: '', summary: geminiResponseText, takeaways: [] };
    }

    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};
