import { Medication } from '../types/medication';

const KEY = 'medications';

export function loadMedications(): Medication[] {
  const json = localStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

export function saveMedications(medications: Medication[]): void {
  localStorage.setItem(KEY, JSON.stringify(medications));
}
