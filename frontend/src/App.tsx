import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Applications } from './pages/Applications';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
