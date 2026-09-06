import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateInspectionId, SAMPLE_DECLARATIONS_FAIL } from '../data/mockData';

const InspectionContext = createContext(null);

const DRAFT_KEY = 'packiq_inspection_draft';

const initialState = {
  inspectionId: null,
  step: 1, // 1–8
  capturedImage: null,
  imageQuality: null, // { blur, brightness, score }
  processing: false,
  processingStep: 0,
  declarations: [],
  overallStatus: null, // 'compliant' | 'non-compliant' | 'needs-review'
  confidence: null,
  productName: '',
  brand: '',
  sku: '',
  location: 'Pune, Maharashtra',
  syncStatus: 'synced', // 'synced' | 'pending' | 'offline'
  finalized: false,
  finalizedAt: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NEW_INSPECTION':
      return {
        ...initialState,
        inspectionId: generateInspectionId(),
        step: 1,
      };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_IMAGE':
      return { ...state, capturedImage: action.payload };
    case 'SET_IMAGE_QUALITY':
      return { ...state, imageQuality: action.payload };
    case 'SET_PROCESSING':
      return { ...state, processing: action.payload };
    case 'SET_PROCESSING_STEP':
      return { ...state, processingStep: action.payload };
    case 'SET_RESULT': {
      const { declarations, overallStatus, confidence, productName, brand, sku } = action.payload;
      return { ...state, declarations, overallStatus, confidence, productName, brand, sku };
    }
    case 'UPDATE_DECLARATION': {
      const { id, correctedValue } = action.payload;
      const updated = state.declarations.map(d => {
        if (d.id !== id) return d;
        const newStatus = correctedValue
          ? (d.status === 'uncertain' || d.status === 'fail' ? 'pass' : d.status)
          : d.status;
        return {
          ...d,
          correctedValue,
          status: newStatus,
          inspectorVerified: true,
        };
      });
      const fails = updated.filter(d => d.status === 'fail').length;
      const uncertain = updated.filter(d => d.status === 'uncertain').length;
      const overallStatus = fails > 0 ? 'non-compliant' : uncertain > 0 ? 'needs-review' : 'compliant';
      return { ...state, declarations: updated, overallStatus };
    }
    case 'VERIFY_DECLARATION': {
      const updated = state.declarations.map(d =>
        d.id === action.payload ? { ...d, inspectorVerified: true } : d
      );
      return { ...state, declarations: updated };
    }
    case 'FINALIZE':
      return { ...state, finalized: true, finalizedAt: new Date().toISOString(), step: 8, syncStatus: 'synced' };
    case 'LOAD_DRAFT':
      return { ...initialState, ...action.payload };
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export function InspectionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist draft
  useEffect(() => {
    if (state.step > 1 && !state.finalized) {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch {}
    }
  }, [state]);

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (!draft.finalized) dispatch({ type: 'LOAD_DRAFT', payload: draft });
      }
    } catch {}
  }, []);

  return (
    <InspectionContext.Provider value={{ state, dispatch }}>
      {children}
    </InspectionContext.Provider>
  );
}

export const useInspection = () => {
  const ctx = useContext(InspectionContext);
  if (!ctx) throw new Error('useInspection must be used within InspectionProvider');
  return ctx;
};
