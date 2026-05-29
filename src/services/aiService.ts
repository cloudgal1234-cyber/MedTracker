import { ExtractedMedicationData } from '../types/medication';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function extractMedicationData(
  imageBase64: string,
  apiKey: string
): Promise<ExtractedMedicationData> {
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

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
          },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  });

  if (!response.ok) throw new Error(`שגיאת API: ${response.status}`);

  const data = await response.json();
  const text = data.content[0].text.trim().replace(/```json\n?|\n?```/g, '');
  return JSON.parse(text) as ExtractedMedicationData;
}
