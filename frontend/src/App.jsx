import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Notification from './components/Notification';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './layout/AppLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DecompositionPage from './pages/DecompositionPage';
import GuidePage from './pages/GuidePage';
import HistoryPage from './pages/HistoryPage';
import PredictionPage from './pages/PredictionPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedApp({ notify }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout notify={notify} />;
}

export default function App() {
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState(null);

  const notify = (type, title, message) => {
    setToast({ type, title, message });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <BrowserRouter>
      <Notification toast={toast} onClose={() => setToast(null)} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage notify={notify} />}
        />
        <Route path="/" element={<ProtectedApp notify={notify} />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="enzyme-prediction" element={<PredictionPage />} />
          <Route path="decomposition" element={<DecompositionPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage section="profile" />} />
          <Route path="change-password" element={<ProfilePage section="password" />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
