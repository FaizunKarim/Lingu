import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN is not configured.' });
  }

  try {
    const { messages } = req.body;

    const systemPrompt = messages.shift().parts[0].text;

    const history = messages.map(msg => {
        if (msg.role === 'user') return `User: ${msg.parts[0].text}`;
        if (msg.role === 'model') return `Assistant: ${msg.parts[0].text}`;
        return '';
    }).join('\n');

    const finalPrompt = `${systemPrompt}\n\n${history}\nAssistant:`;

    const model = 'ibm-granite/granite-3.3-8b-instruct:601ff87e6afa76bd7bdbf8292ea250d70b0ad2ddedc17c236e7fa3fe38a374a8';
    const input = {
        prompt: finalPrompt,
        max_tokens: 512,
        temperature: 0.7,
    };

    const output = await replicate.run(model, { input });

    const responseText = Array.isArray(output) ? output.join('') : String(output);
    res.status(200).json({ text: responseText });

  } catch (error) {
    console.error('Error calling Replicate API:', error);
    res.status(500).json({ error: `Replicate API error: ${error.message}` });
  }
}