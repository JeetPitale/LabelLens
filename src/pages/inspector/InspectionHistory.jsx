import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search, Filter, CheckCircle, XCircle, AlertTriangle, Clock, MapPin, ScanLine, ChevronRight, X
} from 'lucide-react';
import { StatusBadge, EmptyState } from '../../components/ui/UIComponents';
import { PAST_INSPECTIONS } from '../../data/mockData';

const STATUS_FILTERS = ['all', 'compliant', 'non-compliant', 'needs-review'];

export default function InspectionHistory() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = PAST_INSPECTIONS.filter(i => {
    const matchQ = !query || [i.productName, i.brand, i.inspectionId, i.location]
      .some(v => v?.toLowerCase().includes(query.toLowerCase()));
    const matchS = status === 'all' || i.status === status;
    return matchQ && matchS;
  });

  return (
    <div>
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Inspection History</h1>
          <p className="page-subtitle">{PAST_INSPECTIONS.length} records · Maharashtra</p>
        </div>
      </div>

      <div className="page-content">
        {/* Search + Filter bar */}
        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              className="search-input"
              placeholder="Search product, brand, SKU, inspection ID…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search inspections"
            />
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(v => !v)} aria-expanded={showFilters}>
            <Filter size={14} /> Filters {showFilters && <X size={12} />}
          </button>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                className={`chip ${status === s ? 'chip-active' : ''}`}
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
              >
                {s === 'all' ? 'All' : s === 'compliant' ? '✓ Compliant' : s === 'non-compliant' ? '✗ Non-Compliant' : '~ Needs Review'}
              </button>
            ))}
          </div>
        )}

        {/* Status tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--sp-5)', overflowX: 'auto', paddingBottom: 4 }}>
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                background: status === s ? 'var(--color-action-blue)' : 'var(--slate-100)',
                color: status === s ? '#fff' : 'var(--slate-600)',
                transition: 'all var(--transition-fast)',
              }}
              aria-pressed={status === s}
            >
              {s === 'all' ? `All (${PAST_INSPECTIONS.length})` : s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ScanLine size={28} />}
            title="No inspections found"
            text="Try adjusting your search or filters."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {filtered.map(insp => (
              <HistoryCard
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

function HistoryCard({ insp, onClick }) {
  const color = {
    'compliant':     'var(--color-compliant)',
    'non-compliant': 'var(--color-violation)',
    'needs-review':  'var(--color-warning)',
  };
  return (
    <div
      className="card card-hover"
      style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-4)', cursor: 'pointer', borderLeft: `3px solid ${color[insp.status]}` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View inspection: ${insp.productName}`}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--slate-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <ScanLine size={20} color="var(--slate-400)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
          <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }} className="truncate">{insp.productName}</span>
          <StatusBadge status={insp.status} size="sm" />
          {insp.syncStatus === 'pending' && <StatusBadge status="pending" size="sm" />}
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{insp.brand} &nbsp;·&nbsp; <code style={{ background: 'var(--slate-100)', padding: '1px 4px', borderRadius: 3 }}>{insp.inspectionId}</code></p>
        <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={11} /> {new Date(insp.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} /> {insp.location}
          </span>
        </div>
        {insp.violations.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {insp.violations.map(v => (
              <span key={v} style={{
                fontSize: '10px', padding: '1px 7px', borderRadius: 'var(--radius-full)',
                background: 'var(--color-violation-bg)', color: 'var(--color-violation-dark)',
                border: '1px solid var(--color-violation-border)', fontWeight: 500,
              }}>
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight size={16} color="var(--slate-300)" style={{ flexShrink: 0, alignSelf: 'center' }} />
    </div>
  );
}
