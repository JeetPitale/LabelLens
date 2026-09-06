import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanLine, Upload, CheckCircle, XCircle, AlertTriangle, Clock, Flag,
  ShieldCheck, ChevronRight, Info
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { StatusBadge } from '../../components/ui/UIComponents';
import { CONSUMER_SCANS } from '../../data/mockData';

export default function ConsumerHome() {
  const { dispatch } = useInspection();
  const navigate = useNavigate();
  const [flagged, setFlagged] = useState(false);

  const handleScan = () => {
    dispatch({ type: 'NEW_INSPECTION' });
    navigate('/consumer/scan');
  };

  return (
    <div className="animate-fade-in">
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Consumer Portal</h1>
          <p className="page-subtitle">Check product label compliance</p>
        </div>
      </div>

      <div className="page-content">
        {/* Hero card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-trust-blue) 0%, var(--color-action-blue) 100%)',
          borderRadius: 'var(--radius-xl)', padding: 'var(--sp-8)', color: '#fff',
          marginBottom: 'var(--sp-6)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }}>
            <ShieldCheck size={180} />
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-3)' }}>
              <ShieldCheck size={24} />
              <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>LabelLens</span>
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)' }}>
              Check Your Product Label
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', opacity: 0.85, marginBottom: 'var(--sp-6)', maxWidth: 400, lineHeight: 1.6 }}>
              Check whether important information on a packaged product label appears to comply with
              Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <button
                className="btn btn-xl"
                style={{ background: '#fff', color: 'var(--color-trust-blue)', fontWeight: 700 }}
                onClick={handleScan}
              >
                <ScanLine size={20} /> Scan Product
              </button>
              <button
                className="btn btn-xl"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}
                onClick={handleScan}
              >
                <Upload size={18} /> Upload Label Image
              </button>
            </div>
          </div>
        </div>

        {/* What we check */}
        <div className="card card-padded" style={{ marginBottom: 'var(--sp-6)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>What We Check</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-3)' }}>
            {[
              'Maximum Retail Price (MRP)',
              'Net Quantity / Weight',
              'Manufacturer Details',
              'Date of Manufacture',
              'Consumer Care Contact',
              'Country of Origin',
              'Generic Product Name',
              'Best Before / Expiry',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--slate-700)' }}>
                <CheckCircle size={14} color="var(--color-compliant)" style={{ flexShrink: 0 }} /> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Recent scans */}
        <div className="section-header" style={{ marginBottom: 'var(--sp-3)' }}>
          <h2 className="section-title">Your Recent Scans</h2>
        </div>
        {CONSUMER_SCANS.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><ScanLine size={28} /></div>
            <p className="empty-title">No scans yet</p>
            <p className="empty-text">Scan your first product label to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {CONSUMER_SCANS.map(scan => (
              <div key={scan.id} className="card" style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: scan.result === 'compliant' ? 'var(--color-compliant-bg)' : 'var(--color-violation-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {scan.result === 'compliant'
                    ? <CheckCircle size={22} color="var(--color-compliant)" />
                    : <XCircle size={22} color="var(--color-violation)" />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }}>{scan.productName}</span>
                    <StatusBadge status={scan.result} size="sm" />
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{scan.brand}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {new Date(scan.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {scan.issues.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-violation-dark)', fontWeight: 600, marginBottom: 4 }}>
                        {scan.issuesFound} issue{scan.issuesFound > 1 ? 's' : ''} detected:
                      </p>
                      {scan.issues.map(issue => (
                        <div key={issue} style={{
                          fontSize: 'var(--text-xs)', color: 'var(--color-violation-dark)',
                          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2,
                        }}>
                          <XCircle size={11} /> {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Flag product */}
        <div className="card card-padded" style={{ marginTop: 'var(--sp-6)', background: 'var(--color-warning-bg)', borderColor: 'var(--color-warning-border)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
            <Flag size={18} color="var(--color-warning-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--color-warning-dark)', marginBottom: 4 }}>
                Suspect a product violation?
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-600)', marginBottom: 'var(--sp-3)', lineHeight: 1.5 }}>
                If you believe a product label is misleading or missing mandatory information, report it to the Legal Metrology Department.
              </p>
              <button
                className="btn btn-sm"
                style={{ background: 'var(--color-warning)', color: '#fff', border: 'none' }}
                onClick={() => setFlagged(true)}
                disabled={flagged}
              >
                {flagged ? <><CheckCircle size={13} /> Report Submitted</> : <><Flag size={13} /> Flag Suspicious Product</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
