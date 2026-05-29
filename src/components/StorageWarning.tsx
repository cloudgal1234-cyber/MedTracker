import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SPECIAL_CONDITIONS = ['קירור', 'מקרר', 'קר', 'אור שמש', 'חושך', 'יבש', 'לח'];

interface Props {
  storageConditions: string;
}

export function StorageWarning({ storageConditions }: Props) {
  const isSpecial = SPECIAL_CONDITIONS.some((kw) => storageConditions.includes(kw));
  if (!isSpecial || storageConditions === 'לא זוהה') return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>{storageConditions}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF3E0', borderColor: '#FF9800',
    borderWidth: 1, borderRadius: 8, padding: 8, marginTop: 6,
  },
  icon: { fontSize: 16, marginRight: 6 },
  text: { color: '#E65100', fontSize: 13, fontWeight: '600', flex: 1 },
});
