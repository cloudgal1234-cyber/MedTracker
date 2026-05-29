import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Medication } from '../types/medication';
import { ExpiryIndicator } from './ExpiryIndicator';
import { StorageWarning } from './StorageWarning';

interface Props {
  medication: Medication;
  onPress: () => void;
}

export function MedicationCard({ medication, onPress }: Props) {
  const openedDate = new Date(medication.openedDate).toLocaleDateString('he-IL');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: medication.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{medication.name}</Text>
        <Text style={styles.purpose} numberOfLines={2}>{medication.purpose}</Text>
        <Text style={styles.meta}>📅 נפתח: {openedDate}</Text>
        {medication.storageLocation ? (
          <Text style={styles.meta}>📍 {medication.storageLocation}</Text>
        ) : null}
        <ExpiryIndicator expiryDate={medication.expiryDate} />
        <StorageWarning storageConditions={medication.storageConditions} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 12,
    flexDirection: 'row', elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  image: { width: 90, height: '100%', minHeight: 120 },
  content: { flex: 1, padding: 12 },
  name: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  purpose: { fontSize: 13, color: '#555', marginBottom: 6 },
  meta: { fontSize: 12, color: '#888', marginBottom: 2 },
});
