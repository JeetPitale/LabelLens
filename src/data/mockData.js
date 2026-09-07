// =========================================================
// LabelLens — Realistic Mock / Seed Data
// =========================================================

export const MOCK_USER = {
  inspector: {
    id: 'INS-2024-0047',
    name: 'Rajesh Kumar',
    role: 'inspector',
    badge: 'LM/MH/2024/047',
    district: 'Pune, Maharashtra',
    department: 'Dept. of Legal Metrology',
    avatar: null,
  },
  admin: {
    id: 'ADM-2024-0003',
    name: 'Priya Sharma',
    role: 'admin',
    badge: 'ADM/DLM/003',
    district: 'State HQ — Maharashtra',
    department: 'Dept. of Legal Metrology',
    avatar: null,
  },
  consumer: {
    id: 'CON-2024-8821',
    name: 'Amit Joshi',
    role: 'consumer',
    badge: null,
    district: 'Mumbai',
    department: null,
    avatar: null,
  },
  enforcement: {
    id: 'ENF-2024-0012',
    name: 'Vikramaditya Deshmukh',
    role: 'enforcement',
    badge: 'ENF/LM/MH/012',
    district: 'Maharashtra Enforcement Division',
    department: 'Dept. of Legal Metrology Enforcement Cell',
    avatar: null,
  },
};

export const VIOLATION_TYPES = [
  'Missing MRP',
  'Missing Net Quantity',
  'Missing Manufacturer Details',
  'Missing Date of Manufacture',
  'Incorrect MRP Format',
  'Missing Consumer Care Details',
  'Missing Country of Origin',
  'Sub-standard Font Size',
  'Misleading Net Quantity',
  'Missing Generic Name',
];

export const DECLARATION_TEMPLATES = [
  { id: 'manufacturer', label: 'Manufacturer / Packer / Importer', required: true },
  { id: 'generic_name', label: 'Generic / Common Name of Product', required: true },
  { id: 'net_quantity', label: 'Net Quantity (Weight / Volume / Number)', required: true },
  { id: 'mrp', label: 'Maximum Retail Price (MRP) incl. taxes', required: true },
  { id: 'manufacture_date', label: 'Month & Year of Manufacture / Packing / Import', required: true },
  { id: 'consumer_care', label: 'Consumer Care Details (Name, Address, Email / Phone)', required: true },
  { id: 'country_of_origin', label: 'Country of Origin (for imported goods)', required: false },
  { id: 'expiry_date', label: 'Best Before / Use By / Expiry Date', required: false },
  { id: 'instructions', label: 'Directions for Use / Storage Instructions', required: false },
];

export const generateInspectionId = () =>
  `INS-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

// ------- Sample Declarations for a Non-Compliant Product -------
export const SAMPLE_DECLARATIONS_FAIL = [
  {
    id: 'manufacturer',
    label: 'Manufacturer / Packer / Importer',
    extractedValue: 'Hindustan Food Pvt. Ltd., Plot 42, MIDC Pune',
    originalOCRValue: 'Hindustan Food Pvt. Ltd., Plot 42, MIDC Pune',
    correctedValue: null,
    confidence: 0.94,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(a)',
    inspectorVerified: false,
  },
  {
    id: 'generic_name',
    label: 'Generic / Common Name of Product',
    extractedValue: 'Refined Sunflower Oil',
    originalOCRValue: 'Refined Sunflower Oil',
    correctedValue: null,
    confidence: 0.97,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(b)',
    inspectorVerified: false,
  },
  {
    id: 'net_quantity',
    label: 'Net Quantity (Weight / Volume / Number)',
    extractedValue: '1 Litre',
    originalOCRValue: '1 Litre',
    correctedValue: null,
    confidence: 0.91,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(c)',
    inspectorVerified: false,
  },
  {
    id: 'mrp',
    label: 'Maximum Retail Price (MRP) incl. taxes',
    extractedValue: '₹ 249O',
    originalOCRValue: '₹ 249O',
    correctedValue: null,
    confidence: 0.61,
    status: 'uncertain',
    violationReason: 'OCR confidence is low. Value "₹ 249O" may contain recognition error. Manual verification required.',
    ruleReference: 'Rule 6(1)(d)',
    inspectorVerified: false,
  },
  {
    id: 'manufacture_date',
    label: 'Month & Year of Manufacture / Packing / Import',
    extractedValue: null,
    originalOCRValue: null,
    correctedValue: null,
    confidence: 0.0,
    status: 'fail',
    violationReason: 'Month and year of manufacture/packing declaration is absent from the scanned label. This is a mandatory declaration under Rule 6(1)(e).',
    ruleReference: 'Rule 6(1)(e)',
    inspectorVerified: false,
  },
  {
    id: 'consumer_care',
    label: 'Consumer Care Details',
    extractedValue: 'care@hindustanfood.in | 1800-XXX-XXXX',
    originalOCRValue: 'care@hindustanfood.in | 1800-XXX-XXXX',
    correctedValue: null,
    confidence: 0.88,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(f)',
    inspectorVerified: false,
  },
  {
    id: 'country_of_origin',
    label: 'Country of Origin',
    extractedValue: 'India',
    originalOCRValue: 'India',
    correctedValue: null,
    confidence: 0.99,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(g)',
    inspectorVerified: false,
  },
  {
    id: 'expiry_date',
    label: 'Best Before / Use By Date',
    extractedValue: 'Best Before 18 months from packing',
    originalOCRValue: 'Best Before 18 months from packing',
    correctedValue: null,
    confidence: 0.85,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(h)',
    inspectorVerified: false,
  },
  {
    id: 'instructions',
    label: 'Directions for Use / Storage Instructions',
    extractedValue: 'Store in cool dry place away from direct sunlight',
    originalOCRValue: 'Store in cool dry place away from direct sunlight',
    correctedValue: null,
    confidence: 0.90,
    status: 'pass',
    violationReason: null,
    ruleReference: 'Rule 6(1)(i)',
    inspectorVerified: false,
  },
];

export const SAMPLE_DECLARATIONS_PASS = SAMPLE_DECLARATIONS_FAIL.map(d => ({
  ...d,
  status: 'pass',
  confidence: 0.93 + Math.random() * 0.06,
  violationReason: null,
  extractedValue: d.extractedValue || 'Detected and verified',
  originalOCRValue: d.originalOCRValue || 'Detected and verified',
}));

// ------- Past Inspections -------
export const PAST_INSPECTIONS = [
  {
    inspectionId: 'INS-20240906-01',
    inspectorId: 'INS-2024-0047',
    productName: 'Fortune Refined Sunflower Oil',
    brand: 'Fortune / Adani Wilmar',
    sku: 'FSO-1L-PNE',
    timestamp: '2026-09-06T09:14:00+05:30',
    location: 'Khadki Market, Pune',
    status: 'non-compliant',
    violations: ['Missing Date of Manufacture', 'Incorrect MRP Format'],
    declarations: SAMPLE_DECLARATIONS_FAIL,
    syncStatus: 'synced',
    thumbnail: null,
  },
  {
    inspectionId: 'INS-20240906-02',
    inspectorId: 'INS-2024-0047',
    productName: 'Aashirvaad Atta (Whole Wheat)',
    brand: 'ITC — Aashirvaad',
    sku: 'AATA-5KG-PNE',
    timestamp: '2026-09-06T10:45:00+05:30',
    location: 'Deccan Gymkhana, Pune',
    status: 'compliant',
    violations: [],
    declarations: SAMPLE_DECLARATIONS_PASS,
    syncStatus: 'synced',
    thumbnail: null,
  },
  {
    inspectionId: 'INS-20240906-03',
    inspectorId: 'INS-2024-0047',
    productName: 'Maggi 2-Minute Noodles',
    brand: 'Nestlé India',
    sku: 'MGGI-70G-MUM',
    timestamp: '2026-09-06T12:30:00+05:30',
    location: 'Camp Area, Pune',
    status: 'needs-review',
    violations: ['Sub-standard Font Size'],
    declarations: SAMPLE_DECLARATIONS_FAIL.map(d => ({
      ...d,
      status: d.id === 'mrp' ? 'uncertain' : d.status === 'fail' ? 'uncertain' : d.status,
    })),
    syncStatus: 'pending',
    thumbnail: null,
  },
  {
    inspectionId: 'INS-20240905-04',
    inspectorId: 'INS-2024-0047',
    productName: 'Amul Butter (Pasteurised)',
    brand: 'Amul / GCMMF',
    sku: 'AMBT-500G-PNE',
    timestamp: '2026-09-05T14:22:00+05:30',
    location: 'Shivajinagar, Pune',
    status: 'compliant',
    violations: [],
    declarations: SAMPLE_DECLARATIONS_PASS,
    syncStatus: 'synced',
    thumbnail: null,
  },
  {
    inspectionId: 'INS-20240905-05',
    inspectorId: 'INS-2024-0047',
    productName: 'Tiger Biscuits (Glucose)',
    brand: 'Britannia Industries',
    sku: 'TGB-100G-PNE',
    timestamp: '2026-09-05T16:05:00+05:30',
    location: 'Kondhwa, Pune',
    status: 'non-compliant',
    violations: ['Missing Consumer Care Details', 'Missing Net Quantity'],
    declarations: SAMPLE_DECLARATIONS_FAIL,
    syncStatus: 'synced',
    thumbnail: null,
  },
  {
    inspectionId: 'INS-20240904-06',
    inspectorId: 'INS-2024-0047',
    productName: 'Saffola Active Oil',
    brand: 'Marico Industries',
    sku: 'SAFO-2L-MUM',
    timestamp: '2026-09-04T11:10:00+05:30',
    location: 'Hadapsar, Pune',
    status: 'non-compliant',
    violations: ['Missing MRP', 'Missing Date of Manufacture'],
    declarations: SAMPLE_DECLARATIONS_FAIL,
    syncStatus: 'synced',
    thumbnail: null,
  },
];

// ------- Risk Intelligence Data -------
export const RISK_BRANDS = [
  { rank: 1, name: 'Hindustan Food Pvt. Ltd.', riskScore: 87, inspections: 42, violations: 26, violationRate: 62, lastChecked: 'Today', trend: 'up', level: 'critical',
    breakdown: {
      'Missing MRP': 8, 'Missing Date of Manufacture': 10, 'Incorrect MRP Format': 5, 'Missing Consumer Care Details': 3, violations_detail: ['Repeated non-compliance over 6 inspections', 'Worsening trend last 30 days']
    }
  },
  { rank: 2, name: 'Regal Packagers Ltd.', riskScore: 74, inspections: 29, violations: 17, violationRate: 59, lastChecked: 'Yesterday', trend: 'up', level: 'critical',
    breakdown: { 'Missing Net Quantity': 7, 'Sub-standard Font Size': 6, 'Missing Generic Name': 4 }
  },
  { rank: 3, name: 'Sunrise Foods Pvt. Ltd.', riskScore: 61, inspections: 35, violations: 16, violationRate: 46, lastChecked: '2 days ago', trend: 'stable', level: 'high',
    breakdown: { 'Incorrect MRP Format': 9, 'Missing Country of Origin': 7 }
  },
  { rank: 4, name: 'Marico Industries', riskScore: 48, inspections: 55, violations: 18, violationRate: 33, lastChecked: 'Today', trend: 'down', level: 'high',
    breakdown: { 'Missing MRP': 5, 'Missing Date of Manufacture': 13 }
  },
  { rank: 5, name: 'Shree Packers', riskScore: 39, inspections: 22, violations: 7, violationRate: 32, lastChecked: '3 days ago', trend: 'stable', level: 'medium',
    breakdown: { 'Missing Consumer Care Details': 5, 'Missing Generic Name': 2 }
  },
  { rank: 6, name: 'Britannia Industries', riskScore: 28, inspections: 68, violations: 9, violationRate: 13, lastChecked: 'Today', trend: 'down', level: 'low',
    breakdown: { 'Sub-standard Font Size': 6, 'Missing Instructions': 3 }
  },
  { rank: 7, name: 'Nestlé India', riskScore: 22, inspections: 89, violations: 10, violationRate: 11, lastChecked: '1 day ago', trend: 'stable', level: 'low',
    breakdown: { 'Sub-standard Font Size': 10 }
  },
];

export const RISK_REGIONS = [
  { rank: 1, name: 'Dharavi Wholesale Market, Mumbai', riskScore: 79, inspections: 58, violations: 38, violationRate: 66, lastChecked: 'Today', trend: 'up', level: 'critical' },
  { rank: 2, name: 'Khadki Market, Pune', riskScore: 65, inspections: 44, violations: 26, violationRate: 59, lastChecked: 'Yesterday', trend: 'up', level: 'high' },
  { rank: 3, name: 'Crawford Market, Mumbai', riskScore: 52, inspections: 61, violations: 27, violationRate: 44, lastChecked: '2 days ago', trend: 'stable', level: 'high' },
  { rank: 4, name: 'Kondhwa, Pune', riskScore: 41, inspections: 33, violations: 11, violationRate: 33, lastChecked: '3 days ago', trend: 'stable', level: 'medium' },
  { rank: 5, name: 'Hadapsar MIDC, Pune', riskScore: 28, inspections: 27, violations: 6, violationRate: 22, lastChecked: '4 days ago', trend: 'down', level: 'low' },
];

// ------- Admin KPIs -------
export const ADMIN_KPIS = {
  inspectionsToday: 23,
  inspectionsMonth: 341,
  activeViolations: 87,
  highRiskBrands: 4,
  highRiskRegions: 3,
  complianceRate: 67,
};

// ------- Chart Data -------
export const INSPECTIONS_OVER_TIME = [
  { date: 'Sep 1', inspections: 18, compliant: 11, violations: 7 },
  { date: 'Sep 2', inspections: 24, compliant: 16, violations: 8 },
  { date: 'Sep 3', inspections: 20, compliant: 12, violations: 8 },
  { date: 'Sep 4', inspections: 31, compliant: 19, violations: 12 },
  { date: 'Sep 5', inspections: 28, compliant: 18, violations: 10 },
  { date: 'Sep 6', inspections: 23, compliant: 14, violations: 9 },
];

export const VIOLATION_FREQUENCY = [
  { type: 'Missing Mfg Date', count: 34 },
  { type: 'Missing MRP', count: 28 },
  { type: 'Incorrect MRP Format', count: 22 },
  { type: 'Font Size Issues', count: 19 },
  { type: 'Missing Net Qty', count: 17 },
  { type: 'Missing Care Details', count: 14 },
  { type: 'Missing Mfr Details', count: 11 },
];

export const COMPLIANCE_BY_CATEGORY = [
  { name: 'Compliant', value: 67, color: '#059669' },
  { name: 'Non-Compliant', value: 24, color: '#DC2626' },
  { name: 'Needs Review', value: 9, color: '#D97706' },
];

// ------- Consumer Scans -------
export const CONSUMER_SCANS = [
  {
    id: 'CSCAN-001',
    productName: 'Parle-G Original Glucose Biscuits',
    brand: 'Parle Products',
    date: '2026-09-06T18:30:00+05:30',
    result: 'compliant',
    issuesFound: 0,
    issues: [],
  },
  {
    id: 'CSCAN-002',
    productName: 'Unknown Rice Brand (Loose Packing)',
    brand: 'Unidentified',
    date: '2026-09-05T11:20:00+05:30',
    result: 'non-compliant',
    issuesFound: 3,
    issues: ['Missing MRP', 'Missing Manufacturer Details', 'Missing Manufacture Date'],
  },
];

// ------- Enforcement Legal Notices -------
export const MOCK_LEGAL_NOTICES = [
  {
    noticeId: 'NOTICE-2026-0089',
    inspectionId: 'INSP-2026-0042',
    productName: 'TasteBest Premium Tea 500g',
    brand: 'TasteBest Foods',
    violator: 'TasteBest FMCG India Pvt Ltd',
    district: 'Pune',
    actSection: 'Section 36(1) of Legal Metrology Act, 2009',
    violations: ['Missing MRP', 'Sub-standard Font Size'],
    status: 'Notice Issued',
    issueDate: '2026-09-06',
    compoundingFee: 25000,
    hearingDate: '2026-09-18',
    assignedOfficer: 'Vikramaditya Deshmukh',
  },
  {
    noticeId: 'NOTICE-2026-0085',
    inspectionId: 'INSP-2026-0038',
    productName: 'SpiceKing Turmeric Powder 100g',
    brand: 'SpiceKing',
    violator: 'SpiceKing Spices & Organics',
    district: 'Nagpur',
    actSection: 'Section 36(2) of Legal Metrology Act, 2009',
    violations: ['Missing Consumer Care Details', 'Missing Date of Manufacture'],
    status: 'Compounded',
    issueDate: '2026-09-02',
    compoundingFee: 15000,
    hearingDate: null,
    assignedOfficer: 'Vikramaditya Deshmukh',
  },
  {
    noticeId: 'NOTICE-2026-0078',
    inspectionId: 'INSP-2026-0029',
    productName: 'FreshDairy Skimmed Milk 1L',
    brand: 'FreshDairy',
    violator: 'FreshDairy Cooperatives',
    district: 'Mumbai',
    actSection: 'Section 39 / Rule 18(1) of LM (PC) Rules, 2011',
    violations: ['Incorrect MRP Format', 'Misleading Net Quantity'],
    status: 'Prosecution Filed',
    issueDate: '2026-08-28',
    compoundingFee: 50000,
    hearingDate: '2026-09-25',
    assignedOfficer: 'Vikramaditya Deshmukh',
  },
  {
    noticeId: 'NOTICE-2026-0071',
    inspectionId: 'INSP-2026-0015',
    productName: 'NutriCrunch Almonds 250g',
    brand: 'NutriCrunch',
    violator: 'NutriCrunch Foods Ltd',
    district: 'Nashik',
    actSection: 'Section 36(1) of Legal Metrology Act, 2009',
    violations: ['Missing Country of Origin'],
    status: 'Pending Response',
    issueDate: '2026-09-04',
    compoundingFee: 10000,
    hearingDate: '2026-09-15',
    assignedOfficer: 'Vikramaditya Deshmukh',
  },
];

