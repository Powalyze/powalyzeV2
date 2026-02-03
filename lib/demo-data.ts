import { Project, Risk, Decision } from '@/types';

/**
 * Données de démonstration pour le mode Demo
 * 3 projets narratifs complets avec risques, décisions, etc.
 */

export function getDemoData() {
  const projects: Project[] = [
    {
      id: 'demo-project-1',
      organization_id: 'demo-org',
      name: 'Transformation Cloud',
      description: 'Migration complète de notre infrastructure vers AWS pour améliorer la scalabilité, réduire les coûts opérationnels de 30% et accélérer le time-to-market des nouvelles fonctionnalités. Ce projet stratégique implique la migration de 150+ applications, la refonte de l'architecture réseau et la formation de 200 collaborateurs.',
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
      description: 'Remplacement de notre CRM legacy par Salesforce pour unifier la vision client à 360°, automatiser les processus commerciaux et améliorer le taux de conversion de 25%. Impact sur 500 utilisateurs (forces de vente, support client, marketing).',
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
      description: 'Mise à niveau de SAP ECC vers S/4HANA pour bénéficier des dernières innovations (IA, analytics temps réel, UX Fiori). Projet structurant impliquant une revue complète des processus Finance, Supply Chain et RH. Préparation à la fin de support SAP ECC en 2027.',
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
      title: 'Compatibilité applications legacy avec architecture cloud-native',
      description: 'Plusieurs applications critiques (20+ ans d'âge) utilisent des technologies obsolètes incompatibles avec l'architecture cloud-native. La refactorisation complète nécessiterait 6 mois supplémentaires et un budget additionnel de 500K€.',
      level: 'high',
      probability: 70,
      impact: 85,
      status: 'monitoring',
      owner_id: 'demo-user-1',
      mitigation_plan: 'Stratégie hybrid cloud avec conteneurisation progressive via Docker/Kubernetes. POC en cours sur 3 applications pilotes. Décision attendue du COMEX pour extension budget.',
      created_at: new Date('2025-11-10'),
      updated_at: new Date('2026-01-20'),
    },
    {
      id: 'demo-risk-2',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Résistance au changement des équipes techniques',
      description: 'Les équipes Infrastructure (35 personnes) expriment des réticences face à la transition DevOps et au modèle IaC (Infrastructure as Code). Taux d\'adoption des formations: 45% seulement.',
      level: 'medium',
      probability: 60,
      impact: 50,
      status: 'monitoring',
      owner_id: 'demo-user-1',
      mitigation_plan: 'Programme de change management renforcé: ambassadeurs cloud, ateliers pratiques hebdomadaires, certifications AWS payées par l\'entreprise.',
      created_at: new Date('2025-12-05'),
      updated_at: new Date('2026-01-28'),
    },

    // Risques Refonte CRM
    {
      id: 'demo-risk-3',
      organization_id: 'demo-org',
      project_id: 'demo-project-2',
      title: 'Dépassement budgétaire de 15% (270K€)',
      description: 'Les customizations Salesforce nécessaires pour matcher nos processus métier uniques sont plus complexes que prévu. L\'intégration avec les 12 systèmes tiers (ERP, facturation, support) nécessite des développements spécifiques.',
      level: 'critical',
      probability: 85,
      impact: 75,
      status: 'open',
      owner_id: 'demo-user-2',
      mitigation_plan: 'Arbitrage COMEX requis: soit approuver la rallonge budget (+270K€), soit réduire le périmètre fonctionnel (retrait module Marketing Automation). Réunion prévue 15/02/2026.',
      created_at: new Date('2026-01-10'),
      updated_at: new Date('2026-02-01'),
    },
    {
      id: 'demo-risk-4',
      organization_id: 'demo-org',
      project_id: 'demo-project-2',
      title: 'Qualité des données migrées depuis ancien CRM',
      description: 'Audit des données révèle 35% de doublons, 20% de champs incomplets, formatage incohérent. La migration sans nettoyage préalable compromettrait la fiabilité du nouveau système.',
      level: 'high',
      probability: 90,
      impact: 70,
      status: 'monitoring',
      owner_id: 'demo-user-2',
      mitigation_plan: 'Programme de data cleansing en parallèle: scripts automatisés + revue manuelle par équipes métier. Délai: 6 semaines. Démarrage immédiat.',
      created_at: new Date('2025-12-20'),
      updated_at: new Date('2026-01-25'),
    },

    // Risques SAP S/4HANA
    {
      id: 'demo-risk-5',
      organization_id: 'demo-org',
      project_id: 'demo-project-3',
      title: 'Disponibilité consultants SAP S/4HANA certifiés',
      description: 'Pénurie mondiale de consultants S/4HANA expérimentés. Nos 3 prestataires clés signalent des difficultés à staffing avec profils seniors (8+ ans SAP).',
      level: 'medium',
      probability: 50,
      impact: 60,
      status: 'monitoring',
      owner_id: 'demo-user-3',
      mitigation_plan: 'Contractualisation early avec clauses pénalités, formation interne d\'une équipe de 5 consultants juniors, partenariat avec SAP pour accès à leur pool de freelances.',
      created_at: new Date('2025-12-15'),
      updated_at: new Date('2026-01-30'),
    },
  ];

  const decisions: Decision[] = [
    // Décisions Transformation Cloud
    {
      id: 'demo-decision-1',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Choix du cloud provider principal (AWS vs Azure vs GCP)',
      description: 'Sélection stratégique du fournisseur cloud qui supportera 80% de notre infrastructure pour les 5 prochaines années. Critères: coût, écosystème, support entreprise, présence data centers UE (RGPD).',
      committee: 'COMEX',
      decision_date: new Date('2025-10-15'),
      status: 'approved',
      owner_id: 'demo-user-1',
      impacts: [
        'Coûts opérationnels: -30% avec AWS (vs status quo)',
        'Compatibilité outils DevOps',
        'Stratégie multi-cloud secondaire (Azure backup)',
      ],
      created_at: new Date('2025-09-20'),
      updated_at: new Date('2025-10-15'),
    },
    {
      id: 'demo-decision-2',
      organization_id: 'demo-org',
      project_id: 'demo-project-1',
      title: 'Approuver budget additionnel de 300K€ pour refactorisation apps legacy',
      description: 'Suite identification risque critique sur compatibilité applications legacy, nécessité d\'arbitrer entre: 1) Approuver rallonge budget pour refactorisation complète, 2) Adopter stratégie hybrid cloud (coûts long terme +15%), 3) Reporter migration de 8 applications non-critiques.',
      committee: 'COMEX',
      decision_date: new Date('2026-02-15'),
      status: 'pending',
      owner_id: 'demo-user-1',
      impacts: [
        'Option 1: +300K€ budget, livraison Q2 2026 garantie',
        'Option 2: Pas de surcoût immédiat, OpEx +15%/an dès 2027',
        'Option 3: Économie 300K€, mais fragmentation architecture',
      ],
      created_at: new Date('2026-01-22'),
      updated_at: new Date('2026-02-01'),
    },

    // Décisions Refonte CRM
    {
      id: 'demo-decision-3',
      organization_id: 'demo-org',
      project_id: 'demo-project-2',
      title: 'Arbitrage dépassement budget CRM: rallonge 270K€ ou réduction périmètre',
      description: 'Le budget CRM est dépassé de 15% (270K€) en raison de la complexité des customizations. Décision urgente requise avant fin février pour ne pas bloquer l\'intégration avec ERP (jalons mars).',
      committee: 'COMEX',
      decision_date: new Date('2026-02-15'),
      status: 'pending',
      owner_id: 'demo-user-2',
      impacts: [
        'Option A: Approuver +270K€, périmètre complet livré Q2',
        'Option B: Retrait module Marketing Automation (économie 270K€), impact sur roadmap marketing 2026',
        'Option C: Réduction customizations, adoption processus standard Salesforce (risque adoption utilisateurs)',
      ],
      created_at: new Date('2026-01-15'),
      updated_at: new Date('2026-02-01'),
    },

    // Décisions SAP
    {
      id: 'demo-decision-4',
      organization_id: 'demo-org',
      project_id: 'demo-project-3',
      title: 'Stratégie migration: Big Bang vs Phased Rollout',
      description: 'Choix entre migration totale sur 1 weekend (big bang) vs déploiement progressif par filiale sur 6 mois. Impact sur risque, coûts, complexité.',
      committee: 'CODIR',
      decision_date: new Date('2026-03-01'),
      status: 'pending',
      owner_id: 'demo-user-3',
      impacts: [
        'Big Bang: Risque élevé, coût réduit (-400K€), ROI rapide',
        'Phased: Risque maîtrisé, coûts +400K€, ROI progressif',
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
