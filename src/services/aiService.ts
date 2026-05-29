import { ExtractedMedicationData } from '../types/medication';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          { text: prompt },
        ],
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) throw new Error(`שגיאת API: ${response.status}`);

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text.trim().replace(/```json\n?|\n?```/g, '');
  return JSON.parse(text) as ExtractedMedicationData;
}
