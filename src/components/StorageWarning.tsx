const SPECIAL = ['קירור', 'מקרר', 'קר', 'אור שמש', 'חושך', 'יבש', 'לח'];

export function StorageWarning({ conditions }: { conditions: string }) {
  if (!SPECIAL.some((kw) => conditions.includes(kw)) || conditions === 'לא זוהה') return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#FFF3E0', border: '1px solid #FF9800',
      borderRadius: 8, padding: '8px 12px', marginTop: 8,
    }}>
      <span>⚠️</span>
      <span style={{ color: '#E65100', fontSize: 13, fontWeight: 600 }}>{conditions}</span>
    </div>
  );
}
