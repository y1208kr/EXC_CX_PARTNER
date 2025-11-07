// 이 파일은 Vercel/Netlify 프로젝트의 /api/generateContent.js 경로에 위치해야 합니다.
// (Vercel/Netlify의 환경 변수에 'GEMINI_API_KEY'라는 이름으로 실제 API 키를 저장해야 합니다.)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY; // 환경 변수에서 안전하게 키 로드
  if (!apiKey) {
      return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = { 
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ "google_search": {} }] 
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Google API Error:', errorBody);
      return res.status(geminiResponse.status).json({ error: 'Failed to fetch from Google API.', details: errorBody });
    }

    const result = await geminiResponse.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Invalid response structure from Google API.' });
    }

    // 클라이언트(HTML)에는 { text: "..." } 형태의 JSON만 반환
    res.status(200).json({ text: text });

  } catch (error) {
    console.error('Proxy internal error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}