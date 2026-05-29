import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Image, SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { extractMedicationData } from '../services/aiService';
import { useMedicationStore } from '../store/medicationStore';
import { ExtractedMedicationData } from '../types/medication';

const REMINDER_OPTIONS = [7, 14, 30, 60];

export function AddMedicationScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedMedicationData | null>(null);
  const [storageLocation, setStorageLocation] = useState('');
  const [reminderDays, setReminderDays] = useState(14);
  const [saving, setSaving] = useState(false);
  const { addMedication } = useMedicationStore();

  async function pickImage(fromCamera: boolean) {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setExtracting(true);
      try {
        const data = await extractMedicationData(uri);
        setExtracted(data);
      } catch {
        Alert.alert('שגיאה', 'לא ניתן לחלץ מידע מהתמונה. ניתן להזין ידנית.');
      } finally {
        setExtracting(false);
      }
    }
  }

  async function handleSave() {
    if (!imageUri || !extracted) {
      Alert.alert('שגיאה', 'נא לצלם תמונה של התרופה קודם');
      return;
    }
    setSaving(true);
    try {
      await addMedication({
        name: extracted.name,
        purpose: extracted.purpose,
        expiryDate: extracted.expiryDate,
        storageConditions: extracted.storageConditions,
        storageLocation,
        imageUri,
        reminderDaysBefore: reminderDays,
      });
      navigation.goBack();
    } catch {
      Alert.alert('שגיאה', 'לא ניתן לשמור את התרופה');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>הוספת תרופה</Text>

        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage(true)}>
            <Text style={styles.imageBtnText}>📷 צלם אריזה</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.imageBtn, styles.imageBtnSecondary]} onPress={() => pickImage(false)}>
            <Text style={styles.imageBtnText}>🖼️ בחר מהגלריה</Text>
          </TouchableOpacity>
        </View>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        {extracting && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>מנתח את האריזה...</Text>
          </View>
        )}

        {extracted && (
          <View style={styles.extractedBox}>
            <Text style={styles.sectionTitle}>✅ מידע שזוהה אוטומטית</Text>
            <InfoRow label="שם" value={extracted.name} />
            <InfoRow label="שימוש" value={extracted.purpose} />
            <InfoRow label="תפוגה" value={extracted.expiryDate} />
            <InfoRow label="אחסון" value={extracted.storageConditions} />
          </View>
        )}

        <Text style={styles.label}>📍 מיקום אחסון בבית</Text>
        <TextInput
          style={styles.input}
          placeholder="לדוגמה: מגירה עליונה במטבח"
          value={storageLocation}
          onChangeText={setStorageLocation}
          textAlign="right"
        />

        <Text style={styles.label}>🔔 התראה לפני תפוגה</Text>
        <View style={styles.reminderRow}>
          {REMINDER_OPTIONS.map((days) => (
            <TouchableOpacity
              key={days}
              style={[styles.reminderBtn, reminderDays === days && styles.reminderBtnActive]}
              onPress={() => setReminderDays(days)}
            >
              <Text style={[styles.reminderBtnText, reminderDays === days && styles.reminderBtnTextActive]}>
                {days} ימים
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, (!extracted || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!extracted || saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveBtnText}>💾 שמור תרופה</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  imageButtons: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  imageBtn: { flex: 1, backgroundColor: '#2196F3', borderRadius: 10, padding: 14, alignItems: 'center' },
  imageBtnSecondary: { backgroundColor: '#607D8B' },
  imageBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  loadingBox: { alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#555' },
  extractedBox: {
    backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#A5D6A7',
  },
  sectionTitle: { fontWeight: '700', fontSize: 15, marginBottom: 10, color: '#2E7D32' },
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  infoLabel: { fontWeight: '700', color: '#444', width: 60 },
  infoValue: { flex: 1, color: '#222' },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 15 },
  reminderRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  reminderBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#fff' },
  reminderBtnActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  reminderBtnText: { color: '#555', fontWeight: '600' },
  reminderBtnTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnDisabled: { backgroundColor: '#BDBDBD' },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
