import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, ClipboardList, BarChart2, User,
  ShieldCheck, Settings, FileText, LogOut, AlertTriangle,
  Users, MapPin, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INSPECTOR_NAV = [
  { label: 'Dashboard',   path: '/inspector',         icon: LayoutDashboard },
  { label: 'New Inspection', path: '/inspector/new',  icon: ScanLine },
  { label: 'History',     path: '/inspector/history', icon: ClipboardList },
  { label: 'Risk',        path: '/inspector/risk',    icon: BarChart2 },
  { label: 'Reports',     path: '/inspector/reports', icon: FileText },
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

function getNav(role) {
  if (role === 'admin') return ADMIN_NAV;
  if (role === 'consumer') return CONSUMER_NAV;
  return INSPECTOR_NAV;
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
            <span className="sidebar-app-name">Pack-IQ</span>
            <span className="sidebar-app-sub">LabelLens</span>
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
        <div className="sidebar-user" onClick={logout} title="Logout" role="button" tabIndex={0}>
          <div className="sidebar-avatar">{initials(user?.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="sidebar-user-name truncate">{user?.name}</p>
            <p className="sidebar-user-role truncate">{user?.district}</p>
          </div>
          <LogOut size={16} color="var(--slate-500)" />
        </div>
      </div>
    </aside>
  );
}

// ---- Mobile Header ----
export function MobileHeader({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  return (
    <header className="header" role="banner">
      <div className="header-logo">
        <div className="header-logo-icon">
          <ShieldCheck size={18} />
        </div>
        <span className="header-title">Pack-IQ</span>
      </div>
      <div className="header-actions">
        <button
          className="header-icon-btn"
          aria-label="Profile"
          onClick={() => navigate(`/${role}/profile`)}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--color-action-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fff'
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
  const nav = getNav(user?.role).slice(0, 5);

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
