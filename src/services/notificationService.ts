import { Medication } from '../types/medication';

export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleNotification(medication: Medication): void {
  if (!('Notification' in window)) return;

  const expiryDate = new Date(medication.expiryDate);
  const notifyDate = new Date(expiryDate);
  notifyDate.setDate(notifyDate.getDate() - medication.reminderDaysBefore);

  const msUntilNotify = notifyDate.getTime() - Date.now();
  if (msUntilNotify <= 0) return;

  setTimeout(() => {
    new Notification(`⚠️ ${medication.name} עומדת לפוג`, {
      body: `תאריך תפוגה: ${expiryDate.toLocaleDateString('he-IL')}. זכור לקנות חדש!`,
      icon: '/MedTracker/icon.png',
    });
  }, msUntilNotify);
}
