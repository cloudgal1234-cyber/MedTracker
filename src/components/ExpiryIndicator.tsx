import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDaysUntilExpiry, getExpiryStatus, statusColors, statusLabels } from '../utils/dateUtils';

interface Props {
  expiryDate: string;
}

export function ExpiryIndicator({ expiryDate }: Props) {
  const days = getDaysUntilExpiry(expiryDate);
  const status = getExpiryStatus(days);
  const color = statusColors[status];
  const barWidth = Math.max(0, Math.min(100, (days / 365) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.label, { color }]}>
        {status === 'expired' ? 'פג תוקף!' : `${days} ימים נותרו · ${statusLabels[status]}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  barBackground: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  label: { fontSize: 12, marginTop: 4, fontWeight: '600' },
});
