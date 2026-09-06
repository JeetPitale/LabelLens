import React, { useState, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// ---- Toast Context ----
const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

function Toast({ message, type, onClose }) {
  const icons = {
    success: <CheckCircle size={18} color="var(--color-compliant)" />,
    error:   <AlertCircle size={18} color="var(--color-violation)" />,
    warning: <AlertTriangle size={18} color="var(--color-warning)" />,
    info:    <Info size={18} color="var(--color-action-blue)" />,
  };
  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      {icons[type]}
      <span style={{ flex: 1, lineHeight: 1.5 }}>{message}</span>
      <button onClick={onClose} style={{ color: 'var(--slate-400)', padding: '2px', marginLeft: 4 }} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

// ---- Modal ----
export function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {title && <h2 className="modal-title" id="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

// ---- StatusBadge ----
export function StatusBadge({ status, size = 'default' }) {
  const map = {
    'compliant':     { cls: 'badge-compliant',  label: 'COMPLIANT' },
    'non-compliant': { cls: 'badge-violation',   label: 'NON-COMPLIANT' },
    'needs-review':  { cls: 'badge-warning',     label: 'NEEDS REVIEW' },
    'pending':       { cls: 'badge-neutral',     label: 'PENDING' },
    'synced':        { cls: 'badge-compliant',   label: 'SYNCED' },
    'pass':          { cls: 'badge-compliant',   label: 'PASS' },
    'fail':          { cls: 'badge-violation',   label: 'FAIL' },
    'uncertain':     { cls: 'badge-warning',     label: 'UNCERTAIN' },
    'demo':          { cls: 'badge-blue',        label: 'DEMO DATA' },
    'draft':         { cls: 'badge-neutral',     label: 'DRAFT' },
  };
  const { cls = 'badge-neutral', label = status?.toUpperCase() } = map[status] || {};
  return <span className={`badge ${cls}`} style={size === 'sm' ? { fontSize: '10px', padding: '1px 8px' } : {}}>{label}</span>;
}

// ---- MetricCard ----
export function MetricCard({ label, value, sub, accent }) {
  const accentMap = {
    blue:    { border: 'var(--color-action-blue)',  color: 'var(--color-action-blue)' },
    green:   { border: 'var(--color-compliant)',    color: 'var(--color-compliant)' },
    red:     { border: 'var(--color-violation)',    color: 'var(--color-violation)' },
    orange:  { border: 'var(--color-warning)',      color: 'var(--color-warning)' },
    default: { border: 'var(--slate-200)',          color: 'var(--slate-900)' },
  };
  const { border, color } = accentMap[accent] || accentMap.default;

  return (
    <div className="metric-card" style={{ borderTop: `3px solid ${border}` }}>
      <p className="metric-label">{label}</p>
      <p className="metric-value" style={{ color }}>{value}</p>
      {sub && <p className="metric-sub">{sub}</p>}
    </div>
  );
}

// ---- SyncIndicator ----
export function SyncIndicator({ status }) {
  const map = {
    synced:  { cls: 'sync-dot-synced',  text: 'All inspections synced' },
    pending: { cls: 'sync-dot-pending', text: '1 inspection waiting to sync' },
    offline: { cls: 'sync-dot-offline', text: 'Offline — changes saved locally' },
  };
  const { cls, text } = map[status] || map.synced;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>
      <span className={`sync-dot ${cls}`} />
      {text}
    </div>
  );
}

// ---- EmptyState ----
export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <p className="empty-title">{title}</p>
      {text && <p className="empty-text">{text}</p>}
      {action}
    </div>
  );
}

// ---- ConfidenceBar ----
export function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 85 ? 'var(--color-compliant)' : pct >= 65 ? 'var(--color-warning)' : 'var(--color-violation)';
  return (
    <div className="confidence-bar-wrap">
      <div className="confidence-bar-track">
        <div className="confidence-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', minWidth: 30, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

// ---- RiskLevelBadge ----
export function RiskLevelBadge({ level }) {
  const map = {
    critical: { cls: 'badge-violation', label: 'CRITICAL' },
    high:     { cls: 'badge-warning',   label: 'HIGH' },
    medium:   { cls: 'badge-blue',      label: 'MEDIUM' },
    low:      { cls: 'badge-compliant', label: 'LOW' },
  };
  const { cls, label } = map[level] || { cls: 'badge-neutral', label: level?.toUpperCase() };
  return <span className={`badge ${cls}`}>{label}</span>;
}
