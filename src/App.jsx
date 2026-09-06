import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InspectionProvider } from './context/InspectionContext';
import { ToastProvider } from './components/ui/UIComponents';
import { AppShell } from './components/layout/AppShell';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Inspector
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import NewInspection from './pages/inspector/NewInspection';
import InspectionHistory from './pages/inspector/InspectionHistory';
import InspectionDetail from './pages/inspector/InspectionDetail';
import RiskIntelligence from './pages/inspector/RiskIntelligence';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRisk from './pages/admin/AdminRisk';

// Consumer
import ConsumerHome from './pages/consumer/ConsumerHome';
import ConsumerScan from './pages/consumer/ConsumerScan';

// Shared
import ProfilePage from './pages/shared/ProfilePage';

/* ---- Route Guards ---- */
function RequireAuth({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

/* ---- Placeholder for unbuilt pages ---- */
function Placeholder({ title }) {
  return (
    <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--slate-400)' }}>
      <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{title}</p>
      <p style={{ fontSize: 'var(--text-sm)', marginTop: 8 }}>This section is available in the full release.</p>
    </div>
  );
}

/* ---- App Router ---- */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Inspector routes */}
      <Route path="/inspector" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><InspectorDashboard /></AppShell>
        </RequireAuth>
      } />
      <Route path="/inspector/new" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><NewInspection /></AppShell>
        </RequireAuth>
      } />
      <Route path="/inspector/history" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><InspectionHistory /></AppShell>
        </RequireAuth>
      } />
      <Route path="/inspector/history/:id" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><InspectionDetail /></AppShell>
        </RequireAuth>
      } />
      <Route path="/inspector/risk" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><RiskIntelligence /></AppShell>
        </RequireAuth>
      } />
      <Route path="/inspector/reports" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><Placeholder title="Reports" /></AppShell>
        </RequireAuth>
      } />
      <Route path="/inspector/profile" element={
        <RequireAuth allowedRole="inspector">
          <AppShell><ProfilePage /></AppShell>
        </RequireAuth>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <RequireAuth allowedRole="admin">
          <AppShell><AdminDashboard /></AppShell>
        </RequireAuth>
      } />
      <Route path="/admin/risk" element={
        <RequireAuth allowedRole="admin">
          <AppShell><AdminRisk /></AppShell>
        </RequireAuth>
      } />
      <Route path="/admin/profile" element={
        <RequireAuth allowedRole="admin">
          <AppShell><ProfilePage /></AppShell>
        </RequireAuth>
      } />
      <Route path="/admin/inspections" element={
        <RequireAuth allowedRole="admin">
          <AppShell><InspectionHistory /></AppShell>
        </RequireAuth>
      } />
      <Route path="/admin/inspections/:id" element={
        <RequireAuth allowedRole="admin">
          <AppShell><InspectionDetail /></AppShell>
        </RequireAuth>
      } />
      <Route path="/admin/violations"  element={<RequireAuth allowedRole="admin"><AppShell><Placeholder title="Violations" /></AppShell></RequireAuth>} />
      <Route path="/admin/brands"      element={<RequireAuth allowedRole="admin"><AppShell><Placeholder title="Brands" /></AppShell></RequireAuth>} />
      <Route path="/admin/regions"     element={<RequireAuth allowedRole="admin"><AppShell><Placeholder title="Regions" /></AppShell></RequireAuth>} />
      <Route path="/admin/users"       element={<RequireAuth allowedRole="admin"><AppShell><Placeholder title="Users" /></AppShell></RequireAuth>} />
      <Route path="/admin/settings"    element={<RequireAuth allowedRole="admin"><AppShell><Placeholder title="Settings" /></AppShell></RequireAuth>} />

      {/* Consumer routes */}
      <Route path="/consumer" element={
        <RequireAuth allowedRole="consumer">
          <AppShell><ConsumerHome /></AppShell>
        </RequireAuth>
      } />
      <Route path="/consumer/scan" element={
        <RequireAuth allowedRole="consumer">
          <AppShell><ConsumerScan /></AppShell>
        </RequireAuth>
      } />
      <Route path="/consumer/history" element={<RequireAuth allowedRole="consumer"><AppShell><Placeholder title="Scan History" /></AppShell></RequireAuth>} />
      <Route path="/consumer/profile" element={<RequireAuth allowedRole="consumer"><AppShell><ProfilePage /></AppShell></RequireAuth>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InspectionProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </InspectionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
