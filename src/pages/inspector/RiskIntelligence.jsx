import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { RiskLevelBadge } from '../../components/ui/UIComponents';
import { RISK_BRANDS, RISK_REGIONS } from '../../data/mockData';

function TrendIcon({ trend }) {
  if (trend === 'up')    return <TrendingUp size={14} color="var(--color-violation)" />;
  if (trend === 'down')  return <TrendingDown size={14} color="var(--color-compliant)" />;
  return <Minus size={14} color="var(--slate-400)" />;
}

function RiskRow({ item, type }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        style={{
          cursor: 'pointer',
          background: open ? 'var(--slate-50)' : 'var(--bg-card)',
          transition: 'background var(--transition-fast)',
        }}
        onClick={() => setOpen(v => !v)}
        role="row"
        aria-expanded={open}
      >
        <td style={{ padding: 'var(--sp-4)', fontWeight: 700, color: 'var(--slate-400)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>#{item.rank}</td>
        <td style={{ padding: 'var(--sp-4)', fontWeight: 'var(--fw-semibold)', color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {item.name}
            {open ? <ChevronUp size={14} color="var(--slate-400)" /> : <ChevronDown size={14} color="var(--slate-400)" />}
          </div>
        </td>
        <td style={{ padding: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 48, height: 6, background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.riskScore}%`, height: '100%', borderRadius: 'var(--radius-full)',
                background: item.riskScore >= 75 ? 'var(--color-violation)' : item.riskScore >= 50 ? 'var(--color-warning)' : item.riskScore >= 30 ? 'var(--color-action-blue)' : 'var(--color-compliant)',
              }} />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--slate-700)' }}>{item.riskScore}</span>
          </div>
        </td>
        <td style={{ padding: 'var(--sp-4)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>{item.inspections}</td>
        <td style={{ padding: 'var(--sp-4)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-violation)', fontWeight: 600 }}>{item.violations}</td>
        <td style={{ padding: 'var(--sp-4)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>{item.violationRate}%</td>
        <td style={{ padding: 'var(--sp-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>{item.lastChecked}</td>
        <td style={{ padding: 'var(--sp-4)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
            <TrendIcon trend={item.trend} />
            <RiskLevelBadge level={item.level} />
          </div>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={8} style={{ padding: 0 }}>
            <div style={{
              background: 'var(--slate-50)', borderTop: 'var(--border)', borderBottom: 'var(--border)',
              padding: 'var(--sp-4) var(--sp-6)',
            }}>
              <p style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--slate-700)', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={14} /> Why is this risk score high?
              </p>
              {item.breakdown && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
                  {Object.entries(item.breakdown).filter(([k]) => k !== 'violations_detail').map(([type, count]) => (
                    <div key={type} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'var(--color-violation-bg)', border: '1px solid var(--color-violation-border)',
                      borderRadius: 'var(--radius-md)', padding: 'var(--sp-2) var(--sp-3)', fontSize: 'var(--text-xs)',
                    }}>
                      <span style={{ color: 'var(--color-violation-dark)', fontWeight: 600 }}>{count}×</span>
                      <span style={{ color: 'var(--slate-700)' }}>{type}</span>
                    </div>
                  ))}
                </div>
              )}
              {item.breakdown?.violations_detail?.map((d, i) => (
                <div key={i} className="alert alert-warning" style={{ marginTop: 'var(--sp-3)' }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-xs)' }}>{d}</span>
                </div>
              ))}
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: 'var(--sp-3)' }}>
                Risk score is computed from violation frequency, recency, inspection count, and repeated non-compliance patterns.
                It is not an AI prediction — it is derived directly from verified inspection records.
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RiskIntelligence() {
  const [view, setView] = useState('brands');

  const data = view === 'brands' ? RISK_BRANDS : RISK_REGIONS;

  return (
    <div>
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Risk Intelligence</h1>
          <p className="page-subtitle">Real-time compliance risk · Maharashtra</p>
        </div>
      </div>

      <div className="page-content">
        <div className="alert alert-info" style={{ marginBottom: 'var(--sp-5)' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>Demo data.</strong> Risk scores update dynamically based on field inspection logs.
            Seeded sample baseline data is provided for active monitoring and demonstration.
          </span>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--sp-5)' }}>
          {['brands', 'regions'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`chip ${view === v ? 'chip-active' : ''}`}>
              {v === 'brands' ? 'High-Risk Brands' : 'High-Risk Regions'}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div style={{ overflowX: 'auto' }} className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label={`High-risk ${view}`}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', borderBottom: 'var(--border)' }}>
                {['#', view === 'brands' ? 'Brand' : 'Region', 'Risk Score', 'Inspections', 'Violations', 'Violation %', 'Last Checked', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: 'var(--sp-3) var(--sp-4)', textAlign: h === '#' || h === 'Risk Score' || h === 'Inspections' || h === 'Violations' || h === 'Violation %' || h === 'Last Checked' || h === 'Status' ? 'center' : 'left',
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--slate-500)',
                    textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <RiskRow key={item.rank} item={item} type={view} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div style={{ display: 'none' }}>
          {data.map(item => (
            <div key={item.rank} className="card card-padded" style={{ marginBottom: 'var(--sp-3)', borderLeft: `3px solid ${item.level === 'critical' ? 'var(--color-violation)' : item.level === 'high' ? 'var(--color-warning)' : 'var(--color-action-blue)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', fontWeight: 700 }}>#{item.rank}</span>
                  <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)', marginTop: 2 }}>{item.name}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: 2 }}>
                    {item.inspections} inspections · {item.violations} violations ({item.violationRate}%)
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)' }}>{item.riskScore}</p>
                  <RiskLevelBadge level={item.level} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
