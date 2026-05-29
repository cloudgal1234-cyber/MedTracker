import { create } from 'zustand';
import { Medication } from '../types/medication';
import { loadMedications, saveMedications } from '../services/storageService';
import { scheduleNotification } from '../services/notificationService';

interface MedicationStore {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'openedDate'>) => void;
  removeMedication: (id: string) => void;
}

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: loadMedications(),

  addMedication: (medData) => {
    const newMed: Medication = {
      ...medData,
      id: Date.now().toString(),
      openedDate: new Date().toISOString(),
    };
    scheduleNotification(newMed);
    const updated = [...get().medications, newMed];
    set({ medications: updated });
    saveMedications(updated);
  },

  removeMedication: (id) => {
    const updated = get().medications.filter((m) => m.id !== id);
    set({ medications: updated });
    saveMedications(updated);
  },
}));
