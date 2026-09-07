import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, ClipboardList, BarChart2, User,
  ShieldCheck, Settings, FileText, LogOut, AlertTriangle,
  Users, MapPin, Zap, Gavel, Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INSPECTOR_NAV = [
  { label: 'Dashboard',   path: '/inspector',         icon: LayoutDashboard },
  { label: 'New Inspection', path: '/inspector/new',  icon: ScanLine },
  { label: 'History',     path: '/inspector/history', icon: ClipboardList },
  { label: 'Risk',        path: '/inspector/risk',    icon: BarChart2 },
  { label: 'Reports',     path: '/inspector/reports', icon: FileText },
];

const ENFORCEMENT_NAV = [
  { label: 'Dashboard',     path: '/enforcement',         icon: LayoutDashboard },
  { label: 'Legal Notices', path: '/enforcement/notices', icon: Gavel },
  { label: 'Risk',          path: '/enforcement/risk',    icon: BarChart2 },
  { label: 'Inspections',   path: '/enforcement/cases',   icon: ClipboardList },
  { label: 'Profile',       path: '/enforcement/profile', icon: User },
];

const ADMIN_NAV = [
  { label: 'Dashboard',   path: '/admin',             icon: LayoutDashboard },
  { label: 'Inspections', path: '/admin/inspections', icon: ClipboardList },
  { label: 'Violations',  path: '/admin/violations',  icon: AlertTriangle },
  { label: 'Risk Intelligence', path: '/admin/risk',  icon: BarChart2 },
  { label: 'Brands',      path: '/admin/brands',      icon: Zap },
  { label: 'Regions',     path: '/admin/regions',     icon: MapPin },
  { label: 'Users',       path: '/admin/users',       icon: Users },
  { label: 'Settings',    path: '/admin/settings',    icon: Settings },
];

const CONSUMER_NAV = [
  { label: 'Home',    path: '/consumer',         icon: LayoutDashboard },
  { label: 'Scan',    path: '/consumer/scan',    icon: ScanLine },
  { label: 'History', path: '/consumer/history', icon: ClipboardList },
  { label: 'Profile', path: '/consumer/profile', icon: User },
];

// Bottom nav items per role (max 5)
const INSPECTOR_BOTTOM_NAV = [
  { label: 'Dashboard', path: '/inspector',         icon: LayoutDashboard },
  { label: 'Inspect',   path: '/inspector/new',     icon: ScanLine },
  { label: 'History',   path: '/inspector/history', icon: ClipboardList },
  { label: 'Risk',      path: '/inspector/risk',    icon: BarChart2 },
  { label: 'Profile',   path: '/inspector/profile', icon: User },
];

const ENFORCEMENT_BOTTOM_NAV = [
  { label: 'Dashboard', path: '/enforcement',         icon: LayoutDashboard },
  { label: 'Notices',   path: '/enforcement/notices', icon: Gavel },
  { label: 'Risk',      path: '/enforcement/risk',    icon: BarChart2 },
  { label: 'Profile',   path: '/enforcement/profile', icon: User },
];

const ADMIN_BOTTOM_NAV = [
  { label: 'Dashboard',   path: '/admin',             icon: LayoutDashboard },
  { label: 'Inspections', path: '/admin/inspections', icon: ClipboardList },
  { label: 'Risk',        path: '/admin/risk',        icon: BarChart2 },
  { label: 'Profile',     path: '/admin/profile',     icon: User },
];

function getNav(role) {
  if (role === 'admin') return ADMIN_NAV;
  if (role === 'enforcement') return ENFORCEMENT_NAV;
  if (role === 'consumer') return CONSUMER_NAV;
  return INSPECTOR_NAV;
}

function getBottomNav(role) {
  if (role === 'admin') return ADMIN_BOTTOM_NAV;
  if (role === 'enforcement') return ENFORCEMENT_BOTTOM_NAV;
  if (role === 'consumer') return CONSUMER_NAV;
  return INSPECTOR_BOTTOM_NAV;
}

function initials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

// ---- Sidebar (Desktop) ----
export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = getNav(user?.role);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-app-name">LabelLens</span>
            <span className="sidebar-app-sub">Legal Metrology</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="sidebar-nav-section">
          {nav.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path ||
              (item.path !== '/inspector' && item.path !== '/admin' && item.path !== '/consumer' &&
               location.pathname.startsWith(item.path));
            return (
              <div
                key={item.path}
                className={`sidebar-nav-item ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                role="button"
                tabIndex={0}
                aria-current={active ? 'page' : undefined}
                onKeyDown={e => e.key === 'Enter' && navigate(item.path)}
              >
                <Icon size={18} />
                {item.label}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        {/* Profile link */}
        <div
          className="sidebar-user"
          onClick={() => navigate(`/${user?.role}/profile`)}
          title="My Profile"
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate(`/${user?.role}/profile`)}
          style={{ marginBottom: 4 }}
        >
          <div className="sidebar-avatar">{initials(user?.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="sidebar-user-name truncate">{user?.name}</p>
            <p className="sidebar-user-role truncate">{user?.district}</p>
          </div>
          <User size={15} color="var(--slate-500)" />
        </div>
        {/* Logout button — always visible */}
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius-md)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--slate-400)', fontSize: 'var(--text-sm)', fontWeight: 500,
            transition: 'background var(--transition-fast), color var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.color = '#FCA5A5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--slate-400)'; }}
          aria-label="Sign out"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ---- Mobile Header ----
export function MobileHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  return (
    <header className="header" role="banner">
      <div className="header-logo">
        <div className="header-logo-icon">
          <ShieldCheck size={18} />
        </div>
        <span className="header-title">LabelLens</span>
      </div>
      <div className="header-actions">
        {/* Avatar → Profile page (which has logout) */}
        <button
          className="header-icon-btn"
          aria-label="My Profile"
          onClick={() => navigate(`/${role}/profile`)}
          title="My Profile"
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--color-action-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: '#fff',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            {initials(user?.name)}
          </div>
        </button>
      </div>
    </header>
  );
}

// ---- Bottom Navigation (Mobile) ----
export function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = getBottomNav(user?.role);

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {nav.map(item => {
        const Icon = item.icon;
        const active = location.pathname === item.path ||
          (item.path !== '/inspector' && item.path !== '/admin' && item.path !== '/consumer' &&
           location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ---- AppShell ----
export function AppShell({ children }) {
  const { user } = useAuth();
  if (!user) return children;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <MobileHeader />
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
