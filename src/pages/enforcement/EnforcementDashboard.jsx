import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, AlertTriangle, FileText, CheckCircle, Scale, DollarSign, ArrowRight, ShieldAlert, Filter, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard, StatusBadge, Modal, useToast } from '../../components/ui/UIComponents';
import { PAST_INSPECTIONS, MOCK_LEGAL_NOTICES } from '../../data/mockData';

export default function EnforcementDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [notices, setNotices] = useState(MOCK_LEGAL_NOTICES);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [actSection, setActSection] = useState('Section 36(1) of Legal Metrology Act, 2009');
  const [compoundingFee, setCompoundingFee] = useState('25000');
  const [notes, setNotes] = useState('');

  // Flagged non-compliant inspections needing enforcement action
  const nonCompliantInspections = PAST_INSPECTIONS.filter(i => i.status === 'non-compliant');

  const totalFinesCollected = notices
    .filter(n => n.status === 'Compounded')
    .reduce((sum, n) => sum + (n.compoundingFee || 0), 345000);

  const handleIssueNotice = (e) => {
    e.preventDefault();
    if (!selectedInspection) return;

    const newNotice = {
      noticeId: `NOTICE-2026-0${Math.floor(100 + Math.random() * 900)}`,
      inspectionId: selectedInspection.id,
      productName: selectedInspection.productName || 'Inspected Package',
      brand: selectedInspection.brand || 'Vendor Product',
      violator: `${selectedInspection.brand || 'Vendor'} FMCG Pvt Ltd`,
      district: selectedInspection.district || user?.district || 'Pune',
      actSection,
      violations: selectedInspection.violations || ['Missing MRP', 'Non-compliant Label'],
      status: 'Notice Issued',
      issueDate: new Date().toISOString().split('T')[0],
      compoundingFee: Number(compoundingFee) || 25000,
      hearingDate: '2026-09-24',
      assignedOfficer: user?.name || 'Vikramaditya Deshmukh',
    };

    setNotices([newNotice, ...notices]);
    setSelectedInspection(null);
    addToast('Legal Notice successfully issued and dispatched!', 'success');
  };

  return (
    <div className="animate-fade-in">
      {/* Desktop Topbar */}
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Enforcement Dashboard</h1>
          <p className="page-subtitle">Legal Metrology Act, 2009 & Rule 18 Enforcement Unit · Maharashtra</p>
        </div>
      </div>

      <div className="page-content" style={{ paddingTop: 'var(--sp-4)' }}>
        {/* Officer Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--sp-6)',
          marginBottom: 'var(--sp-6)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--sp-4)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.25)', color: '#FCA5A5', border: '1px solid rgba(248, 113, 113, 0.4)' }}>
                Enforcement Division
              </span>
              <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>{user?.badge}</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Welcome, Officer {user?.name}</h2>
            <p style={{ fontSize: 'var(--text-sm)', opacity: 0.85, marginTop: 4 }}>
              Review inspection violations, issue compounding notices, and enforce Legal Metrology compliance.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/enforcement/notices')}
            style={{ background: '#fff', color: '#1E1B4B', fontWeight: 600 }}
          >
            <Gavel size={18} /> Manage Legal Notices
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid" style={{ marginBottom: 'var(--sp-6)' }}>
          <MetricCard
            label="Pending Action"
            value={nonCompliantInspections.length}
            sub="Inspections awaiting legal review"
            accent="red"
          />
          <MetricCard
            label="Active Notices"
            value={notices.filter(n => n.status === 'Notice Issued' || n.status === 'Pending Response').length}
            sub="Legal notices served"
            accent="orange"
          />
          <MetricCard
            label="Compounded Revenue"
            value={`₹${(totalFinesCollected / 1000).toFixed(0)}k`}
            sub="Fines & compounding fees"
            accent="green"
          />
          <MetricCard
            label="Prosecutions"
            value={notices.filter(n => n.status === 'Prosecution Filed').length}
            sub="Escalated to legal tribunal"
            accent="blue"
          />
        </div>

        {/* Flagged Inspections Queue */}
        <div className="card card-padded" style={{ marginBottom: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={20} color="var(--color-violation)" />
                Flagged Non-Compliant Queue
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: 2 }}>
                Field inspection reports with confirmed violations awaiting Enforcement Officer notice dispatch.
              </p>
            </div>
            <span className="badge badge-error">{nonCompliantInspections.length} Violations Pending</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {nonCompliantInspections.map(insp => (
              <div
                key={insp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--sp-4)',
                  border: '1px solid var(--slate-200)',
                  borderLeft: '4px solid var(--color-violation)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--slate-50)',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-3)',
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--slate-400)' }}>{insp.id}</span>
                    <StatusBadge status={insp.status} size="sm" />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>• {insp.district}</span>
                  </div>
                  <p style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--slate-800)', fontSize: 'var(--text-base)' }}>{insp.productName}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-violation-dark)', marginTop: 4, fontWeight: 500 }}>
                    Violations: {insp.violations?.join(', ') || 'Missing Mandatory Declarations'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/inspector/history/${insp.id}`)}
                  >
                    Review Case
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedInspection(insp)}
                    style={{ background: 'var(--color-violation)', borderColor: 'var(--color-violation)' }}
                  >
                    <Send size={14} /> Issue Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Legal Notices Summary Table */}
        <div className="card">
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Recent Enforcement Notices</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/enforcement/notices')}>
              View All Notices <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--slate-50)', borderBottom: 'var(--border)' }}>
                  {['Notice ID', 'Violator Brand', 'Legal Act Section', 'Compounding Fee', 'Status', 'Issue Date'].map(h => (
                    <th key={h} style={{
                      padding: 'var(--sp-3) var(--sp-4)',
                      textAlign: 'left',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--slate-500)',
                      textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notices.slice(0, 5).map(n => (
                  <tr key={n.noticeId} style={{ borderBottom: 'var(--border)' }}>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--slate-800)' }}>{n.noticeId}</td>
                    <td style={{ padding: 'var(--sp-4)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--slate-800)' }}>{n.violator}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{n.productName}</p>
                    </td>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-xs)', color: 'var(--slate-600)' }}>{n.actSection}</td>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--slate-900)' }}>
                      ₹{n.compoundingFee.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: 'var(--sp-4)' }}>
                      <span className={`badge ${n.status === 'Compounded' ? 'badge-success' : n.status === 'Prosecution Filed' ? 'badge-error' : 'badge-warning'}`}>
                        {n.status}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{n.issueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal — Issue Legal Notice */}
      {selectedInspection && (
        <Modal
          title={`Issue Legal Notice — ${selectedInspection.id}`}
          isOpen={!!selectedInspection}
          onClose={() => setSelectedInspection(null)}
        >
          <form onSubmit={handleIssueNotice} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="alert alert-warning">
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-xs)' }}>
                Issuing a formal Legal Notice under the Legal Metrology Act, 2009 for non-compliance found on <strong>{selectedInspection.productName}</strong>.
              </span>
            </div>

            <div>
              <label className="form-label">Offending Entity / Manufacturer</label>
              <input
                className="form-input"
                type="text"
                value={`${selectedInspection.brand || 'Vendor'} FMCG India Pvt Ltd`}
                readOnly
              />
            </div>

            <div>
              <label className="form-label">Applicable Legal Act Section</label>
              <select
                className="form-input"
                value={actSection}
                onChange={e => setActSection(e.target.value)}
              >
                <option value="Section 36(1) of Legal Metrology Act, 2009">Section 36(1) — Penalty for non-conforming package declaration</option>
                <option value="Section 36(2) of Legal Metrology Act, 2009">Section 36(2) — Penalty for manufacture/sale of non-standard packages</option>
                <option value="Rule 18(1) of LM (PC) Rules, 2011">Rule 18(1) — Mandatory declaration compliance failure</option>
                <option value="Section 39 of Legal Metrology Act, 2009">Section 39 — Penalty for offences by companies</option>
              </select>
            </div>

            <div>
              <label className="form-label">Proposed Compounding Fee (₹)</label>
              <input
                className="form-input"
                type="number"
                value={compoundingFee}
                onChange={e => setCompoundingFee(e.target.value)}
                min="5000"
                max="100000"
                step="5000"
              />
            </div>

            <div>
              <label className="form-label">Officer Remarks & Order Directives</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Enter directives, reply deadline (14 days), and seizure/inspection summary..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'var(--sp-2)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedInspection(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: 'var(--color-violation)', borderColor: 'var(--color-violation)' }}
              >
                <Send size={16} /> Dispatch Legal Notice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
