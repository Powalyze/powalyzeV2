/**
 * Data providers for Cockpit modes
 * - getDemoData(): Returns rich demo data for client showcase (MODE DEMO)
 * - getEmptyData(): Returns empty state for production use (MODE PRO)
 */

export interface Project {
  id: string;
  name: string;
  status: 'green' | 'orange' | 'red';
  progress: number;
  budget: string;
  team: string;
  risk: string;
  deadline: string;
  sponsor: string;
  source?: 'demo' | 'real'; // Marqueur pour filtrage
}

export interface Risk {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  probability: number;
  impact: number;
  owner: string;
  status: 'active' | 'mitigated' | 'resolved';
  lastUpdate: string;
  source?: 'demo' | 'real';
}

export interface Decision {
  id: string;
  title: string;
  date: string;
  origin: string;
  committee: string;
  owner: string;
  impact: 'high' | 'medium' | 'low';
  status: 'pending' | 'validated' | 'late';
  deadline?: string;
  source?: 'demo' | 'real';
}

export interface ChiefAction {
  id: string;
  title: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  source?: 'demo' | 'real';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: 'rapport' | 'presentation' | 'contrat' | 'analyse' | 'documentation' | 'autre';
  size: number; // in bytes
  uploadedAt: string;
  uploadedBy: string;
  version: number;
  tags: string[];
  shared: boolean;
  url?: string;
  source?: 'demo' | 'real';
}

export interface CockpitData {
  projects: Project[];
  risks: Risk[];
  decisions: Decision[];
  actions: ChiefAction[];
  documents: Document[];
  metrics: {
    activeProjects: number;
    criticalRisks: number;
    pendingDecisions: number;
    projectsAnalyzed?: number;
    risksDetected?: number;
    decisionsTracked?: number;
    opportunitiesIdentified?: number;
  };
}

/**
 * MODE PRO: Returns empty data for production clients
 * All values at zero, no fake data
 * User creates their own projects with AI predictions
 */
export function getEmptyData(): CockpitData {
  return {
    projects: [],
    risks: [],
    decisions: [],
    actions: [],
    documents: [],
    metrics: {
      activeProjects: 0,
      criticalRisks: 0,
      pendingDecisions: 0,
      projectsAnalyzed: 0,
      risksDetected: 0,
      decisionsTracked: 0,
      opportunitiesIdentified: 0,
    },
  };
}

/**
 * MODE DEMO: Returns rich demo data for client showcase
 * Fixed realistic examples to demonstrate platform capabilities
 */
export function getDemoData(): CockpitData {
  return {
    projects: [
      { id: '1', name: 'Powalyze v2.0 - Core Platform', status: 'green', progress: 78, budget: '2.1M€', team: 'Team Alpha', risk: 'Faible', deadline: '30 juin 2026', sponsor: 'Marie Dupont', source: 'demo' },
      { id: '2', name: 'Microsoft 365 Integration Suite', status: 'orange', progress: 45, budget: '850K€', team: 'Team Beta', risk: 'Moyen', deadline: '15 mai 2026', sponsor: 'Jean Martin', source: 'demo' },
      { id: '3', name: 'AI Predictive Analytics Engine', status: 'green', progress: 92, budget: '1.3M€', team: 'Team Gamma', risk: 'Faible', deadline: '20 avril 2026', sponsor: 'Sophie Laurent', source: 'demo' },
      { id: '4', name: 'Executive Mobile Dashboard', status: 'red', progress: 23, budget: '420K€', team: 'Team Delta', risk: 'Élevé', deadline: '1 mai 2026', sponsor: 'Pierre Dubois', source: 'demo' },
      { id: '5', name: 'Power BI Narrative Reports', status: 'green', progress: 88, budget: '680K€', team: 'Team Alpha', risk: 'Faible', deadline: '30 mai 2026', sponsor: 'Marie Dupont', source: 'demo' },
      { id: '6', name: 'Enterprise Security Framework', status: 'orange', progress: 34, budget: '950K€', team: 'Team Epsilon', risk: 'Moyen', deadline: '15 juillet 2026', sponsor: 'Thomas Petit', source: 'demo' },
    ],
    risks: [
      { id: '1', title: 'Retard livraison API externe', level: 'high', probability: 0.8, impact: 0.9, owner: 'Tech Lead', status: 'active', lastUpdate: '2026-01-17', source: 'demo' },
      { id: '2', title: 'Dépassement budget Mobile', level: 'high', probability: 0.7, impact: 0.8, owner: 'PMO', status: 'active', lastUpdate: '2026-01-16', source: 'demo' },
      { id: '3', title: 'Turnover Team Delta', level: 'medium', probability: 0.6, impact: 0.7, owner: 'RH', status: 'mitigated', lastUpdate: '2026-01-15', source: 'demo' },
      { id: '4', title: 'Conformité RGPD', level: 'medium', probability: 0.5, impact: 0.6, owner: 'Legal', status: 'active', lastUpdate: '2026-01-14', source: 'demo' },
    ],
    decisions: [
      { id: '1', title: 'Choix fournisseur API alternative', date: '2026-01-15', origin: 'COMEX', committee: 'Tech', owner: 'CTO', impact: 'high', status: 'pending', deadline: '2026-01-20', source: 'demo' },
      { id: '2', title: 'Budget additionnel Mobile Dashboard', date: '2026-01-14', origin: 'PMO', committee: 'Finance', owner: 'CFO', impact: 'high', status: 'pending', deadline: '2026-01-18', source: 'demo' },
      { id: '3', title: 'Embauche 2 seniors Team Delta', date: '2026-01-13', origin: 'RH', committee: 'RH', owner: 'DRH', impact: 'medium', status: 'validated', deadline: '2026-01-25', source: 'demo' },
      { id: '4', title: 'Certification ISO 27001', date: '2026-01-10', origin: 'Sécurité', committee: 'Stratégique', owner: 'CISO', impact: 'medium', status: 'validated', source: 'demo' },
    ],
    actions: [
      { id: '1', title: 'Accélérer Mobile Dashboard', impact: '+240K€ de ROI', priority: 'high', confidence: 0.92, source: 'demo' },
      { id: '2', title: 'Mitigation risque API', impact: '-4 semaines de retard', priority: 'high', confidence: 0.88, source: 'demo' },
      { id: '3', title: 'Optimiser budget Total', impact: '+380K€ économies', priority: 'medium', confidence: 0.85, source: 'demo' },
      { id: '4', title: 'Renforcer Team Delta', impact: '+15% vélocité', priority: 'medium', confidence: 0.79, source: 'demo' },
      { id: '5', title: 'Anticiper conformité RGPD', impact: '-90K€ de risque', priority: 'low', confidence: 0.75, source: 'demo' },
      { id: '6', title: 'Capitaliser AI Engine', impact: '+2 nouveaux projets', priority: 'low', confidence: 0.71, source: 'demo' },
    ],
    documents: [
      { id: '1', name: 'Rapport trimestriel Q1 2026.pdf', type: 'application/pdf', category: 'rapport', size: 2547896, uploadedAt: '2026-01-15', uploadedBy: 'Marie Dupont', version: 1, tags: ['Q1', 'finance', 'exec'], shared: true, source: 'demo' },
      { id: '2', name: 'Présentation COMEX Janvier.pptx', type: 'application/vnd.ms-powerpoint', category: 'presentation', size: 5243789, uploadedAt: '2026-01-14', uploadedBy: 'Jean Martin', version: 3, tags: ['COMEX', 'stratégie'], shared: true, source: 'demo' },
      { id: '3', name: 'Contrat Microsoft 365.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'contrat', size: 458762, uploadedAt: '2026-01-12', uploadedBy: 'Sophie Laurent', version: 2, tags: ['contrat', 'microsoft'], shared: false, source: 'demo' },
      { id: '4', name: 'Analyse risques portfolio.xlsx', type: 'application/vnd.ms-excel', category: 'analyse', size: 1879456, uploadedAt: '2026-01-10', uploadedBy: 'Pierre Dubois', version: 1, tags: ['risques', 'analyse'], shared: true, source: 'demo' },
      { id: '5', name: 'Guide utilisateur Powalyze v2.pdf', type: 'application/pdf', category: 'documentation', size: 3456789, uploadedAt: '2026-01-08', uploadedBy: 'Thomas Petit', version: 4, tags: ['guide', 'documentation'], shared: true, source: 'demo' },
      { id: '6', name: 'Roadmap 2026-2027.pdf', type: 'application/pdf', category: 'presentation', size: 1234567, uploadedAt: '2026-01-05', uploadedBy: 'Marie Dupont', version: 1, tags: ['roadmap', 'stratégie'], shared: true, source: 'demo' },
      { id: '7', name: 'Budget prévisionnel H1.xlsx', type: 'application/vnd.ms-excel', category: 'rapport', size: 987654, uploadedAt: '2026-01-03', uploadedBy: 'Jean Martin', version: 2, tags: ['budget', 'finance'], shared: false, source: 'demo' },
      { id: '8', name: 'Étude de marché IA 2026.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'analyse', size: 2345678, uploadedAt: '2025-12-28', uploadedBy: 'Sophie Laurent', version: 1, tags: ['IA', 'marché'], shared: true, source: 'demo' },
    ],
    metrics: {
      activeProjects: 6,
      criticalRisks: 2,
      pendingDecisions: 2,
      projectsAnalyzed: 6,
      risksDetected: 4,
      decisionsTracked: 4,
      opportunitiesIdentified: 8,
    },
  };
}

/**
 * Detects if running in DEMO or PRO mode
 * DEMO = No Supabase configured
 * PRO = Supabase URL configured
 */
export function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.length === 0;
}

/**
 * Returns appropriate data based on mode
 */
export function getCockpitData(): CockpitData {
  return isDemoMode() ? getDemoData() : getEmptyData();
}
