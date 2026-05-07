import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import Landing       from './pages/Landing';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import Dashboard     from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSAnalyser   from './pages/ATSAnalyser';
import Templates     from './pages/Templates';
import Pricing       from './pages/Pricing';
import Navbar        from './components/Navbar';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup"    element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/pricing"   element={<Pricing />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/builder/:id?" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
          <Route path="/ats"       element={<PrivateRoute><ATSAnalyser /></PrivateRoute>} />
          <Route path="/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
