import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { id: 'inspector', label: 'Enforcement Officer', desc: 'Legal Metrology Inspector' },
  { id: 'admin',     label: 'Administrator',        desc: 'State / District HQ' },
  { id: 'consumer',  label: 'Consumer',             desc: 'Public User' },
];

export default function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('inspector');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(role, username, password);
    if (ok) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'consumer') navigate('/consumer');
      else navigate('/inspector');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <main className="login-card animate-fade-in" role="main">
        {/* Header */}
        <div className="login-brand">
          <div className="login-emblem">
            <ShieldCheck size={28} color="#fff" />
          </div>
          <div>
            <h1 className="login-app-name">Pack-IQ / LabelLens</h1>
            <p className="login-app-sub">AI-Assisted Legal Metrology Compliance Platform</p>
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-gov">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', fontWeight: 500 }}>
            Government of India &nbsp;·&nbsp; Department of Legal Metrology &nbsp;·&nbsp; Consumer Affairs
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ marginTop: 'var(--sp-6)' }}>
          {/* Role Selector */}
          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <label className="form-label" style={{ marginBottom: 'var(--sp-2)', display: 'block' }}>
              Sign in as
            </label>
            <div className="role-selector" role="radiogroup" aria-label="Select role">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  className={`role-option ${role === r.id ? 'role-option-active' : ''}`}
                  onClick={() => { setRole(r.id); setError(null); }}
                  aria-pressed={role === r.id}
                >
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div className="form-group" style={{ marginBottom: 'var(--sp-4)' }}>
            <label className="form-label" htmlFor="username">Username / Email</label>
            <input
              id="username"
              type="text"
              className={`form-input ${error ? 'input-error' : ''}`}
              placeholder="Enter your ID or email"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(null); }}
              autoComplete="username"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: 'var(--sp-4)' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className={`form-input ${error ? 'input-error' : ''}`}
                style={{ paddingRight: 44, width: '100%' }}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                autoComplete="current-password"
                aria-describedby={error ? 'login-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--slate-400)', padding: 4,
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-5)' }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--color-action-blue)' }}
            />
            <label htmlFor="remember" style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', cursor: 'pointer' }}>
              Remember session on this device
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" id="login-error" role="alert" style={{ marginBottom: 'var(--sp-4)' }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-trust btn-xl btn-full"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <><span className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} /> Authenticating...</>
            ) : (
              <><ShieldCheck size={18} /> Secure Login</>
            )}
          </button>
        </form>

        {/* Demo note */}
        <div className="login-demo-note">
          <span style={{ color: 'var(--slate-400)', fontSize: 'var(--text-xs)' }}>
            Demo — Enter any username &amp; password (min 4 chars). Select a role above.
          </span>
        </div>

        <div style={{ marginTop: 'var(--sp-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>
          Pack-IQ · LabelLens v1.0 &nbsp;|&nbsp; Legal Metrology (Packaged Commodities) Rules, 2011
        </div>
      </main>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--sp-4);
          background: var(--slate-50);
          position: relative;
        }
        .login-bg {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, var(--color-trust-blue) 0%, #1e3a8a 40%, #1e293b 100%);
          opacity: 0.06;
          pointer-events: none;
        }
        .login-card {
          background: var(--bg-card);
          border: var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: var(--sp-8);
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 1;
        }
        .login-brand {
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          margin-bottom: var(--sp-5);
        }
        .login-emblem {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--color-trust-blue), var(--color-action-blue));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(30,58,138,0.3);
        }
        .login-app-name {
          font-size: var(--text-xl);
          font-weight: var(--fw-bold);
          color: var(--slate-900);
          line-height: 1.2;
        }
        .login-app-sub {
          font-size: var(--text-xs);
          color: var(--slate-500);
          margin-top: 2px;
          line-height: 1.4;
        }
        .login-divider {
          height: 1px;
          background: var(--slate-100);
          margin: 0 0 var(--sp-4) 0;
        }
        .login-gov {
          text-align: center;
        }
        .role-selector {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }
        .role-option {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-3) var(--sp-4);
          border: 1.5px solid var(--slate-200);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          cursor: pointer;
          transition: border-color var(--transition-fast), background var(--transition-fast);
          text-align: left;
        }
        .role-option:hover { border-color: var(--color-action-blue); background: var(--color-action-blue-light); }
        .role-option-active { border-color: var(--color-action-blue); background: var(--color-action-blue-light); }
        .role-label { font-size: var(--text-sm); font-weight: var(--fw-semibold); color: var(--slate-800); display: block; }
        .role-desc  { font-size: var(--text-xs); color: var(--slate-500); display: block; }
        .login-demo-note {
          margin-top: var(--sp-6);
          padding: var(--sp-3) var(--sp-4);
          background: var(--slate-50);
          border: var(--border);
          border-radius: var(--radius-md);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
