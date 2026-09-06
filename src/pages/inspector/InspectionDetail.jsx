import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, User, CheckCircle, XCircle, AlertTriangle,
  Download, Share2, FileText, ScanLine, MessageSquare, ChevronRight
} from 'lucide-react';
import { StatusBadge, ConfidenceBar } from '../../components/ui/UIComponents';
import { PAST_INSPECTIONS } from '../../data/mockData';

export default function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const insp = PAST_INSPECTIONS.find(i => i.inspectionId === id) || PAST_INSPECTIONS[0];
  const [tab, setTab] = useState('declarations');

  if (!insp) return (
    <div className="page-content">
      <p style={{ color: 'var(--slate-500)' }}>Inspection not found.</p>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
    </div>
  );

  const pass    = insp.declarations.filter(d => d.status === 'pass').length;
  const fail    = insp.declarations.filter(d => d.status === 'fail').length;
  const uncert  = insp.declarations.filter(d => d.status === 'uncertain').length;
  const statusColor = { compliant: 'var(--color-compliant)', 'non-compliant': 'var(--color-violation)', 'needs-review': 'var(--color-warning)' };

  return (
    <div>
      {/* Mobile back header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        padding: 'var(--sp-4) var(--sp-4) 0',
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="page-content">
        {/* Status header */}
        <div style={{
          padding: 'var(--sp-5) var(--sp-6)', borderRadius: 'var(--radius-xl)',
          background: statusColor[insp.status], color: '#fff',
          marginBottom: 'var(--sp-5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {insp.inspectionId}
              </p>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', marginTop: 4 }}>{insp.productName}</h1>
              <p style={{ opacity: 0.85, fontSize: 'var(--text-sm)', marginTop: 2 }}>{insp.brand}</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-3) var(--sp-4)', textAlign: 'center',
            }}>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)' }}>{pass}/{insp.declarations.length}</p>
              <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Declarations passed</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.85 }}>
              <Clock size={12} /> {new Date(insp.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.85 }}>
              <MapPin size={12} /> {insp.location}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.85 }}>
              <User size={12} /> {insp.inspectorId}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--sp-5)', borderBottom: 'var(--border)', paddingBottom: 0 }}>
          {['declarations', 'violations', 'report'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: 'var(--sp-2) var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 600,
              cursor: 'pointer', background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid var(--color-action-blue)' : '2px solid transparent',
              color: tab === t ? 'var(--color-action-blue)' : 'var(--slate-500)',
              marginBottom: -1,
            }}>
              {t === 'declarations' ? 'Declarations' : t === 'violations' ? `Violations (${fail + uncert})` : 'Report'}
            </button>
          ))}
        </div>

        {tab === 'declarations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {insp.declarations.map(d => (
              <div key={d.id} className="card" style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start', borderLeft: `3px solid ${d.status === 'pass' ? 'var(--color-compliant)' : d.status === 'fail' ? 'var(--color-violation)' : 'var(--color-warning)'}` }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  background: d.status === 'pass' ? 'var(--color-compliant-bg)' : d.status === 'fail' ? 'var(--color-violation-bg)' : 'var(--color-warning-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {d.status === 'pass' && <CheckCircle size={14} color="var(--color-compliant)" />}
                  {d.status === 'fail' && <XCircle size={14} color="var(--color-violation)" />}
                  {d.status === 'uncertain' && <AlertTriangle size={14} color="var(--color-warning)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }}>{d.label}</span>
                    <StatusBadge status={d.status} size="sm" />
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-600)', marginTop: 4 }}>
                    {d.correctedValue || d.extractedValue || <em style={{ color: 'var(--slate-400)' }}>Not detected</em>}
                  </p>
                  {d.confidence > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <ConfidenceBar value={d.confidence} />
                    </div>
                  )}
                  {d.violationReason && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-violation-dark)', marginTop: 6, background: 'var(--color-violation-bg)', padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}>
                      {d.violationReason}
                    </p>
                  )}
                  <span style={{ fontSize: 10, color: 'var(--slate-400)', marginTop: 4, display: 'block' }}>{d.ruleReference}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'violations' && (
          <div>
            {insp.violations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><CheckCircle size={28} color="var(--color-compliant)" /></div>
                <p className="empty-title">No active violations</p>
                <p className="empty-text">All mandatory declarations were detected and passed.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {insp.violations.map((v, i) => (
                  <div key={i} className="card card-padded" style={{ borderLeft: '3px solid var(--color-violation)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                    <XCircle size={18} color="var(--color-violation)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>{v}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: 2 }}>Violation detected · Reference: Legal Metrology (PC) Rules, 2011</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'report' && (
          <div>
            <div className="card card-padded" style={{ marginBottom: 'var(--sp-4)', borderTop: '3px solid var(--color-trust-blue)' }}>
              <div style={{ textAlign: 'center', paddingBottom: 'var(--sp-4)', borderBottom: 'var(--border)', marginBottom: 'var(--sp-4)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Government of India · Department of Legal Metrology
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: 2 }}>
                  Consumer Affairs · Maharashtra
                </p>
              </div>
              <h2 style={{ fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', marginBottom: 'var(--sp-4)', fontSize: 'var(--text-lg)' }}>
                Inspection Report
              </h2>
              {[
                ['Inspection ID', insp.inspectionId],
                ['Inspector ID', insp.inspectorId],
                ['Date / Time', new Date(insp.timestamp).toLocaleString('en-IN')],
                ['Location', insp.location],
                ['Product', insp.productName],
                ['Brand', insp.brand],
                ['SKU', insp.sku],
                ['Final Verdict', insp.status.toUpperCase()],
                ['Violations', insp.violations.length > 0 ? insp.violations.join('; ') : 'None'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--slate-100)', fontSize: 'var(--text-sm)', gap: 16 }}>
                  <span style={{ color: 'var(--slate-500)', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontWeight: 500, color: 'var(--slate-800)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <button className="btn btn-trust" style={{ flex: 1 }}>
                <Download size={16} /> Download PDF Report
              </button>
              <button className="btn btn-secondary">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
