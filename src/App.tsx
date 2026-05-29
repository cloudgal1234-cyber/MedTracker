import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { AddMedication } from './pages/AddMedication';
import { MedicationDetail } from './pages/MedicationDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddMedication />} />
      <Route path="/medication/:id" element={<MedicationDetail />} />
    </Routes>
  );
}
