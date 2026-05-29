import * as FileSystem from 'expo-file-system';
import { ExtractedMedicationData } from '../types/medication';

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function extractMedicationData(
  imageUri: string
): Promise<ExtractedMedicationData> {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const prompt = `אתה מערכת OCR רפואית. נתחו את תמונת אריזת התרופה וחלצו את המידע הבא.
החזירו JSON בלבד, ללא טקסט נוסף, בפורמט הזה:
{
  "name": "שם התרופה",
  "purpose": "מה התרופה עושה (התוויה)",
  "expiryDate": "YYYY-MM-DD",
  "storageConditions": "תנאי אחסון"
}
אם שדה מסוים לא נמצא באריזה, השתמשו ב-"לא זוהה".
עבור תאריך תפוגה: חפשו EXP, תפוגה, Use By, Best Before.`;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64,
              },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();
  const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(jsonStr) as ExtractedMedicationData;
}
