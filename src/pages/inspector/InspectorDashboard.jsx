import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Clock, CheckCircle, XCircle, AlertTriangle, MapPin, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInspection } from '../../context/InspectionContext';
import { MetricCard, SyncIndicator, StatusBadge, EmptyState } from '../../components/ui/UIComponents';
import { PAST_INSPECTIONS } from '../../data/mockData';

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function InspectorDashboard() {
  const { user } = useAuth();
  const { dispatch } = useInspection();
  const navigate = useNavigate();

  const today = PAST_INSPECTIONS.filter(i => i.timestamp.startsWith('2026-09-06'));
  const compliantToday = today.filter(i => i.status === 'compliant').length;
  const violationsToday = today.filter(i => i.status === 'non-compliant').length;
  const pendingSync = PAST_INSPECTIONS.filter(i => i.syncStatus === 'pending').length;

  const handleNewInspection = () => {
    dispatch({ type: 'NEW_INSPECTION' });
    navigate('/inspector/new');
  };

  return (
    <div className="animate-fade-in">
      {/* Desktop top bar */}
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Dashboard</h1>
          <p className="page-subtitle">Department of Legal Metrology · Maharashtra</p>
        </div>
        <SyncIndicator status={pendingSync > 0 ? 'pending' : 'synced'} />
      </div>

      <div className="page-header" style={{ paddingTop: 'var(--sp-6)' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
          <div>
            <h1 className="page-title">{greeting()}, Inspector</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginTop: 4 }}>
              {user?.name} &nbsp;·&nbsp; {user?.badge} &nbsp;·&nbsp;
              <MapPin size={12} style={{ display: 'inline', marginRight: 2 }} />{user?.district}
            </p>
            <div style={{ marginTop: 8 }}>
              <SyncIndicator status={pendingSync > 0 ? 'pending' : 'synced'} />
            </div>
          </div>
          {/* Mobile CTA */}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleNewInspection}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={18} /> New Inspection
          </button>
        </div>
      </div>

      <div className="page-content" style={{ paddingTop: 'var(--sp-4)' }}>
        {/* Metrics */}
        <div className="metrics-grid" style={{ marginBottom: 'var(--sp-6)' }}>
          <MetricCard label="Inspections Today" value={today.length} sub={`${fmtDate(new Date().toISOString())}`} accent="blue" />
          <MetricCard label="Compliant" value={compliantToday} sub="Labels passed" accent="green" />
          <MetricCard label="Violations" value={violationsToday} sub="Non-compliant found" accent="red" />
          <MetricCard label="Pending Sync" value={pendingSync} sub={pendingSync > 0 ? 'Awaiting network' : 'All up to date'} accent={pendingSync > 0 ? 'orange' : 'default'} />
        </div>

        {/* Primary CTA — mobile full width */}
        <div style={{ marginBottom: 'var(--sp-6)', display: 'block' }}>
          <button
            className="btn btn-trust btn-xl btn-full"
            onClick={handleNewInspection}
            style={{ maxWidth: 480 }}
          >
            <ScanLine size={22} /> Start New Inspection
          </button>
        </div>

        {/* Recent Inspections */}
        <div className="section-header">
          <h2 className="section-title">Recent Inspections</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/inspector/history')}>
            View All <ArrowRight size={14} />
          </button>
        </div>

        {PAST_INSPECTIONS.length === 0 ? (
          <EmptyState
            icon={<ScanLine size={28} />}
            title="No inspections yet"
            text="Your inspection history will appear here."
            action={<button className="btn btn-primary" onClick={handleNewInspection}>Start New Inspection</button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {PAST_INSPECTIONS.slice(0, 5).map(insp => (
              <InspectionCard
                key={insp.inspectionId}
                insp={insp}
                onClick={() => navigate(`/inspector/history/${insp.inspectionId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InspectionCard({ insp, onClick }) {
  const statusIcon = {
    'compliant':     <CheckCircle size={16} color="var(--color-compliant)" />,
    'non-compliant': <XCircle size={16} color="var(--color-violation)" />,
    'needs-review':  <AlertTriangle size={16} color="var(--color-warning)" />,
  };

  return (
    <div className="card card-hover" onClick={onClick} role="button" tabIndex={0}
      style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-4)', alignItems: 'center' }}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Thumb */}
      <div style={{
        width: 52, height: 52, borderRadius: 'var(--radius-md)',
        background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, border: 'var(--border)'
      }}>
        <ScanLine size={22} color="var(--slate-400)" />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }} className="truncate">
            {insp.productName}
          </span>
          <StatusBadge status={insp.status} size="sm" />
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: 2 }}>
          {insp.brand} &nbsp;·&nbsp; {insp.inspectionId}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={11} /> {new Date(insp.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} /> {insp.location}
          </span>
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        {statusIcon[insp.status]}
      </div>
    </div>
  );
}
