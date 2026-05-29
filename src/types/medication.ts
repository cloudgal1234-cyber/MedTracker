export interface Medication {
  id: string;
  name: string;
  purpose: string;
  expiryDate: string;
  openedDate: string;
  storageConditions: string;
  storageLocation: string;
  imageUri: string;
  reminderDaysBefore: number;
  notificationId?: string;
}

export interface ExtractedMedicationData {
  name: string;
  purpose: string;
  expiryDate: string;
  storageConditions: string;
}
