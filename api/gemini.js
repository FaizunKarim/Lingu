export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API Key for Gemini is not configured on the server.' });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
       return res.status(geminiResponse.status).json(geminiData);
    }

    res.status(200).json(geminiData);

  } catch (error) {
    res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
  }
}
