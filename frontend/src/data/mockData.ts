export interface FinancialDecision {
  id: string;
  type: 'loan' | 'credit_limit' | 'fraud_check';
  status: 'approved' | 'denied' | 'pending';
  approvalProbability: number;
  creditScore: number;
  dtiRatio: number;
  income: number;
  timestamp: string;
  modelVersion: string;
  userName: string;
}

export interface DecisionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  details: string;
}

export const mockDecisions: FinancialDecision[] = [
  {
    id: '1',
    type: 'loan',
    status: 'approved',
    approvalProbability: 87,
    creditScore: 745,
    dtiRatio: 32,
    income: 85000,
    timestamp: '2024-01-15T10:30:00Z',
    modelVersion: 'v2.3.1',
    userName: 'Sarah Johnson',
  },
  {
    id: '2',
    type: 'credit_limit',
    status: 'approved',
    approvalProbability: 92,
    creditScore: 780,
    dtiRatio: 28,
    income: 95000,
    timestamp: '2024-01-14T14:20:00Z',
    modelVersion: 'v2.3.1',
    userName: 'Michael Chen',
  },
  {
    id: '3',
    type: 'fraud_check',
    status: 'denied',
    approvalProbability: 23,
    creditScore: 620,
    dtiRatio: 45,
    income: 52000,
    timestamp: '2024-01-13T09:15:00Z',
    modelVersion: 'v2.3.0',
    userName: 'Emily Rodriguez',
  },
  {
    id: '4',
    type: 'loan',
    status: 'pending',
    approvalProbability: 68,
    creditScore: 695,
    dtiRatio: 38,
    income: 72000,
    timestamp: '2024-01-12T16:45:00Z',
    modelVersion: 'v2.3.1',
    userName: 'David Thompson',
  },
];

export const mockDecisionFactors: Record<string, DecisionFactor[]> = {
  '1': [
    { factor: 'Credit Score (745)', impact: 'positive', weight: 0.35 },
    { factor: 'Debt-to-Income Ratio (32%)', impact: 'positive', weight: 0.25 },
    { factor: 'Annual Income ($85,000)', impact: 'positive', weight: 0.20 },
    { factor: 'Employment History (4 years)', impact: 'positive', weight: 0.15 },
    { factor: 'Recent Credit Inquiries (2)', impact: 'negative', weight: -0.05 },
  ],
  '2': [
    { factor: 'Credit Score (780)', impact: 'positive', weight: 0.40 },
    { factor: 'Debt-to-Income Ratio (28%)', impact: 'positive', weight: 0.30 },
    { factor: 'Payment History (100% on-time)', impact: 'positive', weight: 0.20 },
    { factor: 'Credit Utilization (15%)', impact: 'positive', weight: 0.10 },
  ],
  '3': [
    { factor: 'Credit Score (620)', impact: 'negative', weight: -0.30 },
    { factor: 'Debt-to-Income Ratio (45%)', impact: 'negative', weight: -0.25 },
    { factor: 'Recent Missed Payments (3)', impact: 'negative', weight: -0.20 },
    { factor: 'High Credit Utilization (78%)', impact: 'negative', weight: -0.15 },
    { factor: 'Employment History (8 months)', impact: 'neutral', weight: -0.10 },
  ],
  '4': [
    { factor: 'Credit Score (695)', impact: 'neutral', weight: 0.15 },
    { factor: 'Debt-to-Income Ratio (38%)', impact: 'neutral', weight: 0.10 },
    { factor: 'Income Stability (2 years)', impact: 'positive', weight: 0.20 },
    { factor: 'Recent Bankruptcy Filing', impact: 'negative', weight: -0.25 },
  ],
};

export const mockAnomalies: Anomaly[] = [
  {
    id: '1',
    type: 'DTI Spike',
    severity: 'high',
    description: 'Debt-to-Income ratio increased by 15% in the last month',
    timestamp: '2024-01-15T08:00:00Z',
    details: 'Sudden increase from 32% to 47%. This may indicate new debt obligations or reduced income.',
  },
  {
    id: '2',
    type: 'Payment Pattern',
    severity: 'medium',
    description: 'Unusual number of repayments detected',
    timestamp: '2024-01-14T12:30:00Z',
    details: '5 repayments made in 3 days. This is significantly higher than your average pattern.',
  },
  {
    id: '3',
    type: 'Credit Inquiry',
    severity: 'medium',
    description: 'Multiple credit inquiries in short timeframe',
    timestamp: '2024-01-13T15:45:00Z',
    details: '4 hard inquiries detected within 2 weeks. Multiple inquiries can impact credit score.',
  },
  {
    id: '4',
    type: 'Transaction Location',
    severity: 'low',
    description: 'Transaction from unusual location detected',
    timestamp: '2024-01-12T09:20:00Z',
    details: 'Transaction detected from a location 500+ miles from your typical area.',
  },
];

export interface DataPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  impact: string;
}

export const mockDataPermissions: DataPermission[] = [
  {
    id: 'location',
    name: 'Use Location Data',
    description: 'Allow the system to use your location information for fraud detection',
    enabled: true,
    impact: 'Turning off location data may reduce fraud detection accuracy by up to 15%',
  },
  {
    id: 'transactions',
    name: 'Use Transaction History',
    description: 'Allow analysis of your transaction patterns for better decision-making',
    enabled: true,
    impact: 'Disabling transaction history will reduce approval probability by 10-20%',
  },
  {
    id: 'employment',
    name: 'Use Job Information',
    description: 'Include employment history and stability in decision models',
    enabled: true,
    impact: 'Employment data contributes to 15% of the decision model accuracy',
  },
  {
    id: 'social',
    name: 'Use Social Connections',
    description: 'Analyze social network data for alternative credit scoring',
    enabled: false,
    impact: 'Enabling this may improve approval odds by 5-10% for borderline cases',
  },
];
