import { create } from 'zustand';
import { Medication } from '../types/medication';
import { loadMedications, saveMedications } from '../services/storageService';
import { scheduleExpiryNotification, cancelNotification } from '../services/notificationService';

interface MedicationStore {
  medications: Medication[];
  isLoaded: boolean;
  loadFromStorage: () => Promise<void>;
  addMedication: (med: Omit<Medication, 'id' | 'openedDate'>) => Promise<void>;
  removeMedication: (id: string) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
}

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: [],
  isLoaded: false,

  loadFromStorage: async () => {
    const meds = await loadMedications();
    set({ medications: meds, isLoaded: true });
  },

  addMedication: async (medData) => {
    const newMed: Medication = {
      ...medData,
      id: Date.now().toString(),
      openedDate: new Date().toISOString(),
    };
    const notificationId = await scheduleExpiryNotification(newMed);
    if (notificationId) newMed.notificationId = notificationId;
    const updated = [...get().medications, newMed];
    set({ medications: updated });
    await saveMedications(updated);
  },

  removeMedication: async (id) => {
    const med = get().medications.find((m) => m.id === id);
    if (med?.notificationId) await cancelNotification(med.notificationId);
    const updated = get().medications.filter((m) => m.id !== id);
    set({ medications: updated });
    await saveMedications(updated);
  },

  updateMedication: async (id, updates) => {
    const updated = get().medications.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    set({ medications: updated });
    await saveMedications(updated);
  },
}));
