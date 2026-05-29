export function getDaysUntilExpiry(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const today = new Date();
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(days: number): 'safe' | 'warning' | 'danger' | 'expired' {
  if (days < 0) return 'expired';
  if (days <= 7) return 'danger';
  if (days <= 30) return 'warning';
  return 'safe';
}

export const statusColors = {
  safe: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  expired: '#9E9E9E',
};

export const statusLabels = {
  safe: 'בתוקף',
  warning: 'פג בקרוב',
  danger: 'פג בימים הקרובים',
  expired: 'פג תוקף',
};
