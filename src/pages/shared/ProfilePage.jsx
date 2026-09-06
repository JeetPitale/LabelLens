import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, MapPin, BadgeCheck, Phone, Mail, Building2,
  LogOut, ChevronRight, Lock, Bell, HelpCircle, Info,
  CheckCircle, Edit3, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/UIComponents';
import { PAST_INSPECTIONS } from '../../data/mockData';

function initials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

function roleLabel(role) {
  if (role === 'inspector') return 'Enforcement Officer';
  if (role === 'admin') return 'Administrator';
  if (role === 'consumer') return 'Consumer';
  return role;
}

function roleBadgeColor(role) {
  if (role === 'inspector') return { bg: 'var(--color-action-blue-light)', color: 'var(--color-action-blue)', border: '#BFDBFE' };
  if (role === 'admin') return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-dark)', border: 'var(--color-warning-border)' };
  return { bg: 'var(--color-compliant-bg)', color: 'var(--color-compliant-dark)', border: 'var(--color-compliant-border)' };
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const badgeColor = roleBadgeColor(user?.role);

  // Stats for inspector
  const myInspections = PAST_INSPECTIONS.filter(i => i.inspectorId === user?.id);
  const compliant = myInspections.filter(i => i.status === 'compliant').length;
  const violations = myInspections.filter(i => i.status === 'non-compliant').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="animate-fade-in">
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>My Profile</h1>
          <p className="page-subtitle">Account details &amp; settings</p>
        </div>
      </div>

      <div className="page-content">
        {/* Profile Hero */}
        <div className="card card-padded" style={{
          marginBottom: 'var(--sp-5)',
          borderTop: '3px solid var(--color-trust-blue)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-trust-blue), var(--color-action-blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)',
              flexShrink: 0, boxShadow: '0 4px 14px rgba(30,58,138,0.25)',
            }}>
              {initials(user?.name)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', lineHeight: 1.2 }}>
                {user?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)',
                  background: badgeColor.bg, color: badgeColor.color,
                  border: `1px solid ${badgeColor.border}`,
                }}>
                  {roleLabel(user?.role)}
                </span>
                {user?.badge && (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BadgeCheck size={13} color="var(--color-action-blue)" /> {user.badge}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Building2 size={13} /> {user?.department}
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={13} /> {user?.district}
              </p>
            </div>
          </div>
        </div>

        {/* Stats (Inspector only) */}
        {user?.role === 'inspector' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
            {[
              { label: 'Total Inspections', value: myInspections.length, color: 'var(--color-action-blue)' },
              { label: 'Compliant',          value: compliant,             color: 'var(--color-compliant)' },
              { label: 'Violations Found',   value: violations,            color: 'var(--color-violation)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 'var(--sp-4)', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: 3 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Account Details */}
        <div className="card" style={{ marginBottom: 'var(--sp-5)' }}>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--border)' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Account Information
            </p>
          </div>
          {[
            { icon: User,      label: 'Full Name',    value: user?.name },
            { icon: BadgeCheck, label: 'Officer ID',  value: user?.id },
            { icon: Shield,    label: 'Badge Number', value: user?.badge || '—' },
            { icon: Building2, label: 'Department',   value: user?.department },
            { icon: MapPin,    label: 'District',     value: user?.district },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
              padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--border)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} color="var(--slate-500)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--slate-800)' }} className="truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Links */}
        <div className="card" style={{ marginBottom: 'var(--sp-5)' }}>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--border)' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Preferences
            </p>
          </div>
          {[
            { icon: Lock,     label: 'Change Password',      sub: 'Update your login credentials' },
            { icon: Bell,     label: 'Notifications',        sub: 'Manage alerts and reminders' },
            { icon: HelpCircle, label: 'Help & Support',     sub: 'Documentation and contact' },
            { icon: Info,     label: 'About LabelLens',      sub: 'v1.0 · Legal Metrology (PC) Rules, 2011' },
          ].map(({ icon: Icon, label, sub }) => (
            <button key={label} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
              padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--border)',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'background var(--transition-fast)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} color="var(--slate-500)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--slate-800)' }}>{label}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: 1 }}>{sub}</p>
              </div>
              <ChevronRight size={16} color="var(--slate-300)" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          className="btn btn-danger btn-full btn-lg"
          onClick={() => setShowLogoutModal(true)}
          style={{ marginBottom: 'var(--sp-8)' }}
        >
          <LogOut size={18} /> Sign Out
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginBottom: 'var(--sp-8)' }}>
          Pack-IQ · LabelLens v1.0 &nbsp;·&nbsp; Department of Legal Metrology, India
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign out?"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleLogout}>
              <LogOut size={15} /> Sign Out
            </button>
          </>
        }
      >
        You will be signed out of this device. Any unsynced inspections have been saved locally and will sync when you log back in.
      </Modal>
    </div>
  );
}
