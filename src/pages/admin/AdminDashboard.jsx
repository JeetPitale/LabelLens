import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Users, MapPin, ShieldAlert, Zap, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MetricCard, RiskLevelBadge } from '../../components/ui/UIComponents';
import {
  ADMIN_KPIS, INSPECTIONS_OVER_TIME, VIOLATION_FREQUENCY,
  COMPLIANCE_BY_CATEGORY, RISK_BRANDS, RISK_REGIONS
} from '../../data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>Administrator Dashboard</h1>
          <p className="page-subtitle">Legal Metrology · Maharashtra State HQ</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>
          <span className="sync-dot sync-dot-synced" />
          Live · Updated just now
        </div>
      </div>

      <div className="page-content">
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
          <MetricCard label="Inspections Today"  value={ADMIN_KPIS.inspectionsToday}  sub="Across all districts" accent="blue" />
          <MetricCard label="This Month"         value={ADMIN_KPIS.inspectionsMonth}   sub="Total inspections"   accent="blue" />
          <MetricCard label="Active Violations"  value={ADMIN_KPIS.activeViolations}   sub="Open cases"         accent="red" />
          <MetricCard label="Compliance Rate"    value={`${ADMIN_KPIS.complianceRate}%`} sub="Labels passing"   accent="green" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
          <div className="metric-card" style={{ borderTop: '3px solid var(--color-violation)' }}>
            <p className="metric-label">High-Risk Brands</p>
            <p className="metric-value" style={{ color: 'var(--color-violation)' }}>{ADMIN_KPIS.highRiskBrands}</p>
            <button className="btn btn-ghost btn-sm" style={{ padding: 0, fontSize: 'var(--text-xs)', color: 'var(--color-action-blue)', height: 'auto' }}
              onClick={() => navigate('/admin/risk')}>View Risk Intelligence →</button>
          </div>
          <div className="metric-card" style={{ borderTop: '3px solid var(--color-warning)' }}>
            <p className="metric-label">High-Risk Regions</p>
            <p className="metric-value" style={{ color: 'var(--color-warning)' }}>{ADMIN_KPIS.highRiskRegions}</p>
            <button className="btn btn-ghost btn-sm" style={{ padding: 0, fontSize: 'var(--text-xs)', color: 'var(--color-action-blue)', height: 'auto' }}
              onClick={() => navigate('/admin/risk')}>View by Region →</button>
          </div>
        </div>

        {/* Charts row */}
        <div className="two-col" style={{ marginBottom: 'var(--sp-6)' }}>
          {/* Inspections over time */}
          <div className="card card-padded">
            <h2 className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>Inspections This Week</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={INSPECTIONS_OVER_TIME} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-100)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--slate-400)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--slate-400)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--slate-900)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="inspections" stroke="#3B82F6" fill="url(#gradBlue)" strokeWidth={2} name="Total" />
                <Area type="monotone" dataKey="violations" stroke="#DC2626" fill="url(#gradRed)" strokeWidth={2} name="Violations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Donut */}
          <div className="card card-padded">
            <h2 className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>Compliance Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={COMPLIANCE_BY_CATEGORY} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" paddingAngle={3} stroke="none">
                  {COMPLIANCE_BY_CATEGORY.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: 'var(--slate-900)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={10} formatter={v => <span style={{ fontSize: 12, color: 'var(--slate-600)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violation frequency */}
        <div className="card card-padded" style={{ marginBottom: 'var(--sp-6)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>Most Common Violations</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VIOLATION_FREQUENCY} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-100)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--slate-400)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: 'var(--slate-600)' }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ background: 'var(--slate-900)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--color-action-blue)" radius={[0, 4, 4, 0]} maxBarSize={18} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* High Risk Brands */}
        <div className="two-col">
          <div>
            <div className="section-header">
              <h2 className="section-title">Top High-Risk Brands</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/risk')}>View All <ArrowRight size={13} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {RISK_BRANDS.slice(0, 4).map(b => (
                <div key={b.rank} className="card" style={{ padding: 'var(--sp-3) var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--slate-300)', fontSize: 'var(--text-sm)', minWidth: 24 }}>#{b.rank}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }} className="truncate">{b.name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{b.violations} violations · {b.violationRate}% rate</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--slate-900)' }}>{b.riskScore}</p>
                    <RiskLevelBadge level={b.level} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Risk Regions */}
          <div>
            <div className="section-header">
              <h2 className="section-title">High-Risk Regions</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/risk')}>View All <ArrowRight size={13} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {RISK_REGIONS.slice(0, 4).map(r => (
                <div key={r.rank} className="card" style={{ padding: 'var(--sp-3) var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--slate-300)', fontSize: 'var(--text-sm)', minWidth: 24 }}>#{r.rank}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }} className="truncate">{r.name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{r.inspections} inspections · {r.violationRate}% violations</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--slate-900)' }}>{r.riskScore}</p>
                    <RiskLevelBadge level={r.level} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
