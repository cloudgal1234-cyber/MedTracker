import { useNavigate } from 'react-router-dom';
import { Medication } from '../types/medication';
import { ExpiryIndicator } from './ExpiryIndicator';
import { StorageWarning } from './StorageWarning';

export function MedicationCard({ medication }: { medication: Medication }) {
  const navigate = useNavigate();
  const openedDate = new Date(medication.openedDate).toLocaleDateString('he-IL');

  return (
    <div
      onClick={() => navigate(`/medication/${medication.id}`)}
      style={{
        background: '#fff', borderRadius: 12, marginBottom: 12,
        display: 'flex', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden', transition: 'transform 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={medication.imageUri}
        alt={medication.name}
        style={{ width: 90, height: 120, objectFit: 'cover', flexShrink: 0 }}
      />
      <div style={{ padding: 12, flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {medication.name}
        </div>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {medication.purpose}
        </div>
        <div style={{ fontSize: 12, color: '#888' }}>📅 נפתח: {openedDate}</div>
        {medication.storageLocation && (
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>📍 {medication.storageLocation}</div>
        )}
        <ExpiryIndicator expiryDate={medication.expiryDate} />
        <StorageWarning conditions={medication.storageConditions} />
      </div>
    </div>
  );
}
