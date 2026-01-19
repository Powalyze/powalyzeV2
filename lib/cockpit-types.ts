// ============================================================
// POWALYZE COCKPIT CLIENT — TYPES & CONSTANTS
// ============================================================

export const POWALYZE_BRAND = {
  primaryGold: '#D4AF37',
  primaryBlue: '#1B3B5F',
  bgDark: '#05070B',
  bgPanel: '#0B1018',
  textMain: '#F5F5F5',
  textSoft: '#A7B0C2',
  borderSoft: '#1C2432',
  accentGreen: '#3DD68C',
  accentRed: '#FF5C5C',
  accentAmber: '#FFC857',
};

export type GovernanceHorizon = 'S1' | 'S2' | 'S3';
export type RiskLevel = 'low' | 'medium' | 'high';

export type CockpitKPI = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'flat';
  variationPct: number;
  horizon: GovernanceHorizon;
  critical?: boolean;
};

export type GovernancePillar = 'Finance' | 'People' | 'Clients' | 'Operations' | 'Innovation';

export type GovernanceSignal = {
  id: string;
  pillar: GovernancePillar;
  title: string;
  description: string;
  risk: RiskLevel;
  horizon: GovernanceHorizon;
  confidence: number;
  suggestedAction: string;
};

export type Scenario = {
  id: string;
  label: string;
  description: string;
  horizon: GovernanceHorizon;
  impactScore: number;
  upside: string;
  downside: string;
};

export type ExecutiveStory = {
  id: string;
  title: string;
  narrative: string;
  horizon: GovernanceHorizon;
  focusPillars: GovernancePillar[];
  recommendedNextSteps: string[];
};

export type AiInsightRequest = {
  context: string;
  focusPillars: GovernancePillar[];
  horizon: GovernanceHorizon;
  language: 'fr' | 'en';
};

export type AiInsightResponse = {
  story: ExecutiveStory;
  signals: GovernanceSignal[];
  scenarios: Scenario[];
  meta: {
    generatedAt: string;
    model: string;
  };
};

export type Risk = {
  id: string;
  title: string;
  description: string;
  level: RiskLevel;
  probability: number;
  impact: number;
  projectId?: string;
  ownerId?: string;
  status: 'open' | 'mitigated' | 'closed';
};

export type Decision = {
  id: string;
  title: string;
  description: string;
  committee: string;
  date: string;
  ownerId?: string;
  status: 'open' | 'applied' | 'archived';
  impacts?: string;
};

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export type TeamMember = {
  id: string;
  email: string;
  fullName?: string;
  role: TeamRole;
  invitedAt?: string;
  status: 'active' | 'invited';
};

export type IntegrationType = 'powerbi' | 'jira' | 'sharepoint' | 'sql' | 'custom';

export type Integration = {
  id: string;
  type: IntegrationType;
  name: string;
  status: 'connected' | 'pending' | 'error';
  configSummary?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'on_hold' | 'closed';
  ownerId?: string;
};

export type InvitePayload = {
  email: string;
  fullName?: string;
  role: TeamRole;
};
