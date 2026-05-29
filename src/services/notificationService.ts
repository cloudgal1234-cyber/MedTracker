import * as Notifications from 'expo-notifications';
import { Medication } from '../types/medication';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleExpiryNotification(
  medication: Medication
): Promise<string | null> {
  const expiryDate = new Date(medication.expiryDate);
  const notifyDate = new Date(expiryDate);
  notifyDate.setDate(notifyDate.getDate() - medication.reminderDaysBefore);

  if (notifyDate <= new Date()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `⚠️ ${medication.name} עומדת לפוג`,
      body: `תאריך תפוגה: ${expiryDate.toLocaleDateString('he-IL')}. זכור לקנות חדש!`,
      data: { medicationId: medication.id },
    },
    trigger: { date: notifyDate },
  });

  return id;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
