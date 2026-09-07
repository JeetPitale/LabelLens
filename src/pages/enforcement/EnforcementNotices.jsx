import React, { useState } from 'react';
import { Gavel, Search, Filter, CheckCircle, AlertTriangle, FileText, Download, Scale } from 'lucide-react';
import { MOCK_LEGAL_NOTICES } from '../../data/mockData';
import { useToast } from '../../components/ui/UIComponents';

export default function EnforcementNotices() {
  const { addToast } = useToast();
  const [notices, setNotices] = useState(MOCK_LEGAL_NOTICES);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const filteredNotices = notices.filter(n => {
    const matchesFilter = filter === 'All' || n.status === filter;
    const matchesSearch =
      n.noticeId.toLowerCase().includes(search.toLowerCase()) ||
      n.violator.toLowerCase().includes(search.toLowerCase()) ||
      n.productName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (noticeId, newStatus) => {
    setNotices(prev => prev.map(n => n.noticeId === noticeId ? { ...n, status: newStatus } : n));
    if (selectedNotice?.noticeId === noticeId) {
      setSelectedNotice(prev => ({ ...prev, status: newStatus }));
    }
    addToast(`Notice ${noticeId} status updated to '${newStatus}'`, 'success');
  };

  return (
    <div className="animate-fade-in">
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Legal Notices & Enforcement Register</h1>
          <p className="page-subtitle">Department of Legal Metrology · Section 36 & Compounding Orders</p>
        </div>
      </div>

      <div className="page-content" style={{ paddingTop: 'var(--sp-4)' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search notice ID, brand, or product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'Notice Issued', 'Pending Response', 'Compounded', 'Prosecution Filed'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`chip ${filter === st ? 'chip-active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* List of Notices */}
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', borderBottom: 'var(--border)' }}>
                {['Notice ID', 'Violator / Offender', 'Legal Metrology Act Section', 'Compounding Fee', 'Status', 'Issue Date', 'Actions'].map(h => (
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
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--slate-400)' }}>
                    No legal notices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredNotices.map(n => (
                  <tr key={n.noticeId} style={{ borderBottom: 'var(--border)' }}>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--slate-800)' }}>
                      {n.noticeId}
                    </td>
                    <td style={{ padding: 'var(--sp-4)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--slate-800)' }}>{n.violator}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{n.productName} ({n.district})</p>
                    </td>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-xs)', color: 'var(--slate-600)' }}>
                      {n.actSection}
                    </td>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--slate-900)' }}>
                      ₹{n.compoundingFee.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: 'var(--sp-4)' }}>
                      <span className={`badge ${n.status === 'Compounded' ? 'badge-success' : n.status === 'Prosecution Filed' ? 'badge-error' : 'badge-warning'}`}>
                        {n.status}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--sp-4)', fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>
                      {n.issueDate}
                    </td>
                    <td style={{ padding: 'var(--sp-4)' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedNotice(n)}
                        >
                          View Notice
                        </button>
                        {n.status !== 'Compounded' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateStatus(n.noticeId, 'Compounded')}
                            style={{ background: 'var(--color-compliant)', borderColor: 'var(--color-compliant)' }}
                          >
                            Mark Compounded
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice Detail Drawer/Modal */}
      {selectedNotice && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--sp-4)'
        }}>
          <div className="card card-padded animate-fade-in" style={{ width: '100%', maxWidth: 560, background: '#fff', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: 'var(--border)', paddingBottom: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
              <div>
                <span className="badge badge-error" style={{ marginBottom: 4 }}>FORMAL LEGAL NOTICE</span>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{selectedNotice.noticeId}</h2>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedNotice(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', fontSize: 'var(--text-sm)' }}>
              <div>
                <strong style={{ color: 'var(--slate-500)', fontSize: 'var(--text-xs)' }}>OFFENDER / MANUFACTURER:</strong>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--slate-900)' }}>{selectedNotice.violator}</p>
              </div>

              <div>
                <strong style={{ color: 'var(--slate-500)', fontSize: 'var(--text-xs)' }}>LEGAL ACT & SECTION:</strong>
                <p style={{ fontWeight: 500, color: 'var(--slate-800)' }}>{selectedNotice.actSection}</p>
              </div>

              <div>
                <strong style={{ color: 'var(--slate-500)', fontSize: 'var(--text-xs)' }}>NON-COMPLIANCE VIOLATIONS:</strong>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {selectedNotice.violations.map(v => (
                    <span key={v} className="chip chip-active" style={{ background: 'var(--color-violation-bg)', color: 'var(--color-violation-dark)', border: 'none' }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', background: 'var(--slate-50)', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>Compounding Penalty Fee</span>
                  <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--slate-900)' }}>
                    ₹{selectedNotice.compoundingFee.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>Hearing / Reply Deadline</span>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {selectedNotice.hearingDate || 'Compounded'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => addToast('Notice PDF generated and ready for download!', 'info')}
                >
                  <Download size={16} /> Download Notice PDF
                </button>
                {selectedNotice.status !== 'Prosecution Filed' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdateStatus(selectedNotice.noticeId, 'Prosecution Filed')}
                    style={{ background: 'var(--color-violation)', borderColor: 'var(--color-violation)' }}
                  >
                    <Scale size={16} /> Escalate to Court Prosecution
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
