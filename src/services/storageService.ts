import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '../types/medication';

const STORAGE_KEY = 'medications';

export async function loadMedications(): Promise<Medication[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveMedications(medications: Medication[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
}
