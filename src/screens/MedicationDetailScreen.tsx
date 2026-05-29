import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView,
} from 'react-native';
import { useMedicationStore } from '../store/medicationStore';
import { ExpiryIndicator } from '../components/ExpiryIndicator';
import { StorageWarning } from '../components/StorageWarning';

export function MedicationDetailScreen({ route, navigation }: any) {
  const { medicationId } = route.params;
  const { medications, removeMedication } = useMedicationStore();
  const med = medications.find((m) => m.id === medicationId);

  if (!med) return null;

  function handleDelete() {
    Alert.alert('מחיקת תרופה', `למחוק את ${med!.name}?`, [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק', style: 'destructive',
        onPress: async () => {
          await removeMedication(medicationId);
          navigation.goBack();
        },
      },
    ]);
  }

  const openedDate = new Date(med.openedDate).toLocaleDateString('he-IL');
  const expiryDate = new Date(med.expiryDate).toLocaleDateString('he-IL');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: med.imageUri }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.name}>{med.name}</Text>
          <Text style={styles.purpose}>{med.purpose}</Text>

          <StorageWarning storageConditions={med.storageConditions} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פרטים</Text>
            <DetailRow icon="📅" label="תאריך פתיחה" value={openedDate} />
            <DetailRow icon="⏰" label="תאריך תפוגה" value={expiryDate} />
            <DetailRow icon="🌡️" label="תנאי אחסון" value={med.storageConditions} />
            {med.storageLocation ? (
              <DetailRow icon="📍" label="מיקום בבית" value={med.storageLocation} />
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>סטטוס</Text>
            <ExpiryIndicator expiryDate={med.expiryDate} />
          </View>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>🗑️ מחק תרופה</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { paddingBottom: 40 },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  purpose: { fontSize: 15, color: '#555', marginBottom: 12 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  detailIcon: { fontSize: 16, marginRight: 8, width: 24 },
  detailLabel: { fontWeight: '600', color: '#666', width: 90 },
  detailValue: { flex: 1, color: '#222' },
  deleteBtn: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#EF9A9A', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  deleteBtnText: { color: '#C62828', fontWeight: '700', fontSize: 16 },
});
