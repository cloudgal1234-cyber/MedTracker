import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedicationStore } from '../store/medicationStore';
import { MedicationCard } from '../components/MedicationCard';
import { requestPermission } from '../services/notificationService';

export function Dashboard() {
  const navigate = useNavigate();
  const { medications } = useMedicationStore();

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '20px 20px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>💊 ארון התרופות</div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 2 }}>{medications.length} תרופות</div>
      </div>

      {/* List */}
      <div style={{ padding: 16 }}>
        {medications.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 64 }}>📦</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#444', marginTop: 12 }}>עדיין לא נוספו תרופות</div>
            <div style={{ fontSize: 14, color: '#999', marginTop: 4 }}>לחץ על + כדי להוסיף</div>
          </div>
        ) : (
          medications.map((med) => <MedicationCard key={med.id} medication={med} />)
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/add')}
        style={{
          position: 'fixed', bottom: 28, left: 24,
          width: 60, height: 60, borderRadius: 30,
          background: '#2196F3', color: '#fff',
          fontSize: 32, lineHeight: '60px', textAlign: 'center',
          boxShadow: '0 4px 16px rgba(33,150,243,0.4)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        +
      </button>
    </div>
  );
}
