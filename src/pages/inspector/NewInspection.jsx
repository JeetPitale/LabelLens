import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Upload, ImageIcon, Zap, CheckCircle, XCircle, AlertTriangle,
  RotateCcw, ChevronRight, ChevronLeft, FileText, Edit3, Shield,
  CheckSquare, ArrowRight, ScanLine, Info, Clock
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { useToast } from '../../components/ui/UIComponents';
import { StatusBadge, ConfidenceBar, Modal } from '../../components/ui/UIComponents';
import { SAMPLE_DECLARATIONS_FAIL } from '../../data/mockData';

/* ---------- Step Progress Bar ---------- */
const STEPS = [
  { label: 'Entry' },
  { label: 'Capture' },
  { label: 'Quality' },
  { label: 'Processing' },
  { label: 'Results' },
  { label: 'Review' },
  { label: 'Finalize' },
  { label: 'Report' },
];

function StepProgress({ current }) {
  return (
    <div className="step-progress" role="progressbar" aria-valuemin={1} aria-valuemax={8} aria-valuenow={current}>
      {STEPS.map((s, i) => {
        const n = i + 1;
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className={`step-item ${done ? 'step-done' : ''} ${active ? 'step-active' : ''}`}>
            <div className="step-circle">
              {done ? <CheckCircle size={14} /> : n}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Step 1 — Entry ---------- */
function Step1Entry({ onNext }) {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', marginBottom: 8 }}>
        Start Inspection
      </h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-8)' }}>
        Capture the product label or upload an existing image to begin.
      </p>
      <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
        <button className="entry-card" onClick={() => onNext('camera')}>
          <div className="entry-card-icon" style={{ background: 'var(--color-action-blue-light)' }}>
            <Camera size={32} color="var(--color-action-blue)" />
          </div>
          <div>
            <p className="entry-card-title">Scan with Camera</p>
            <p className="entry-card-desc">Capture the product label directly using your device camera</p>
          </div>
          <ChevronRight size={20} color="var(--slate-400)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </button>
        <button className="entry-card" onClick={() => onNext('upload')}>
          <div className="entry-card-icon" style={{ background: 'var(--color-compliant-bg)' }}>
            <Upload size={32} color="var(--color-compliant)" />
          </div>
          <div>
            <p className="entry-card-title">Upload Label Image</p>
            <p className="entry-card-desc">Choose an existing label image from your device gallery</p>
          </div>
          <ChevronRight size={20} color="var(--slate-400)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </button>
      </div>
      <div className="alert alert-info" style={{ marginTop: 'var(--sp-6)' }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>You may scan multiple sides of the package if declarations appear across different surfaces.</span>
      </div>
      <style>{`
        .entry-card {
          display: flex; align-items: center; gap: var(--sp-4);
          padding: var(--sp-5) var(--sp-5);
          background: var(--bg-card); border: 1.5px solid var(--slate-200);
          border-radius: var(--radius-xl); cursor: pointer; text-align: left;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
          width: 100%;
        }
        .entry-card:hover { border-color: var(--color-action-blue); box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .entry-card-icon {
          width: 64px; height: 64px; border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .entry-card-title { font-size: var(--text-base); font-weight: var(--fw-semibold); color: var(--slate-800); }
        .entry-card-desc  { font-size: var(--text-sm); color: var(--slate-500); margin-top: 2px; }
      `}</style>
    </div>
  );
}

/* ---------- Step 2 — Capture ---------- */
function Step2Capture({ mode, onCapture, onBack }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', marginBottom: 8 }}>
        {mode === 'camera' ? 'Capture Label' : 'Upload Label Image'}
      </h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-6)' }}>
        Ensure the entire label is visible, well-lit, and in focus.
      </p>

      {!preview ? (
        <div
          className="capture-zone"
          onClick={() => fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Click to upload label image"
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
        >
          <div className="capture-frame">
            <div className="capture-corner tl" /><div className="capture-corner tr" />
            <div className="capture-corner bl" /><div className="capture-corner br" />
          </div>
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            {mode === 'camera' ? <Camera size={48} color="var(--slate-300)" /> : <ImageIcon size={48} color="var(--slate-300)" />}
            <p style={{ color: 'var(--slate-400)', marginTop: 'var(--sp-3)', fontWeight: 'var(--fw-medium)' }}>
              {mode === 'camera' ? 'Click to simulate camera capture' : 'Click to choose an image'}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: 4 }}>
              Position the label within the frame
            </p>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border)' }}>
          <img src={preview} alt="Captured label" style={{ width: '100%', maxHeight: 360, objectFit: 'contain', background: 'var(--slate-900)' }} />
          <button
            className="btn btn-secondary btn-sm"
            style={{ position: 'absolute', top: 12, right: 12 }}
            onClick={() => setPreview(null)}
          >
            <RotateCcw size={14} /> Retake
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" capture={mode === 'camera' ? 'environment' : undefined}
        style={{ display: 'none' }} onChange={handleFile} aria-hidden="true" />

      <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-6)' }}>
        <button className="btn btn-secondary" onClick={onBack}><ChevronLeft size={16} /> Back</button>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => onCapture(preview)}
          disabled={!preview}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>

      <style>{`
        .capture-zone {
          border: 2px dashed var(--slate-200); border-radius: var(--radius-xl);
          min-height: 300px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; transition: border-color var(--transition-fast), background var(--transition-fast);
          background: var(--slate-50);
        }
        .capture-zone:hover { border-color: var(--color-action-blue); background: var(--color-action-blue-light); }
        .capture-frame { position: absolute; inset: 20px; pointer-events: none; }
        .capture-corner {
          position: absolute; width: 20px; height: 20px;
          border-color: var(--slate-300); border-style: solid;
        }
        .capture-corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .capture-corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .capture-corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .capture-corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
      `}</style>
    </div>
  );
}

/* ---------- Step 3 — Quality Check ---------- */
function Step3Quality({ image, onProceed, onRetake }) {
  const [checking, setChecking] = useState(true);
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      // Simulate quality check
      const hasImage = !!image;
      setQuality({
        blur: hasImage ? 'good' : 'poor',
        brightness: hasImage ? 'good' : 'poor',
        resolution: hasImage ? 'good' : 'acceptable',
        textVisible: hasImage ? 'good' : 'poor',
        score: hasImage ? 82 : 30,
      });
      setChecking(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [image]);

  const good = quality?.score >= 65;

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', marginBottom: 8 }}>
        Image Quality Check
      </h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-6)' }}>
        Automated check to ensure the label is readable and suitable for OCR.
      </p>

      {image && (
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border)', marginBottom: 'var(--sp-5)' }}>
          <img src={image} alt="Label preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', background: 'var(--slate-900)' }} />
        </div>
      )}

      {checking ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-8)' }}>
          <span className="spinner spinner-lg" />
          <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>Analysing image quality…</p>
        </div>
      ) : (
        <>
          {!good && (
            <div className="alert alert-warning" style={{ marginBottom: 'var(--sp-5)' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Image quality is borderline.</strong>
                <p style={{ marginTop: 2 }}>Retaking the image will improve OCR accuracy and inspection reliability.</p>
              </div>
            </div>
          )}
          {good && (
            <div className="alert alert-success" style={{ marginBottom: 'var(--sp-5)' }}>
              <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <strong>Good image quality. Ready to process.</strong>
            </div>
          )}

          <div className="card card-padded" style={{ marginBottom: 'var(--sp-5)' }}>
            {[
              { label: 'Blur / Sharpness', val: quality.blur },
              { label: 'Brightness', val: quality.brightness },
              { label: 'Resolution', val: quality.resolution },
              { label: 'Text Visibility', val: quality.textVisible },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-2) 0', borderBottom: 'var(--border)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>{item.label}</span>
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)',
                  color: item.val === 'good' ? 'var(--color-compliant)' : item.val === 'acceptable' ? 'var(--color-warning)' : 'var(--color-violation)',
                  textTransform: 'uppercase',
                }}>
                  {item.val === 'good' ? '✓ Good' : item.val === 'acceptable' ? '~ Acceptable' : '✗ Poor'}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-3)', marginTop: 'var(--sp-1)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--slate-700)' }}>Overall Score</span>
              <strong style={{ color: good ? 'var(--color-compliant)' : 'var(--color-warning)' }}>{quality.score}/100</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            <button className="btn btn-secondary" onClick={onRetake}><RotateCcw size={14} /> Retake</button>
            {!good && (
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onProceed}>
                Proceed Anyway
              </button>
            )}
            {good && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onProceed}>
                Process Label <ChevronRight size={16} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Step 4 — Processing ---------- */
const PROCESSING_STEPS = [
  { msg: 'Reading label…', duration: 800 },
  { msg: 'Detecting mandatory declarations…', duration: 900 },
  { msg: 'Extracting product information…', duration: 1000 },
  { msg: 'Checking against Legal Metrology Rules, 2011…', duration: 1200 },
  { msg: 'Preparing compliance result…', duration: 700 },
];

function Step4Processing({ onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const run = () => {
      if (idx >= PROCESSING_STEPS.length) { setDone(true); return; }
      setStepIdx(idx);
      const t = setTimeout(() => { idx++; run(); }, PROCESSING_STEPS[idx].duration);
      return t;
    };
    const t = run();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (done) { const t = setTimeout(onComplete, 600); return () => clearTimeout(t); }
  }, [done, onComplete]);

  const pct = done ? 100 : Math.round(((stepIdx + 1) / PROCESSING_STEPS.length) * 90);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--sp-8) 0' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--color-action-blue-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-6)',
        border: '3px solid var(--color-action-blue)',
      }}>
        {done
          ? <CheckCircle size={36} color="var(--color-compliant)" />
          : <Shield size={36} color="var(--color-action-blue)" className="animate-pulse" />
        }
      </div>

      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', marginBottom: 8 }}>
        {done ? 'Analysis Complete' : 'Analysis in Progress'}
      </h2>
      <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-8)', maxWidth: 320 }}>
        {done ? 'Compliance analysis complete. Preparing results…' : PROCESSING_STEPS[stepIdx]?.msg}
      </p>

      <div style={{ width: '100%', maxWidth: 360, marginBottom: 'var(--sp-4)' }}>
        <div style={{
          height: 6, background: 'var(--slate-100)', borderRadius: 'var(--radius-full)',
          overflow: 'hidden', marginBottom: 'var(--sp-3)'
        }}>
          <div style={{
            height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-full)',
            background: 'var(--color-action-blue)',
            transition: 'width 600ms ease',
          }} />
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>
          Powered by LabelLens · Rules sourced from Legal Metrology (PC) Rules, 2011
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 340 }}>
        {PROCESSING_STEPS.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 'var(--text-sm)',
            color: i < stepIdx ? 'var(--color-compliant)' : i === stepIdx && !done ? 'var(--slate-700)' : 'var(--slate-300)',
            transition: 'color var(--transition-base)',
          }}>
            {i < stepIdx || done
              ? <CheckCircle size={14} color="var(--color-compliant)" />
              : i === stepIdx
              ? <span className="spinner" style={{ width: 14, height: 14, border: '2px solid var(--slate-200)', borderTopColor: 'var(--color-action-blue)' }} />
              : <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--slate-200)', display: 'inline-block' }} />
            }
            {s.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Step 5+6 — Results + Review ---------- */
function Step5Results({ declarations, overallStatus, confidence, onEdit, onFinalize }) {
  const fails = declarations.filter(d => d.status === 'fail').length;
  const uncertain = declarations.filter(d => d.status === 'uncertain').length;
  const passed = declarations.filter(d => d.status === 'pass').length;

  return (
    <div className="animate-fade-in">
      {/* Overall status banner */}
      <div className={`status-banner status-banner-${overallStatus}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          {overallStatus === 'compliant' && <CheckCircle size={28} />}
          {overallStatus === 'non-compliant' && <XCircle size={28} />}
          {overallStatus === 'needs-review' && <AlertTriangle size={28} />}
          <div>
            <p className="status-banner-label">
              {overallStatus === 'compliant' ? 'COMPLIANT' : overallStatus === 'non-compliant' ? 'NON-COMPLIANT' : 'NEEDS REVIEW'}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.85, marginTop: 2 }}>
              Confidence: {Math.round(confidence * 100)}% &nbsp;·&nbsp;
              {passed} passed · {fails} failed · {uncertain} uncertain
            </p>
          </div>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', opacity: 0.9 }}>
          {passed} / {declarations.length}
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 'var(--sp-5)' }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span><strong>Automated Analysis, Inspector-Verified.</strong> Review each declaration below. Correct any OCR errors and verify before finalizing.</span>
      </div>

      {/* Declaration cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {declarations.map(d => (
          <DeclarationCard key={d.id} decl={d} onEdit={onEdit} />
        ))}
      </div>

      <style>{`
        .status-banner {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--sp-5) var(--sp-6); border-radius: var(--radius-xl);
          margin-bottom: var(--sp-5); gap: var(--sp-4); flex-wrap: wrap;
        }
        .status-banner-label {
          font-size: var(--text-xl); font-weight: var(--fw-bold); line-height: 1;
        }
        .status-banner-compliant     { background: var(--color-compliant); color: #fff; }
        .status-banner-non-compliant { background: var(--color-violation); color: #fff; }
        .status-banner-needs-review  { background: var(--color-warning);   color: #fff; }
      `}</style>
    </div>
  );
}

function DeclarationCard({ decl, onEdit }) {
  const [expanded, setExpanded] = useState(decl.status !== 'pass');
  const [editMode, setEditMode] = useState(false);
  const [editVal, setEditVal] = useState(decl.correctedValue ?? decl.extractedValue ?? '');

  const statusColor = { pass: 'var(--color-compliant)', fail: 'var(--color-violation)', uncertain: 'var(--color-warning)' };
  const statusBg   = { pass: 'var(--color-compliant-bg)', fail: 'var(--color-violation-bg)', uncertain: 'var(--color-warning-bg)' };

  const handleSave = () => {
    onEdit(decl.id, editVal);
    setEditMode(false);
  };

  return (
    <div className="card" style={{ borderLeft: `3px solid ${statusColor[decl.status]}` }}>
      <button
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
          padding: 'var(--sp-4)', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left',
        }}
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls={`decl-${decl.id}`}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: statusBg[decl.status],
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {decl.status === 'pass' && <CheckCircle size={14} color="var(--color-compliant)" />}
          {decl.status === 'fail' && <XCircle size={14} color="var(--color-violation)" />}
          {decl.status === 'uncertain' && <AlertTriangle size={14} color="var(--color-warning)" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)' }}>{decl.label}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginTop: 2 }} className="truncate">
            {decl.correctedValue || decl.extractedValue || <em>Not detected</em>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <StatusBadge status={decl.status} size="sm" />
          <ChevronRight size={16} color="var(--slate-400)" style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }} />
        </div>
      </button>

      {expanded && (
        <div id={`decl-${decl.id}`} style={{ padding: '0 var(--sp-4) var(--sp-4)', borderTop: 'var(--border)' }} className="animate-fade-in">
          {/* Extracted value / edit */}
          <div style={{ marginTop: 'var(--sp-4)', marginBottom: 'var(--sp-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Extracted Value
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {decl.inspectorVerified
                  ? <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-compliant)', fontWeight: 600 }}>✓ Inspector verified</span>
                  : <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>Confidence: {Math.round(decl.confidence * 100)}%</span>
                }
                <button className="btn btn-ghost btn-sm" style={{ height: 28, padding: '0 8px' }} onClick={() => setEditMode(v => !v)} aria-label="Edit value">
                  <Edit3 size={13} /> Edit
                </button>
              </div>
            </div>

            {editMode ? (
              <div>
                {decl.originalOCRValue && decl.originalOCRValue !== editVal && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginBottom: 6 }}>
                    Original OCR: <code style={{ background: 'var(--slate-100)', padding: '1px 4px', borderRadius: 3 }}>{decl.originalOCRValue}</code>
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    style={{ flex: 1, height: 38 }}
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    placeholder="Enter corrected value..."
                    autoFocus
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{
                padding: 'var(--sp-3)', background: 'var(--slate-50)', border: 'var(--border)',
                borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--slate-700)',
                minHeight: 36
              }}>
                {decl.correctedValue
                  ? <><span style={{ color: 'var(--color-action-blue)', fontWeight: 600 }}>{decl.correctedValue}</span> <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>(corrected)</span></>
                  : decl.extractedValue
                  ? decl.extractedValue
                  : <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>Not detected on label</span>
                }
              </div>
            )}
          </div>

          {/* OCR Confidence */}
          {decl.confidence > 0 && (
            <div style={{ marginBottom: 'var(--sp-3)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', marginBottom: 4 }}>OCR Confidence</p>
              <ConfidenceBar value={decl.confidence} />
            </div>
          )}

          {/* Violation reason */}
          {decl.violationReason && (
            <div className={`alert ${decl.status === 'fail' ? 'alert-error' : 'alert-warning'}`} style={{ marginBottom: 'var(--sp-3)' }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 'var(--text-xs)' }}>{decl.violationReason}</span>
            </div>
          )}

          {/* Rule reference */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span className="badge badge-blue" style={{ fontSize: 10 }}>
              <FileText size={10} /> {decl.ruleReference}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 7 — Finalize Modal ---------- */
/* ---------- Step 8 — Report (simplified) ---------- */
function Step8Report({ state, onNew }) {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--color-compliant-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-4)',
        }}>
          <CheckCircle size={32} color="var(--color-compliant)" />
        </div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)' }}>Inspection Finalized</h2>
        <p style={{ color: 'var(--slate-500)', marginTop: 8 }}>Official inspection record has been created.</p>
      </div>

      <div className="card card-padded" style={{ marginBottom: 'var(--sp-6)', borderTop: '3px solid var(--color-trust-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection Record</p>
            <p style={{ fontWeight: 'var(--fw-bold)', color: 'var(--slate-900)', marginTop: 2 }}>{state.inspectionId}</p>
          </div>
          <StatusBadge status={state.overallStatus} />
        </div>
        {[
          ['Product', state.productName || 'Fortune Refined Sunflower Oil'],
          ['Brand',   state.brand || 'Adani Wilmar'],
          ['Location', state.location],
          ['Inspector', state.inspectorId || 'INS-2024-0047'],
          ['Finalized At', state.finalizedAt ? new Date(state.finalizedAt).toLocaleString('en-IN') : '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: 'var(--border)', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--slate-500)' }}>{k}</span>
            <span style={{ fontWeight: 500, color: 'var(--slate-800)', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <button className="btn btn-trust btn-lg btn-full" onClick={() => navigate(`/inspector/history/${state.inspectionId}`)}>
          <FileText size={18} /> View Full Report
        </button>
        <button className="btn btn-secondary btn-full" onClick={onNew}>
          <ScanLine size={16} /> Start Another Inspection
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   Main NewInspection Page
   ================================================================ */
export default function NewInspection() {
  const { state, dispatch } = useInspection();
  const navigate = useNavigate();
  const toast = useToast();
  const [captureMode, setCaptureMode] = useState('upload');
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  // Start fresh if step=1 (just created)
  useEffect(() => {
    if (!state.inspectionId) {
      dispatch({ type: 'NEW_INSPECTION' });
    }
  }, []);

  const goTo = (step) => dispatch({ type: 'SET_STEP', payload: step });

  const handleEntry = (mode) => {
    setCaptureMode(mode);
    goTo(2);
  };

  const handleCapture = (imageData) => {
    dispatch({ type: 'SET_IMAGE', payload: imageData });
    goTo(3);
  };

  const handleQualityProceed = () => {
    goTo(4);
  };

  const handleProcessingComplete = useCallback(() => {
    // Simulate product detection
    dispatch({
      type: 'SET_RESULT',
      payload: {
        declarations: SAMPLE_DECLARATIONS_FAIL,
        overallStatus: 'non-compliant',
        confidence: 0.83,
        productName: 'Fortune Refined Sunflower Oil',
        brand: 'Adani Wilmar',
        sku: 'FSO-1L-PNE',
      },
    });
    goTo(5);
  }, [dispatch]);

  const handleEdit = (id, correctedValue) => {
    dispatch({ type: 'UPDATE_DECLARATION', payload: { id, correctedValue } });
    toast('Declaration updated and re-validated.', 'success');
  };

  const handleFinalize = () => {
    dispatch({ type: 'FINALIZE' });
    setShowFinalizeModal(false);
    toast('Inspection finalized and synced successfully.', 'success');
  };

  const handleNew = () => {
    dispatch({ type: 'NEW_INSPECTION' });
    navigate('/inspector/new');
  };

  const step = state.step;

  return (
    <div>
      <div className="desktop-topbar">
        <div>
          <h1 className="page-title" style={{ fontSize: 'var(--text-xl)' }}>New Inspection</h1>
          <p className="page-subtitle">Legal Metrology (PC) Rules, 2011</p>
        </div>
        {state.inspectionId && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', fontFamily: 'monospace' }}>
            {state.inspectionId}
          </span>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'var(--sp-6)' }}>
        {step < 8 && <StepProgress current={step} />}

        {step === 1 && <Step1Entry onNext={handleEntry} />}
        {step === 2 && <Step2Capture mode={captureMode} onCapture={handleCapture} onBack={() => goTo(1)} />}
        {step === 3 && <Step3Quality image={state.capturedImage} onProceed={handleQualityProceed} onRetake={() => goTo(2)} />}
        {step === 4 && <Step4Processing onComplete={handleProcessingComplete} />}
        {(step === 5 || step === 6) && state.declarations.length > 0 && (
          <>
            <Step5Results
              declarations={state.declarations}
              overallStatus={state.overallStatus}
              confidence={state.confidence}
              onEdit={handleEdit}
              onFinalize={() => setShowFinalizeModal(true)}
            />
            <div className="sticky-footer">
              <button className="btn btn-secondary" onClick={() => dispatch({ type: 'CLEAR' }) || navigate('/inspector')}>
                Save as Draft
              </button>
              <button className="btn btn-trust" style={{ flex: 1 }} onClick={() => setShowFinalizeModal(true)}>
                <CheckSquare size={18} /> Finalize Inspection
              </button>
            </div>
          </>
        )}
        {step === 8 && <Step8Report state={state} onNew={handleNew} />}
      </div>

      {/* Finalize Modal */}
      <Modal
        open={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        title="Finalize this inspection?"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setShowFinalizeModal(false)}>Cancel</button>
            <button className="btn btn-trust" onClick={handleFinalize}>
              <CheckSquare size={16} /> Finalize
            </button>
          </>
        }
      >
        Finalizing will create the official inspection record and update risk intelligence for this brand and region.
        This action cannot be undone.
        <div className="alert alert-warning" style={{ marginTop: 'var(--sp-4)' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>Ensure all declarations have been reviewed and corrections have been made before finalizing.</span>
        </div>
      </Modal>
    </div>
  );
}
