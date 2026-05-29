import { getDaysUntilExpiry, getExpiryStatus, statusColors, statusLabels } from '../utils/dateUtils';

export function ExpiryIndicator({ expiryDate }: { expiryDate: string }) {
  const days = getDaysUntilExpiry(expiryDate);
  const status = getExpiryStatus(days);
  const color = statusColors[status];
  const barWidth = Math.max(0, Math.min(100, (days / 365) * 100));

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barWidth}%`, background: color, borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600, marginTop: 4, display: 'block' }}>
        {status === 'expired' ? 'פג תוקף!' : `${days} ימים נותרו · ${statusLabels[status]}`}
      </span>
    </div>
  );
}
