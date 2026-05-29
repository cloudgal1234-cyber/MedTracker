export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `אתה מערכת OCR רפואית. נתח את תמונת אריזת התרופה וחלץ את המידע.
החזר JSON בלבד, בפורמט:
{
  "name": "שם התרופה",
  "purpose": "מה התרופה עושה",
  "expiryDate": "YYYY-MM-DD",
  "storageConditions": "תנאי אחסון"
}
אם שדה לא נמצא, השתמש ב-"לא זוהה".
לתאריך תפוגה: חפש EXP / תפוגה / Use By / Best Before.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
            { text: prompt },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: err });
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text
    .trim()
    .replace(/```json\n?|\n?```/g, '');

  res.status(200).json(JSON.parse(text));
}
