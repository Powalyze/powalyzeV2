import { Project, Risk, Decision } from '@/types';

/**
 * Donnees de demonstration pour le mode Demo
 * 3 projets narratifs complets avec risques, decisions, etc.
 */

export function getDemoData() {
  const projects: Project[] = [
    {
      id: 'demo-project-1',
      organization_id: 'demo-org',
      name: 'Transformation Cloud',
      description: 'Migration complete de notre infrastructure vers AWS pour ameliorer la scalabilite, reduire les couts operationnels de 30% et accelerer le time-to-market des nouvelles fonctionnalites. Ce projet strategique implique la migration de 150+ applications, la refonte de architecture reseau et la formation de 200 collaborateurs.',
      owner_id: 'demo-user-1',
      status: 'active',
      health: 'yellow',
      progress: 80,
      budget: 2500000,
      deadline: new Date('2026-03-31'),
      starred: true,
      created_at: new Date('2025-10-01'),
      updated_at: new Date('2026-02-01'),
    },
    {
      id: 'demo-project-2',
      organization_id: 'demo-org',
      name: 'Refonte CRM',
      description: 'Remplacement de notre CRM legacy par Salesforce pour unifier la vision client a 360o, automatiser les processus commerciaux et ameliorer le taux de conversion de 25%. Impact sur 500 utilisateurs (forces de vente, support client, marketing).',
      owner_id: 'demo-user-2',
      status: 'active',
      health: 'yellow',
      progress: 45,
      budget: 1800000,
      deadline: new Date('2026-06-30'),
      starred: true,
      created_at: new Date('2025-11-15'),
      updated_at: new Date('2026-02-01'),
    },
    {
      id: 'demo-project-3',
      organization_id: 'demo-org',
      name: 'Migration SAP S/4HANA',
      description: 'Mise a niveau de SAP ECC vers S/4HANA pour beneficier des dernieres innovations (IA, analytics temps reel, UX Fiori). Projet structurant impliquant une revue complete des processus Finance, Supply Chain et RH. Preparation a la fin de support SAP ECC en 2027.',
      owner_id: 'demo-user-3',
      status: 'active',
      health: 'green',
      progress: 30,
      budget: 4200000,
      deadline: new Date('2026-09-30'),
      starred: false,
      created_at: new Date('2025-12-01'),
      updated_at: new Date('2026-02-01'),
    },
  ];

  const risks: Risk[] = [
    // Risques Transformation Cloud
    {
      id: 'demo-risk-1',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Compatibilite applications legacy avec architecture cloud-native',
      description: 'Plusieurs applications critiques (20+ ans age) utilisent des technologies obsoletes incompatibles avec architecture cloud-native. La refactorisation complete necessiterait 6 mois supplementaires et un budget additionnel de 500K euros.',
      level: 'high',
      probability: 70,
      impact: 85,
      status: 'monitoring',
      owner_id: 'demo-user-1',
      mitigation_plan: 'Strategie hybrid cloud avec conteneurisation progressive via Docker/Kubernetes. POC en cours sur 3 applications pilotes. Decision attendue du COMEX pour extension budget.',
      created_at: new Date('2025-11-10'),
      updated_at: new Date('2026-01-20'),
    },
    {
      id: 'demo-risk-2',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Resistance au changement des equipes techniques',
      description: 'Les equipes Infrastructure (35 personnes) expriment des reticences face a la transition DevOps et au modele IaC (Infrastructure as Code). Taux d\'adoption des formations: 45% seulement.',
      level: 'medium',
      probability: 60,
      impact: 50,
      status: 'monitoring',
      owner_id: 'demo-user-1',
      mitigation_plan: 'Programme de change management renforce: ambassadeurs cloud, ateliers pratiques hebdomadaires, certifications AWS payees par l\'entreprise.',
      created_at: new Date('2025-12-05'),
      updated_at: new Date('2026-01-28'),
    },

    // Risques Refonte CRM
    {
      id: 'demo-risk-3',
      organization_id: 'demo-org',
      project_id: 'demo-project-2',
      title: 'Depassement budgetaire de 15% (270Keuros)',
      description: 'Les customizations Salesforce necessaires pour matcher nos processus metier uniques sont plus complexes que prevu. L\'integration avec les 12 systemes tiers (ERP, facturation, support) necessite des developpements specifiques.',
      level: 'critical',
      probability: 85,
      impact: 75,
      status: 'open',
      owner_id: 'demo-user-2',
      mitigation_plan: 'Arbitrage COMEX requis: soit approuver la rallonge budget (+270Keuros), soit reduire le perimetre fonctionnel (retrait module Marketing Automation). Reunion prevue 15/02/2026.',
      created_at: new Date('2026-01-10'),
      updated_at: new Date('2026-02-01'),
    },
    {
      id: 'demo-risk-4',
      organization_id: 'demo-org',
      project_id: 'demo-project-2',
      title: 'Qualite des donnees migrees depuis ancien CRM',
      description: 'Audit des donnees revele 35% de doublons, 20% de champs incomplets, formatage incoherent. La migration sans nettoyage prealable compromettrait la fiabilite du nouveau systeme.',
      level: 'high',
      probability: 90,
      impact: 70,
      status: 'monitoring',
      owner_id: 'demo-user-2',
      mitigation_plan: 'Programme de data cleansing en parallele: scripts automatises + revue manuelle par equipes metier. Delai: 6 semaines. Demarrage immediat.',
      created_at: new Date('2025-12-20'),
      updated_at: new Date('2026-01-25'),
    },

    // Risques SAP S/4HANA
    {
      id: 'demo-risk-5',
      organization_id: 'demo-org',
      project_id: 'demo-project-3',
      title: 'Disponibilite consultants SAP S/4HANA certifies',
      description: 'Penurie mondiale de consultants S/4HANA experimentes. Nos 3 prestataires cles signalent des difficultes a staffing avec profils seniors (8+ ans SAP).',
      level: 'medium',
      probability: 50,
      impact: 60,
      status: 'monitoring',
      owner_id: 'demo-user-3',
      mitigation_plan: 'Contractualisation early avec clauses penalites, formation interne d\'une equipe de 5 consultants juniors, partenariat avec SAP pour acces a leur pool de freelances.',
      created_at: new Date('2025-12-15'),
      updated_at: new Date('2026-01-30'),
    },
  ];

  const decisions: Decision[] = [
    // Decisions Transformation Cloud
    {
      id: 'demo-decision-1',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Choix du cloud provider principal (AWS vs Azure vs GCP)',
      description: 'Selection strategique du fournisseur cloud qui supportera 80% de notre infrastructure pour les 5 prochaines annees. Criteres: cout, ecosysteme, support entreprise, presence data centers UE (RGPD).',
      committee: 'COMEX',
      decision_date: new Date('2025-10-15'),
      status: 'approved',
      owner_id: 'demo-user-1',
      impacts: [
        'Couts operationnels: -30% avec AWS (vs status quo)',
        'Compatibilite outils DevOps',
        'Strategie multi-cloud secondaire (Azure backup)',
      ],
      created_at: new Date('2025-09-20'),
      updated_at: new Date('2025-10-15'),
    },
    {
      id: 'demo-decision-2',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Approuver budget additionnel de 300Keuros pour refactorisation apps legacy',
      description: 'Suite identification risque critique sur compatibilite applications legacy, necessite d\'arbitrer entre: 1) Approuver rallonge budget pour refactorisation complete, 2) Adopter strategie hybrid cloud (couts long terme +15%), 3) Reporter migration de 8 applications non-critiques.',
      committee: 'COMEX',
      decision_date: new Date('2026-02-15'),
      status: 'pending',
      owner_id: 'demo-user-1',
      impacts: [
        'Option 1: +300Keuros budget, livraison Q2 2026 garantie',
        'Option 2: Pas de surcout immediat, OpEx +15%/an des 2027',
        'Option 3: economie 300Keuros, mais fragmentation architecture',
      ],
      created_at: new Date('2026-01-22'),
      updated_at: new Date('2026-02-01'),
    },

    // Decisions Refonte CRM
    {
      id: 'demo-decision-3',
      organization_id: 'demo-org',
      project_id: 'demo-project-2',
      title: 'Arbitrage depassement budget CRM: rallonge 270Keuros ou reduction perimetre',
      description: 'Le budget CRM est depasse de 15% (270Keuros) en raison de la complexite des customizations. Decision urgente requise avant fin fevrier pour ne pas bloquer l\'integration avec ERP (jalons mars).',
      committee: 'COMEX',
      decision_date: new Date('2026-02-15'),
      status: 'pending',
      owner_id: 'demo-user-2',
      impacts: [
        'Option A: Approuver +270Keuros, perimetre complet livre Q2',
        'Option B: Retrait module Marketing Automation (economie 270Keuros), impact sur roadmap marketing 2026',
        'Option C: Reduction customizations, adoption processus standard Salesforce (risque adoption utilisateurs)',
      ],
      created_at: new Date('2026-01-15'),
      updated_at: new Date('2026-02-01'),
    },

    // Decisions SAP
    {
      id: 'demo-decision-4',
      organization_id: 'demo-org',
      project_id: 'demo-project-3',
      title: 'Strategie migration: Big Bang vs Phased Rollout',
      description: 'Choix entre migration totale sur 1 weekend (big bang) vs deploiement progressif par filiale sur 6 mois. Impact sur risque, couts, complexite.',
      committee: 'CODIR',
      decision_date: new Date('2026-03-01'),
      status: 'pending',
      owner_id: 'demo-user-3',
      impacts: [
        'Big Bang: Risque eleve, cout reduit (-400Keuros), ROI rapide',
        'Phased: Risque maitrise, couts +400Keuros, ROI progressif',
      ],
      created_at: new Date('2026-01-05'),
      updated_at: new Date('2026-01-30'),
    },
  ];

  return {
    projects,
    risks,
    decisions,
  };
}

export function getEmptyData() {
  return {
    projects: [],
    risks: [],
    decisions: [],
  };
}
