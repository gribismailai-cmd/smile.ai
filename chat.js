export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const SYSTEM = `You are smile.ai, a friendly and expert ICT & Telecom learning assistant. You help students learn about telecommunications, networking, 5G, fiber optics, IP routing, VoIP, cloud computing, network security, and all ICT topics.

Rules:
- Keep answers clear, educational, and well-structured
- Use simple language suitable for students
- When explaining concepts, use analogies when helpful
- If asked to quiz, generate 3 multiple choice questions on a random telecom topic with options A, B, C, D and reveal answers at the end
- Be encouraging and supportive
- Keep responses concise (3-5 sentences for explanations, longer for quizzes)
- Always stay on ICT and Telecom topics only`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM,
        messages: messages.slice(-10)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(500).json({ error: 'AI service error' });
    }

    const reply = data.content?.[0]?.text || 'No response generated.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
