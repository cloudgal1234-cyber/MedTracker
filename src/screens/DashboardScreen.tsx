import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useMedicationStore } from '../store/medicationStore';
import { MedicationCard } from '../components/MedicationCard';
import { requestNotificationPermission } from '../services/notificationService';

export function DashboardScreen({ navigation }: any) {
  const { medications, isLoaded, loadFromStorage } = useMedicationStore();

  useEffect(() => {
    if (!isLoaded) {
      loadFromStorage();
      requestNotificationPermission();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>💊 ארון התרופות</Text>
        <Text style={styles.subtitle}>{medications.length} תרופות</Text>
      </View>

      {medications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>עדיין לא נוספו תרופות</Text>
          <Text style={styles.emptyHint}>לחץ על + כדי להוסיף</Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <MedicationCard
              medication={item}
              onPress={() => navigation.navigate('Detail', { medicationId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 2 },
  list: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#444', marginTop: 12 },
  emptyHint: { fontSize: 14, color: '#999', marginTop: 4 },
  fab: {
    position: 'absolute', bottom: 30, right: 24,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#2196F3', alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#2196F3', shadowOpacity: 0.4,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  fabText: { fontSize: 32, color: '#fff', lineHeight: 36 },
});
