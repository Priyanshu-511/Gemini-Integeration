const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config()

const API_KEY = process.env.API_KEY;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/ask', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ response: aiReply });

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: 'AI API request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
