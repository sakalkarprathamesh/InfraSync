import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Home } from './pages/Home';
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Main Roomie Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/new" element={<RequestForm />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/conflicts" element={<ConflictDetection />} />
            <Route path="/coordination" element={<CoordinationSchedule />} />
            <Route path="/map" element={<GisMap />} />
            <Route path="/collaboration" element={<DepartmentCollaboration />} />
            <Route path="/history" element={<ExcavationHistory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
