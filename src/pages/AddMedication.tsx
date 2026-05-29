import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractMedicationData } from '../services/aiService';
import { useMedicationStore } from '../store/medicationStore';
import { ExtractedMedicationData } from '../types/medication';

const REMINDER_OPTIONS = [7, 14, 30, 60];

export function AddMedication() {
  const navigate = useNavigate();
  const { addMedication, apiKey, setApiKey } = useMedicationStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedMedicationData | null>(null);
  const [storageLocation, setStorageLocation] = useState('');
  const [reminderDays, setReminderDays] = useState(14);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  async function handleImageFile(file: File) {
    const url = URL.createObjectURL(file);
    setImageUri(url);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setImageBase64(base64);
      setExtracting(true);
      setError('');
      try {
        const data = await extractMedicationData(base64, localApiKey);
        setExtracted(data);
      } catch {
        setError('לא ניתן לנתח את התמונה. בדוק את מפתח ה-API.');
      } finally {
        setExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!imageUri || !extracted) return;
    setSaving(true);
    if (localApiKey !== apiKey) setApiKey(localApiKey);
    addMedication({
      name: extracted.name,
      purpose: extracted.purpose,
      expiryDate: extracted.expiryDate,
      storageConditions: extracted.storageConditions,
      storageLocation,
      imageUri,
      reminderDaysBefore: reminderDays,
    });
    navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', fontSize: 20, color: '#555' }}>→</button>
        <span style={{ fontWeight: 700, fontSize: 18 }}>הוספת תרופה</span>
      </div>

      <div style={{ padding: 20 }}>
        {/* API Key */}
        <label style={labelStyle}>🔑 מפתח Gemini API</label>
        <input
          type="password"
          placeholder="AIza..."
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
          style={inputStyle}
        />
        {!localApiKey && (
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: '#2196F3', marginTop: 4, display: 'block' }}
          >
            📎 קבל מפתח חינם מ-Google AI Studio
          </a>
        )}

        {/* Camera / Gallery */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => cameraInputRef.current?.click()} style={primaryBtnStyle}>
            📷 צלם אריזה
          </button>
          <button onClick={() => fileInputRef.current?.click()} style={{ ...primaryBtnStyle, background: '#607D8B' }}>
            🖼️ בחר מגלריה
          </button>
        </div>

        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

        {/* Preview */}
        {imageUri && (
          <img src={imageUri} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginTop: 16 }} />
        )}

        {/* Loading */}
        {extracting && (
          <div style={{ textAlign: 'center', padding: 24, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            מנתח את האריזה...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#FFEBEE', border: '1px solid #EF9A9A', borderRadius: 8, padding: 12, marginTop: 12, color: '#C62828', fontSize: 14 }}>
            ❌ {error}
          </div>
        )}

        {/* Extracted data */}
        {extracted && (
          <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 12, padding: 16, marginTop: 16 }}>
            <div style={{ fontWeight: 700, color: '#2E7D32', marginBottom: 10 }}>✅ מידע שזוהה אוטומטית</div>
            {[
              { label: 'שם', value: extracted.name },
              { label: 'שימוש', value: extracted.purpose },
              { label: 'תפוגה', value: extracted.expiryDate },
              { label: 'אחסון', value: extracted.storageConditions },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 14 }}>
                <span style={{ fontWeight: 700, minWidth: 60, color: '#444' }}>{label}:</span>
                <span style={{ color: '#222' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Storage location */}
        <label style={{ ...labelStyle, marginTop: 20 }}>📍 מיקום אחסון בבית</label>
        <input
          type="text"
          placeholder="לדוגמה: מגירה עליונה במטבח"
          value={storageLocation}
          onChange={(e) => setStorageLocation(e.target.value)}
          style={inputStyle}
        />

        {/* Reminder */}
        <label style={{ ...labelStyle, marginTop: 20 }}>🔔 התראה לפני תפוגה</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {REMINDER_OPTIONS.map((days) => (
            <button
              key={days}
              onClick={() => setReminderDays(days)}
              style={{
                padding: '8px 16px', borderRadius: 20, fontWeight: 600, fontSize: 14,
                background: reminderDays === days ? '#2196F3' : '#fff',
                color: reminderDays === days ? '#fff' : '#555',
                border: `1px solid ${reminderDays === days ? '#2196F3' : '#DDD'}`,
              }}
            >
              {days} ימים
            </button>
          ))}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!extracted || saving}
          style={{
            width: '100%', padding: 16, borderRadius: 12, marginTop: 24,
            background: extracted ? '#4CAF50' : '#BDBDBD',
            color: '#fff', fontSize: 17, fontWeight: 800,
          }}
        >
          {saving ? '...' : '💾 שמור תרופה'}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: 12, borderRadius: 10, border: '1px solid #DDD',
  fontSize: 15, background: '#fff', outline: 'none',
};

const primaryBtnStyle: React.CSSProperties = {
  flex: 1, padding: 14, borderRadius: 10, background: '#2196F3',
  color: '#fff', fontWeight: 700, fontSize: 14,
};
