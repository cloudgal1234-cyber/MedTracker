import { useParams, useNavigate } from 'react-router-dom';
import { useMedicationStore } from '../store/medicationStore';
import { ExpiryIndicator } from '../components/ExpiryIndicator';
import { StorageWarning } from '../components/StorageWarning';

export function MedicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medications, removeMedication } = useMedicationStore();
  const med = medications.find((m) => m.id === id);

  if (!med) return <div style={{ padding: 40, textAlign: 'center' }}>תרופה לא נמצאה</div>;

  function handleDelete() {
    if (confirm(`למחוק את ${med!.name}?`)) {
      removeMedication(med!.id);
      navigate('/');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', fontSize: 20, color: '#555' }}>→</button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>פרטי תרופה</span>
      </div>

      <img src={med.imageUri} alt={med.name} style={{ width: '100%', height: 240, objectFit: 'cover' }} />

      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{med.name}</div>
        <div style={{ fontSize: 15, color: '#555', marginBottom: 12 }}>{med.purpose}</div>

        <StorageWarning conditions={med.storageConditions} />

        {/* Details card */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>פרטים</div>
          {[
            { icon: '📅', label: 'תאריך פתיחה', value: new Date(med.openedDate).toLocaleDateString('he-IL') },
            { icon: '⏰', label: 'תאריך תפוגה', value: new Date(med.expiryDate).toLocaleDateString('he-IL') },
            { icon: '🌡️', label: 'תנאי אחסון', value: med.storageConditions },
            ...(med.storageLocation ? [{ icon: '📍', label: 'מיקום בבית', value: med.storageLocation }] : []),
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14 }}>
              <span style={{ width: 24 }}>{icon}</span>
              <span style={{ fontWeight: 600, color: '#666', minWidth: 90 }}>{label}:</span>
              <span style={{ color: '#222' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Expiry status */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>סטטוס</div>
          <ExpiryIndicator expiryDate={med.expiryDate} />
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          style={{
            width: '100%', padding: 16, borderRadius: 12, marginTop: 20,
            background: '#FFEBEE', border: '1px solid #EF9A9A',
            color: '#C62828', fontSize: 16, fontWeight: 700,
          }}
        >
          🗑️ מחק תרופה
        </button>
      </div>
    </div>
  );
}
