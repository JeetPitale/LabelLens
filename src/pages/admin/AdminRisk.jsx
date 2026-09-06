import React, { useState } from 'react';
import { RISK_BRANDS, RISK_REGIONS } from '../../data/mockData';
import RiskIntelligence from '../inspector/RiskIntelligence';

// Admin risk view reuses inspector risk intelligence
export default function AdminRisk() {
  return <RiskIntelligence />;
}
