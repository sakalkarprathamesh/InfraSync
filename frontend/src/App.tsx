import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Overview } from './pages/Overview';
import { Requests } from './pages/Requests';
import { RequestForm } from './pages/RequestForm';
import { RequestDetail } from './pages/RequestDetail';
import { ConflictDetection } from './pages/ConflictDetection';
import { CoordinationSchedule } from './pages/CoordinationSchedule';
import { GisMap } from './pages/GisMap';
import { DepartmentCollaboration } from './pages/DepartmentCollaboration';
import { ExcavationHistory } from './pages/ExcavationHistory';
import { Notifications } from './pages/Notifications';
import { Analytics } from './pages/Analytics';
import { Resources } from './pages/Resources';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Main Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/new" element={<RequestForm />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="conflicts" element={<ConflictDetection />} />
            <Route path="coordination" element={<CoordinationSchedule />} />
            <Route path="map" element={<GisMap />} />
            <Route path="collaboration" element={<DepartmentCollaboration />} />
            <Route path="history" element={<ExcavationHistory />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="resources" element={<Resources />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
