import { ExtractedMedicationData } from '../types/medication';

export async function extractMedicationData(
  imageBase64: string
): Promise<ExtractedMedicationData> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) throw new Error(`שגיאה: ${response.status}`);

  return response.json() as Promise<ExtractedMedicationData>;
}
